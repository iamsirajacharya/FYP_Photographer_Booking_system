const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");

const User = db.User;
const Photographer = db.Photographer;
const PhotographerSpecialty = db.PhotographerSpecialty;
const Specialty = db.Specialty;
const Booking = db.Booking;
const Review = db.Review;

// Apply to become a photographer
exports.applyAsPhotographer = catchAsync(async (req, res) => {
  const userId = req.userId;

  // 1) Check if user already has a photographer profile
  const existingProfile = await Photographer.findOne({ where: { userId } });
  if (existingProfile) {
    return res.status(400).json({
      message: "You already have a photographer profile",
      status: existingProfile.applicationStatus,
    });
  }

  // 2) Extract text fields from request body
  const {
    specialty, // Single primary specialty as a string (e.g. "Portrait")
    bio,
    experience,
    location,
    hourlyRate,
    equipment,
    availableDays,
  } = req.body;

  // 3) Parse JSON for 'specialties' array if provided
  let specialties = [];
  if (req.body.specialties) {
    try {
      specialties = JSON.parse(req.body.specialties); // e.g. ["Portrait","Wedding"]
    } catch (err) {
      return res.status(400).json({ message: "Invalid specialties format." });
    }
  }

  // 4) Gather uploaded file paths from req.files
  let portfolioImages = [];
  if (req.files && req.files.length > 0) {
    // Save only the filenames (or adjust if you need the full path)
    portfolioImages = req.files.map((file) => file.filename);
  }

  // 5) Create photographer profile
  const photographer = await Photographer.create({
    userId,
    specialty, // This must not be null. If none is provided, ensure your frontend sends a default.
    bio,
    experience,
    location,
    hourlyRate,
    equipment,
    availableDays,
    portfolioImages,
    applicationStatus: "pending",
    applicationDate: new Date(),
  });

  // 6) If multiple specialties exist, verify them using the Specialty model
  if (specialties.length > 0) {
    // Look up specialties by name in the Specialty model
    const foundSpecialties = await Specialty.findAll({
      where: { name: specialties },
    });

    // If not all provided specialties were found, return an error.
    if (foundSpecialties.length !== specialties.length) {
      return res.status(400).json({ message: "Some specialties are invalid." });
    }

    // Create pivot table records
    const specialtyRecords = foundSpecialties.map((spec) => ({
      photographerId: photographer.id,
      specialtyId: spec.id,
    }));

    await PhotographerSpecialty.bulkCreate(specialtyRecords);
  }

  // 7) Notify admins via Socket.io about the new application
  const io = req.app.get("io");
  if (io) {
    io.to("admin").emit("new_photographer_application", {
      photographerId: photographer.id,
      userId: photographer.userId,
      message: "A new photographer application has been submitted.",
    });
  }

  // 8) Respond to client
  return res.status(201).json({
    message: "Application submitted successfully",
    photographer,
  });
});

// Get photographer profile
exports.getProfile = catchAsync(async (req, res) => {
  const userId = req.userId;

  const photographer = await Photographer.findOne({
    where: { userId },
    include: [
      {
        model: PhotographerSpecialty,
        as: "specialties",
      },
    ],
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  res.json({ photographer });
});

// Update photographer profile
exports.updateProfile = catchAsync(async (req, res) => {
  const userId = req.userId;

  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  // Extract data from request
  const {
    specialty,
    bio,
    experience,
    location,
    hourlyRate,
    equipment,
    availableDays,
    portfolioImages,
  } = req.body;

  // Update photographer profile
  await photographer.update({
    specialty,
    bio,
    experience,
    location,
    hourlyRate,
    equipment,
    availableDays,
    portfolioImages,
  });

  // Update specialties if provided
  if (req.body.specialties) {
    // Delete existing specialties
    await PhotographerSpecialty.destroy({
      where: { photographerId: photographer.id },
    });

    // Add new specialties
    const specialtyRecords = req.body.specialties.map((name) => ({
      photographerId: photographer.id,
      name,
    }));

    await PhotographerSpecialty.bulkCreate(specialtyRecords);
  }

  res.json({
    message: "Profile updated successfully",
    photographer,
  });
});

// Get all photographers (public)
exports.getAllPhotographers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = "",
    specialty,
    minPrice,
    maxPrice,
    minRating,
    location,
  } = req.query;

  const offset = (page - 1) * limit;

  // Build where clause for the Photographer model
  const whereClause = {
    applicationStatus: "approved",
  };

  // Include user model for role + search
  const includeUser = {
    model: User,
    as: "users",
    attributes: ["id", "name", "email", "profileImage", "role"],
    where: {
      // Only include users with role: "photographer"
      // role: "photographer",
    },
  };

  // If the user has provided a search term, apply it to the user name/email
  if (search) {
    includeUser.where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  // Specialty filter
  if (specialty) {
    whereClause.specialty = { [Op.like]: `%${specialty}%` };
  }

  // Price range filters
  if (minPrice) {
    whereClause.hourlyRate = { ...whereClause.hourlyRate, [Op.gte]: minPrice };
  }
  if (maxPrice) {
    whereClause.hourlyRate = {
      ...whereClause.hourlyRate,
      [Op.lte]: maxPrice,
    };
  }

  // Rating filter
  if (minRating) {
    whereClause.averageRating = { [Op.gte]: minRating };
  }

  // Location filter
  if (location) {
    whereClause.location = { [Op.like]: `%${location}%` };
  }

  // Query photographers
  const { count, rows: photographers } = await Photographer.findAndCountAll({
    where: whereClause,
    include: [
      includeUser,
      {
        model: PhotographerSpecialty,
        as: "specialties",
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["averageRating", "DESC"]],
  });

  res.json({
    photographers,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalPhotographers: count,
  });
});

// Get photographer details (public)
exports.getPhotographerDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  const photographer = await Photographer.findByPk(id, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "phone", "email", "profileImage"],
      },
      {
        model: PhotographerSpecialty,
        as: "specialties",
      },
      {
        model: Review,
        as: "reviews",
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "phone", "email", "profileImage"],
          },
        ],
        limit: 5,
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

  // Get availability for next 30 days
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  const bookings = await Booking.findAll({
    attributes: ["date", "startTime", "endTime"],
    where: {
      photographerId: id,
      date: {
        [Op.between]: [today, thirtyDaysLater],
      },
      status: {
        [Op.in]: ["confirmed", "pending"],
      },
    },
  });

  // Format availability
  const availability = {};
  // Assume availableDays is stored as an object e.g. { monday: true, tuesday: true, ... }
  const availableDays = photographer.availableDays || {};

  // Map JavaScript day abbreviations to your availableDays keys
  const dayMapping = {
    Sun: "sunday",
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
    Sat: "saturday",
  };

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    const dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    // Convert the abbreviation to the key used in your availableDays object
    const dayKey = dayMapping[dayAbbr];

    // Check if the photographer is available on this day
    if (availableDays[dayKey]) {
      // Get bookings for this day
      const dayBookings = bookings.filter((b) => {
        return new Date(b.date).toISOString().split("T")[0] === dateString;
      });

      availability[dateString] = {
        available: true,
        bookings: dayBookings.map((b) => ({
          startTime: b.startTime,
          endTime: b.endTime,
        })),
      };
    } else {
      availability[dateString] = {
        available: false,
        bookings: [],
      };
    }
  }

  res.json({
    photographer,
    availability,
  });
});

// Get photographer bookings
exports.getPhotographerBookings = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Get photographer profile
  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {
    photographerId: photographer.id,
  };

  if (status) {
    whereClause.status = status;
  }

  // Get bookings
  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email", "phone", "profileImage"],
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["date", "DESC"]],
  });

  res.json({
    bookings,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalBookings: count,
  });
});

// Update booking status (photographer only)
exports.updateBookingStatus = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { status } = req.body;

  // Get photographer profile
  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  // Get booking along with the client details
  const booking = await Booking.findOne({
    where: {
      id,
      photographerId: photographer.id,
    },
    include: [
      {
        model: User,
        as: "client",
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
    await photographer.increment("completedBookings");
  }

  // Notify client via Socket.io about the booking status update
  const io = req.app.get("io");
  if (io && booking && booking.client) {
    io.to(`user:${booking.client.id}`).emit("booking_status_updated", {
      bookingId: booking.id,
      status: booking.status,
      message: "Your booking status has been updated by the photographer.",
    });
  }

  res.json({
    message: "Booking status updated successfully",
    booking,
  });
});

// Get photographer reviews
exports.getPhotographerReviews = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Get photographer profile
  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Get reviews
  const { count, rows: reviews } = await Review.findAndCountAll({
    where: { photographerId: photographer.id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Booking,
        as: "booking",
        attributes: ["id", "bookingNumber", "date", "sessionType"],
      },
    ],
    limit: Number.parseInt(limit),
    offset: Number.parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  res.json({
    reviews,
    totalPages: Math.ceil(count / limit),
    currentPage: Number.parseInt(page),
    totalReviews: count,
  });
});

// Get photographer earnings
exports.getPhotographerEarnings = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Get photographer profile
  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

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

  // Get earnings by date
  const earningsByDate = await Booking.findAll({
    attributes: [
      [db.sequelize.fn("DATE", db.sequelize.col("date")), "date"],
      [db.sequelize.fn("SUM", db.sequelize.col("totalPrice")), "amount"],
    ],
    where: {
      photographerId: photographer.id,
      status: {
        [Op.in]: ["confirmed", "completed"],
      },
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [db.sequelize.fn("DATE", db.sequelize.col("date"))],
    order: [[db.sequelize.fn("DATE", db.sequelize.col("date")), "ASC"]],
    raw: true,
  });

  // Get total earnings
  const totalEarnings =
    (await Booking.sum("totalPrice", {
      where: {
        photographerId: photographer.id,
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
      },
    })) || 0;

  // Get earnings for current period
  const periodEarnings =
    (await Booking.sum("totalPrice", {
      where: {
        photographerId: photographer.id,
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    })) || 0;

  // Get earnings by session type
  const earningsByType = await Booking.findAll({
    attributes: [
      "sessionType",
      [db.sequelize.fn("SUM", db.sequelize.col("totalPrice")), "amount"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where: {
      photographerId: photographer.id,
      status: {
        [Op.in]: ["confirmed", "completed"],
      },
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ["sessionType"],
    order: [[db.sequelize.literal("amount"), "DESC"]],
    raw: true,
  });

  res.json({
    earningsByDate,
    totalEarnings,
    periodEarnings,
    earningsByType,
  });
});

// Update photographer available days
exports.updateAvailability = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Retrieve photographer profile for the authenticated user
  const photographer = await Photographer.findOne({ where: { userId } });
  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  // Extract workingDays from the request body (this represents available days)
  const { workingDays } = req.body;
  if (!workingDays) {
    return res.status(400).json({ message: "No working days provided." });
  }

  // Update only the availableDays field
  await photographer.update({ availableDays: workingDays });

  res.json({
    message: "Availability updated successfully",
    photographer,
  });
});

// Get photographer availability for the next 30 days
// Get photographer availability for the next 30 days
exports.getAvailability = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("Fetching availability for photographer ID:", id);

  // Find photographer by ID
  const photographer = await Photographer.findByPk(id);
  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  // Retrieve bookings for the photographer within the next 30 days
  const bookings = await Booking.findAll({
    attributes: ["date", "startTime", "endTime"],
    where: {
      photographerId: id,
      date: {
        [Op.between]: [today, thirtyDaysLater],
      },
      status: {
        [Op.in]: ["confirmed", "pending"],
      },
    },
  });

  // Convert availableDays from an object to check per day.
  const availableDays = photographer.availableDays || {};
  // Mapping of day abbreviations to full lowercase day names used in availableDays
  const dayMapping = {
    Sun: "sunday",
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
    Sat: "saturday",
  };

  const availability = {};

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    // Get day abbreviation e.g. "Mon"
    const dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    // Convert to the key used in your availableDays object
    const dayKey = dayMapping[dayAbbr];

    if (availableDays[dayKey]) {
      // Filter bookings for the current date (comparing only the date portion)
      const dayBookings = bookings.filter((b) => {
        return new Date(b.date).toISOString().split("T")[0] === dateString;
      });
      availability[dateString] = {
        available: true,
        bookings: dayBookings.map((b) => ({
          startTime: b.startTime,
          endTime: b.endTime,
        })),
      };
    } else {
      availability[dateString] = {
        available: false,
        bookings: [],
      };
    }
  }

  res.json({ availability });
});
