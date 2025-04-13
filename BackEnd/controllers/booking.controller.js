const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");

const User = db.User;
const Photographer = db.Photographer;
const Booking = db.Booking;
const Review = db.Review;

// Create a new booking
const createBooking = catchAsync(async (req, res) => {
  const clientId = req.userId;
  const {
    photographerId,
    date,
    startTime,
    endTime,
    duration,
    location,
    sessionType,
    notes,
    paymentMethod,
    transactionId,
  } = req.body;

  // Validate photographer exists and include associated user details
  const photographer = await Photographer.findByPk(photographerId, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "email", "profileImage"],
      },
    ],
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

  // Check if photographer is approved
  if (photographer.applicationStatus !== "approved") {
    return res
      .status(400)
      .json({ message: "Photographer is not available for bookings" });
  }

  // Validate time range (ensure startTime is before endTime)
  if (new Date(`${date}T${startTime}`) >= new Date(`${date}T${endTime}`)) {
    return res.status(400).json({ message: "Invalid time range" });
  }

  // Calculate total price
  const totalPrice = photographer.hourlyRate * duration;

  // Validate payment method
  if (!paymentMethod || !["online", "cash_in_hand"].includes(paymentMethod)) {
    return res.status(400).json({
      message:
        "Invalid payment method. Must be either 'online' or 'cash_in_hand'",
    });
  }

  // For online payments, transactionId is required
  if (paymentMethod === "online" && !transactionId) {
    return res.status(400).json({
      message: "Transaction ID is required for online payments",
    });
  }

  // Auto-generate booking number if not provided
  const bookingNumber = req.body.bookingNumber || `BKG-${Date.now()}`;

  // Create booking including bookingNumber and payment details
  const booking = await Booking.create({
    clientId,
    photographerId,
    date,
    startTime,
    endTime,
    duration,
    location,
    sessionType,
    notes,
    totalPrice,
    bookingNumber,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod,
    transactionId: paymentMethod === "online" ? transactionId : null,
  });

  // Create payment record
  const payment = await db.Payment.create({
    bookingId: booking.id,
    userId: clientId,
    amount: totalPrice,
    paymentMethod,
    transactionId: paymentMethod === "online" ? transactionId : null,
    status: "pending",
  });

  // Notify photographer via socket.io
  const io = req.app.get("io");
  if (io && photographer && photographer.users) {
    io.to(`user:${photographer.users.id}`).emit("new_booking", {
      bookingId: booking.id,
      status: booking.status,
      paymentMethod,
      message: "You have a new booking request.",
    });
  }

  res.status(201).json({
    message: "Booking created successfully",
    booking,
    payment,
  });
});

// Get client bookings
const getClientBookings = catchAsync(async (req, res) => {
  const clientId = req.userId;
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = { clientId };
  if (status) {
    whereClause.status = status;
  }

  // Get bookings with photographer and user details
  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Photographer,
        as: "photographers",
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email", "profileImage"],
          },
        ],
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  res.json({
    bookings,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalBookings: count,
  });
});

// Get booking details
const getBookingDetails = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  // Get booking details along with client, photographer (with user details), and review
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email", "phone", "profileImage"],
      },
      {
        model: Photographer,
        as: "photographers", // Use the correct alias as defined in your associations
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email", "phone", "profileImage"],
          },
        ],
      },
      {
        model: Review,
        as: "reviews",
      },
    ],
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Check if user is authorized to view this booking
  if (
    booking.clientId !== userId &&
    booking.photographers.userId !== userId && // adjust according to the actual structure
    req.userRole !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this booking" });
  }

  res.json({ booking });
});

// Update booking status (client only for cancellations)
const updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let booking;
  // let photographer;

  // // Check if the user has a photographer profile from auth state
  // if (req.user && (req.user.photographerProfile || req.user.photographer)) {
  //   photographer = req.user.photographerProfile || req.user.photographer;
  // } else if (req.user) {
  //   // Fallback: fetch photographer from the database if not attached to req.user
  //   photographer = await Photographer.findOne({
  //     where: { userId: req.user.id },
  //   });
  // }
  const photographer =
    req.user && (req.user.photographerProfile || req.user.photographer);

  if (photographer) {
    // Photographer branch: allow status update to any valid status
    if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }
    booking = await Booking.findOne({
      where: { id, photographerId: photographer.id },
      include: [
        {
          model: Photographer,
          as: "photographers",
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "name", "email", "profileImage"],
            },
          ],
        },
      ],
    });
  } else if (req.user && req.user.role === "client") {
    // Client branch: allow only cancellation
    const clientId = req.user.id;
    booking = await Booking.findOne({
      where: { id, clientId },
      include: [
        {
          model: Photographer,
          as: "photographers",
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "name", "email", "profileImage"],
            },
          ],
        },
      ],
    });
    if (status !== "canceled") {
      return res.status(400).json({ message: "Invalid status update" });
    }
  } else if (req.user && req.user.role === "admin") {
    // Admin branch: update any booking
    booking = await Booking.findByPk(id, {
      include: [
        {
          model: Photographer,
          as: "photographers",
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "name", "email", "profileImage"],
            },
          ],
        },
      ],
    });
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update booking status and, if client, add cancellation details.
  await booking.update({
    status,
    ...(req.user.role === "client" && {
      canceledBy: req.user.id,
      cancelReason: req.body.reason || "Canceled by client",
    }),
  });

  // Socket notification (adjust as needed)
  const io = req.app.get("io");
  if (io && booking && booking.photographers && booking.photographers.users) {
    if (req.user.role === "client") {
      io.to(`user:${booking.photographers.users.id}`).emit("booking_canceled", {
        bookingId: booking.id,
        status: booking.status,
        message: "A booking has been canceled.",
      });
    } else if (photographer) {
      io.to(`user:${booking.clientId}`).emit("booking_accepted", {
        bookingId: booking.id,
        status: booking.status,
        message: "Your booking has been accepted by the photographer.",
      });
    }
  }

  res.json({
    message: "Booking status updated successfully",
    booking,
  });
});

// Create a review for a booking
const createReview = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { bookingId } = req.params; // Optional if provided
  const { rating, comment, photographerId } = req.body;

  // Check if photographerId is provided
  if (!photographerId) {
    return res.status(400).json({ message: "Photographer ID is required" });
  }

  // Prevent duplicate reviews
  const existingReview = await Review.findOne({
    where: { userId, photographerId },
  });
  if (existingReview) {
    return res.status(400).json({
      message: "You have already reviewed this photographer",
    });
  }

  // Create the review without checking for booking completion
  const review = await Review.create({
    userId,
    photographerId,
    bookingId: bookingId || null,
    rating,
    comment,
  });

  res.status(201).json({
    message: "Review submitted successfully",
    review,
  });
});

// Process payment for a booking
const processPayment = catchAsync(async (req, res) => {
  const clientId = req.userId;
  const { id } = req.params;
  const { paymentMethod, transactionId } = req.body;

  // Validate payment method
  if (!paymentMethod || !["online", "cash_in_hand"].includes(paymentMethod)) {
    return res.status(400).json({
      message:
        "Invalid payment method. Must be either 'online' or 'cash_in_hand'",
    });
  }

  // Get pending booking with photographer and associated user details
  const booking = await Booking.findOne({
    where: { id, clientId, status: "pending", paymentStatus: "pending" },
    include: [
      {
        model: Photographer,
        as: "photographers",
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email", "profileImage"],
          },
        ],
      },
    ],
  });

  if (!booking) {
    return res.status(404).json({ message: "Pending booking not found" });
  }

  // For online payments, transactionId is required
  if (paymentMethod === "online" && !transactionId) {
    return res.status(400).json({
      message: "Transaction ID is required for online payments",
    });
  }

  // Find the existing payment record
  const payment = await db.Payment.findOne({
    where: { bookingId: booking.id },
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment record not found" });
  }

  // Update payment record
  await payment.update({
    status: "completed",
    transactionId: paymentMethod === "online" ? transactionId : null,
    paymentDate: new Date(),
  });

  // Update booking with payment details
  await booking.update({
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod,
    transactionId: paymentMethod === "online" ? transactionId : null,
    paymentDate: new Date(),
  });

  // Notify photographer via socket.io about payment confirmation
  const io = req.app.get("io");
  if (io && booking && booking.photographers && booking.photographers.users) {
    io.to(`user:${booking.photographers.users.id}`).emit(
      "booking_payment_confirmed",
      {
        bookingId: booking.id,
        status: booking.status,
        paymentMethod,
        message: `Payment processed for your booking via ${
          paymentMethod === "online" ? "online payment" : "cash-in-hand"
        }.`,
      }
    );
  }

  res.json({
    message: "Payment processed successfully",
    booking,
    payment,
  });
});

// Get all bookings (for admin or overview purposes)
const getAllBookings = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows: bookings } = await Booking.findAndCountAll({
    include: [
      {
        model: Photographer,
        as: "photographers", // Make sure this alias matches your model association
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email", "profileImage"],
          },
        ],
      },
      {
        model: User,
        as: "client", // Assuming your Booking model associates with client as 'client'
        attributes: ["id", "name", "email", "profileImage"],
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  res.json({
    bookings,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalBookings: count,
  });
});

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { clientId: req.user.id },
    include: [
      {
        model: db.Photographer,
        as: "photographers",
        include: [
          {
            model: db.User,
            as: "users",
            attributes: ["id", "name", "email", "profileImage"],
          },
        ],
      },
    ],
  });
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id, {
    include: [
      {
        model: db.Photographer,
        as: "photographers",
        include: [
          {
            model: db.User,
            as: "users",
            attributes: ["id", "name", "email", "profileImage"],
          },
        ],
      },
    ],
  });

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if the booking belongs to the user
  if (booking.clientId !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(booking);
});

// @desc    Process payment for a booking
// @route   POST /api/bookings/:id/payment
// @access  Private
// const processPayment = asyncHandler(async (req, res) => {
//   const { paymentMethod, transactionId } = req.body;
//   const booking = await Booking.findByPk(req.params.id);

//   if (!booking) {
//     res.status(404);
//     throw new Error("Booking not found");
//   }

//   // Check if the booking belongs to the user
//   if (booking.clientId !== req.user.id) {
//     res.status(401);
//     throw new Error("Not authorized");
//   }

//   // Update booking with payment details
//   booking.paymentStatus = "paid";
//   booking.paymentMethod = paymentMethod;
//   booking.transactionId = transactionId;
//   booking.paymentDate = new Date();

//   const updatedBooking = await booking.save();

//   res.json(updatedBooking);
// });

module.exports = {
  createBooking,
  getAllBookings,
  getClientBookings,
  getBookingDetails,
  updateBookingStatus,
  createReview,
  processPayment,
  getBookings,
  getBookingById,
};
