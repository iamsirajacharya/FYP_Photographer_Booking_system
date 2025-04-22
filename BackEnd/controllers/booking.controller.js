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

  // Auto-generate booking number
  const bookingNumber = `BKG-${Date.now()}`;

  // Create booking
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
    transactionId: paymentMethod === "online" ? null : transactionId,
  });

  // For cash_in_hand, create payment record immediately
  if (paymentMethod === "cash_in_hand") {
    const payment = await db.Payment.create({
      bookingId: booking.id,
      userId: clientId,
      amount: totalPrice,
      currency: "NPR",
      paymentMethod,
      transactionId: null,
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

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
      payment,
    });
  }

  // For online payments, return booking details to initiate eSewa payment
  res.status(201).json({
    message: "Booking created successfully, proceed to payment",
    booking,
  });
});

// Get client bookings
const getClientBookings = catchAsync(async (req, res) => {
  const clientId = req.userId;
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = { clientId };
  if (status) {
    whereClause.status = status;
  }

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

  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email", "phone", "profileImage"],
      },
      {
        model: Photographer,
        as: "photographers",
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

  if (
    booking.clientId !== userId &&
    booking.photographers.userId !== userId &&
    req.userRole !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this booking" });
  }

  res.json({ booking });
});

// Update booking status
const updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let booking;

  const photographer =
    req.user && (req.user.photographerProfile || req.user.photographer);

  if (photographer) {
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

  await booking.update({
    status,
    ...(req.user.role === "client" && {
      canceledBy: req.user.id,
      cancelReason: req.body.reason || "Canceled by client",
    }),
  });

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
  const { bookingId } = req.params;
  const { rating, comment, photographerId } = req.body;

  if (!photographerId) {
    return res.status(400).json({ message: "Photographer ID is required" });
  }

  const existingReview = await Review.findOne({
    where: { userId, photographerId },
  });
  if (existingReview) {
    return res.status(400).json({
      message: "You have already reviewed this photographer",
    });
  }

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

// Get all bookings
const getAllBookings = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows: bookings } = await Booking.findAndCountAll({
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
      {
        model: User,
        as: "client",
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

// Get all bookings for a user
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

// Get booking by ID
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

  if (booking.clientId !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(booking);
});

module.exports = {
  createBooking,
  getAllBookings,
  getClientBookings,
  getBookingDetails,
  updateBookingStatus,
  createReview,
  getBookings,
  getBookingById,
};
