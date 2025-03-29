const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");

const User = db.User;
const Photographer = db.Photographer;
const Booking = db.Booking;
const Review = db.Review;

// Create a new booking
exports.createBooking = catchAsync(async (req, res) => {
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

  // Auto-generate booking number if not provided
  const bookingNumber = req.body.bookingNumber || `BKG-${Date.now()}`;

  // Create booking including bookingNumber
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
    bookingNumber, // <-- include bookingNumber here
    status: "pending",
    paymentStatus: "pending",
  });

  // Notify photographer via socket.io
  const io = req.app.get("io");
  if (io && photographer && photographer.users) {
    io.to(`user:${photographer.users.id}`).emit("new_booking", {
      bookingId: booking.id,
      status: booking.status,
      message: "You have a new booking request.",
    });
  }

  res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
});

// Get client bookings
exports.getClientBookings = catchAsync(async (req, res) => {
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
exports.getBookingDetails = catchAsync(async (req, res) => {
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
exports.updateBookingStatus = catchAsync(async (req, res) => {
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
    // Photographer branch: allow only confirmation
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
    if (status !== "confirmed") {
      return res.status(400).json({ message: "Invalid status update" });
    }
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
exports.createReview = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { bookingId } = req.params;
  const { rating, comment } = req.body;

  // Ensure the booking exists, belongs to the client, and is completed
  const booking = await Booking.findOne({
    where: { id: bookingId, clientId: userId, status: "completed" },
  });

  if (!booking) {
    return res.status(404).json({ message: "Completed booking not found" });
  }

  // Prevent duplicate reviews
  if (booking.isRated) {
    return res.status(400).json({ message: "Booking is already rated" });
  }

  // Create review
  const review = await Review.create({
    userId,
    photographerId: booking.photographerId,
    bookingId,
    rating,
    comment,
  });

  res.status(201).json({
    message: "Review submitted successfully",
    review,
  });
});

// Process payment for a booking
exports.processPayment = catchAsync(async (req, res) => {
  const clientId = req.userId;
  const { id } = req.params;
  const { paymentMethod, transactionId } = req.body;

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

  // Update booking with payment details
  await booking.update({
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod,
    transactionId,
    paymentDate: new Date(),
  });

  // Notify photographer via socket.io about payment confirmation
  const io = req.app.get("io");
  if (io && booking && booking.photographer && booking.photographer.users) {
    io.to(`user:${booking.photographer.users.id}`).emit(
      "booking_payment_confirmed",
      {
        bookingId: booking.id,
        status: booking.status,
        message: "Payment processed for your booking.",
      }
    );
  }

  res.json({
    message: "Payment processed successfully",
    booking,
  });
});

// Get all bookings (for admin or overview purposes)
exports.getAllBookings = catchAsync(async (req, res) => {
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
