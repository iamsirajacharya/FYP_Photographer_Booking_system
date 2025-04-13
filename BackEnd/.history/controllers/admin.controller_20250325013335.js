const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");

const User = db.User;
const Photographer = db.Photographer;
const Booking = db.Booking;
const Review = db.Review;

// Dashboard statistics
exports.getDashboardStats = catchAsync(async (req, res) => {
  // Get total users count
  const totalUsers = await User.count();

  // Get active photographers count
  const activePhotographers = await Photographer.count({
    where: { applicationStatus: "approved" },
  });

  // Get pending applications count
  const pendingApplications = await Photographer.count({
    where: { applicationStatus: "pending" },
  });

  // Get bookings this month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const bookingsThisMonth = await Booking.count({
    where: {
      createdAt: {
        [Op.gte]: firstDayOfMonth,
      },
    },
  });

  // Get revenue this month
  const revenueThisMonth =
    (await Booking.sum("totalPrice", {
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth,
        },
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
      },
    })) || 0;

  // Get average session price
  const avgSessionPrice = await Booking.findOne({
    attributes: [
      [db.sequelize.fn("AVG", db.sequelize.col("totalPrice")), "avgPrice"],
    ],
    where: {
      status: {
        [Op.in]: ["confirmed", "completed"],
      },
    },
    raw: true,
  });

  res.json({
    totalUsers,
    activePhotographers,
    pendingApplications,
    bookingsThisMonth,
    revenueThisMonth,
    avgSessionPrice: avgSessionPrice?.avgPrice || 0,
  });
});

// Get all users with pagination and filtering
exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = "", role, status } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  if (role) {
    whereClause.role = role;
  }

  if (status) {
    whereClause.status = status;
  }

  // Get users
  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    attributes: {
      exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
    },
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  res.json({
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalUsers: count,
  });
});

// Get user details
exports.getUserDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: {
      exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
    },
    include: [
      {
        model: Photographer,
        as: "photographerProfile",
        required: false,
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Get booking stats if user is a client
  let bookingStats = null;
  if (user.role === "client") {
    const totalBookings = await Booking.count({
      where: { clientId: id },
    });

    const completedBookings = await Booking.count({
      where: {
        clientId: id,
        status: "completed",
      },
    });

    const canceledBookings = await Booking.count({
      where: {
        clientId: id,
        status: "canceled",
      },
    });

    const totalSpent =
      (await Booking.sum("totalPrice", {
        where: {
          clientId: id,
          status: {
            [Op.in]: ["confirmed", "completed"],
          },
        },
      })) || 0;

    bookingStats = {
      totalBookings,
      completedBookings,
      canceledBookings,
      totalSpent,
    };
  }

  // Get booking stats if user is a photographer
  let photographerStats = null;
  if (user.photographerProfile) {
    const totalBookings = await Booking.count({
      where: { photographerId: user.photographerProfile.id },
    });

    const completedBookings = await Booking.count({
      where: {
        photographerId: user.photographerProfile.id,
        status: "completed",
      },
    });

    const canceledBookings = await Booking.count({
      where: {
        photographerId: user.photographerProfile.id,
        status: "canceled",
      },
    });

    const totalEarned =
      (await Booking.sum("totalPrice", {
        where: {
          photographerId: user.photographerProfile.id,
          status: {
            [Op.in]: ["confirmed", "completed"],
          },
        },
      })) || 0;

    photographerStats = {
      totalBookings,
      completedBookings,
      canceledBookings,
      totalEarned,
    };
  }

  res.json({
    user,
    bookingStats,
    photographerStats,
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email, status, role } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user
  await user.update({
    name,
    email,
    status,
    role,
  });

  res.json({
    message: "User updated successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// Delete user
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete user
  await user.destroy();

  res.json({ message: "User deleted successfully" });
});

exports.getPendingApplications = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await Photographer.findAndCountAll({
    where: { applicationStatus: "pending" },
    attributes: ["id", "specialty", "experience", "appliedDate", "location"],
    include: [
      {
        model: User,
        as: "users", // Make sure this alias matches your association in the Photographer model
        attributes: ["id", "name", "email", "phone"],
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["applicationDate", "DESC"]],
  });

  // Map the results to merge photographer and user data as needed by the frontend.
  const applications = rows.map((app) => ({
    id: app.id,
    // Use the associated user's data for name and email.
    name: app.user?.name,
    email: app.user?.email,
    // If location is stored on Photographer, use that; otherwise, adjust accordingly.
    location: app.location,
    specialty: app.specialty,
    experience: app.experience,
    appliedDate: app.appliedDate,
  }));

  res.json({
    applications,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalApplications: count,
  });
});

// Approve photographer application
exports.approveApplication = catchAsync(async (req, res) => {
  const { id } = req.params;

  const photographer = await Photographer.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!photographer) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Update photographer status
  await photographer.update({
    applicationStatus: "approved",
    approvedDate: new Date(),
  });

  // Update user role
  await photographer.user.update({
    role: "photographer",
  });

  // Notify user via socket.io (handled in the route)

  res.json({
    message: "Application approved successfully",
    photographer,
  });
});

// Reject photographer application
exports.rejectApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const photographer = await Photographer.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!photographer) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Update photographer status
  await photographer.update({
    applicationStatus: "rejected",
  });

  // Notify user via socket.io (handled in the route)

  res.json({
    message: "Application rejected successfully",
    photographer,
  });
});

// Get all bookings with pagination and filtering
exports.getAllBookings = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    startDate,
    endDate,
  } = req.query;

  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [{ bookingNumber: { [Op.like]: `%${search}%` } }];
  }

  if (status) {
    whereClause.status = status;
  }

  if (startDate && endDate) {
    whereClause.date = {
      [Op.between]: [startDate, endDate],
    };
  } else if (startDate) {
    whereClause.date = {
      [Op.gte]: startDate,
    };
  } else if (endDate) {
    whereClause.date = {
      [Op.lte]: endDate,
    };
  }

  // Get bookings
  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email"],
      },
      {
        model: Photographer,
        as: "photographer",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
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
  const { id } = req.params;

  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: Photographer,
        as: "photographer",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone"],
          },
        ],
      },
      {
        model: Review,
        as: "review",
      },
    ],
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.json({ booking });
});

// Update booking status
exports.updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: User,
        as: "client",
      },
      {
        model: Photographer,
        as: "photographer",
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      },
    ],
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update booking status
  await booking.update({ status });

  // If completed, update photographer stats
  if (status === "completed") {
    await Photographer.increment("completedBookings", {
      where: { id: booking.photographerId },
    });
  }

  // Notify users via socket.io (handled in the route)

  res.json({
    message: "Booking status updated successfully",
    booking,
  });
});

// Get reports and analytics
exports.getReports = catchAsync(async (req, res) => {
  const { period = "month" } = req.query;

  let startDate;
  const endDate = new Date();

  // Set start date based on period
  if (period === "week") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "month") {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (period === "year") {
    startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    // Custom period
    startDate = new Date(period);
  }

  // Get bookings by date
  const bookingsByDate = await Booking.findAll({
    attributes: [
      [db.sequelize.fn("DATE", db.sequelize.col("createdAt")), "date"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      [db.sequelize.fn("SUM", db.sequelize.col("totalPrice")), "revenue"],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [db.sequelize.fn("DATE", db.sequelize.col("createdAt"))],
    order: [[db.sequelize.fn("DATE", db.sequelize.col("createdAt")), "ASC"]],
    raw: true,
  });

  // Get top photographers
  const topPhotographers = await Photographer.findAll({
    attributes: [
      "id",
      "averageRating",
      "reviewCount",
      "completedBookings",
      [
        db.sequelize.literal(
          '(SELECT SUM(totalPrice) FROM Bookings WHERE photographerId = Photographer.id AND status IN ("confirmed", "completed"))'
        ),
        "revenue",
      ],
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [[db.sequelize.literal("revenue"), "DESC"]],
    limit: 5,
  });

  // Get popular services
  const popularServices = await Booking.findAll({
    attributes: [
      "sessionType",
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      [db.sequelize.fn("AVG", db.sequelize.col("totalPrice")), "avgPrice"],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ["sessionType"],
    order: [[db.sequelize.fn("COUNT", db.sequelize.col("id")), "DESC"]],
    limit: 5,
    raw: true,
  });

  // Get user growth
  const userGrowth = await User.findAll({
    attributes: [
      [
        db.sequelize.fn("DATE_FORMAT", db.sequelize.col("createdAt"), "%Y-%m"),
        "month",
      ],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [
      db.sequelize.fn("DATE_FORMAT", db.sequelize.col("createdAt"), "%Y-%m"),
    ],
    order: [
      [
        db.sequelize.fn("DATE_FORMAT", db.sequelize.col("createdAt"), "%Y-%m"),
        "ASC",
      ],
    ],
    raw: true,
  });

  res.json({
    bookingsByDate,
    topPhotographers,
    popularServices,
    userGrowth,
  });
});
