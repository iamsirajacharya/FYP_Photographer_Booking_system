const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");
const {
  parseLocationString,
  reverseGeocode,
  calculateDistance,
} = require("../utils/geoCoding");

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
    specialty,
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
      specialties = JSON.parse(req.body.specialties);
    } catch (err) {
      return res.status(400).json({ message: "Invalid specialties format." });
    }
  }

  // 4) Gather uploaded file paths from req.files
  let portfolioImages = [];
  if (req.files && req.files.length > 0) {
    portfolioImages = req.files.map((file) => file.filename);
  }

  // 5) Create photographer profile
  const photographer = await Photographer.create({
    userId,
    specialty,
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
    const foundSpecialties = await Specialty.findAll({
      where: { name: specialties },
    });

    if (foundSpecialties.length !== specialties.length) {
      return res.status(400).json({ message: "Some specialties are invalid." });
    }

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
  const updateData = {
    specialty,
    bio,
    experience,
    location,
    hourlyRate,
    equipment,
    availableDays,
    portfolioImages,
  };

  await photographer.update(updateData);

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
    latitude,
    longitude,
    radius = 50, // Default radius in kilometers
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
      role: "photographer",
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

  // Location filter by text (if not using coordinates)
  if (location && !latitude && !longitude) {
    whereClause.location = { [Op.like]: `%${location}%` };
  }

  // Query photographers
  let { count, rows: photographers } = await Photographer.findAndCountAll({
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

  // If latitude and longitude are provided, filter by distance
  if (latitude && longitude) {
    const userLat = Number.parseFloat(latitude);
    const userLng = Number.parseFloat(longitude);
    const maxRadius = Number.parseFloat(radius);

    // Filter photographers by distance and add distance property
    photographers = photographers
      .filter((photographer) => {
        const coords = parseLocationString(photographer.location);
        if (!coords) return false;

        const distance = calculateDistance(
          userLat,
          userLng,
          coords.latitude,
          coords.longitude
        );

        photographer.dataValues.distance = Number.parseFloat(
          distance.toFixed(2)
        );

        return distance <= maxRadius;
      })
      .sort((a, b) => a.dataValues.distance - b.dataValues.distance);

    count = photographers.length;
  }

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
        attributes: { exclude: ["bookingId"] },
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

  const availability = {};
  const availableDays = photographer.availableDays || {};

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
    const dayKey = dayMapping[dayAbbr];

    if (availableDays[dayKey]) {
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

  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {
    photographerId: photographer.id,
  };

  if (status) {
    whereClause.status = status;
  }

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

  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

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

  await booking.update({ status });

  if (status === "completed") {
    await photographer.increment("completedBookings");
  }

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

  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

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

  const photographer = await Photographer.findOne({
    where: { userId },
  });

  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { period = "month" } = req.query;

  let startDate;
  const endDate = new Date();

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
    startDate = new Date(period);
  }

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

  const totalEarnings =
    (await Booking.sum("totalPrice", {
      where: {
        photographerId: photographer.id,
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
      },
    })) || 0;

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

  const earningsByPaymentMethod = await Booking.findAll({
    attributes: [
      "paymentMethod",
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
    group: ["paymentMethod"],
    order: [[db.sequelize.literal("amount"), "DESC"]],
    raw: true,
  });

  res.json({
    earningsByDate,
    totalEarnings,
    periodEarnings,
    earningsByType,
    earningsByPaymentMethod,
  });
});

// Update photographer available days
exports.updateAvailability = catchAsync(async (req, res) => {
  const userId = req.userId;

  const photographer = await Photographer.findOne({ where: { userId } });
  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const { workingDays } = req.body;
  if (!workingDays) {
    return res.status(400).json({ message: "No working days provided." });
  }

  await photographer.update({ availableDays: workingDays });

  res.json({
    message: "Availability updated successfully",
    photographer,
  });
});

// Get photographer availability for the next 30 days
exports.getAvailability = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("Fetching availability for photographer ID:", id);

  const photographer = await Photographer.findByPk(id);
  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

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

  const availableDays = photographer.availableDays || {};
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
    const dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    const dayKey = dayMapping[dayAbbr];

    if (availableDays[dayKey]) {
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

exports.getPortfolio = catchAsync(async (req, res) => {
  const { id } = req.params;
  const photographer = await Photographer.findByPk(id);
  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }
  const portfolioImages = photographer.portfolioImages || [];
  res.json({ portfolioImages });
});

exports.deletePortfolioImage = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { imageId } = req.params;

  const photographer = await Photographer.findOne({ where: { userId } });
  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  let portfolioImages = photographer.portfolioImages || [];

  if (!portfolioImages.includes(imageId)) {
    return res.status(404).json({ message: "Portfolio image not found" });
  }

  portfolioImages = portfolioImages.filter((img) => img !== imageId);

  await photographer.update({ portfolioImages });

  res.json({
    message: "Portfolio image deleted successfully",
    portfolioImages,
  });
});

exports.uploadPortfolioImage = catchAsync(async (req, res) => {
  const userId = req.userId;
  const photographer = await Photographer.findOne({ where: { userId } });
  if (!photographer) {
    return res.status(404).json({ message: "Photographer profile not found" });
  }

  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Safely parse existing portfolioImages
  let portfolioImages = photographer.portfolioImages || [];
  if (typeof portfolioImages === 'string') {
    try {
      portfolioImages = JSON.parse(portfolioImages);
      if (!Array.isArray(portfolioImages)) {
        console.warn("Parsed portfolioImages is not an array, resetting to []");
        portfolioImages = [];
      }
    } catch (err) {
      console.error("Invalid JSON in portfolioImages:", photographer.portfolioImages, err);
      portfolioImages = [];
    }
  }

  // Add new filenames
  const newImages = files.map(file => file.filename);
  portfolioImages = [...portfolioImages, ...newImages];

  // Update and reload
  try {
    await photographer.update({ portfolioImages });
    await photographer.reload();
    console.log("Updated portfolioImages:", photographer.portfolioImages);

    res.status(201).json({
      message: "Portfolio image(s) uploaded successfully",
      portfolioImages: photographer.portfolioImages,
    });
  } catch (error) {
    console.error("Failed to update portfolioImages in DB:", error);
    res.status(500).json({
      message: "Failed to save portfolio images to database",
      error: error.message,
    });
  }
});
exports.getPlaceFromCoordinates = catchAsync(async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  try {
    const result = await reverseGeocode(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude)
    );
    res.json({
      formattedAddress: result.formattedAddress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get place name from coordinates" });
  }
});

exports.getNearbyPhotographers = catchAsync(async (req, res) => {
  console.log("getNearbyPhotographers called with params:", req.query);

  const { latitude, longitude, radius = 50 } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  const userLat = Number.parseFloat(latitude);
  const userLng = Number.parseFloat(longitude);
  const maxRadius = Number.parseFloat(radius);

  try {
    const photographers = await Photographer.findAll({
      where: {
        applicationStatus: "approved",
        latitude: { [Op.ne]: null }, // Ensure latitude is not null
        longitude: { [Op.ne]: null }, // Ensure longitude is not null
      },
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name", "email", "profileImage", "role"],
          where: { role: "photographer" },
        },
      ],
    });

    console.log(
      `Found ${photographers.length} photographers before distance filtering`
    );

    const nearbyPhotographers = photographers
      .filter((photographer) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          photographer.latitude,
          photographer.longitude
        );

        photographer.dataValues.distance = Number.parseFloat(
          distance.toFixed(2)
        );

        const isWithinRadius = distance <= maxRadius;
        if (!isWithinRadius) {
          console.log(
            `Photographer ${photographer.id} is ${distance.toFixed(
              2
            )}km away (outside ${maxRadius}km radius)`
          );
        }
        return isWithinRadius;
      })
      .sort((a, b) => a.dataValues.distance - b.dataValues.distance);

    console.log(
      `Returning ${nearbyPhotographers.length} photographers within ${maxRadius}km radius`
    );

    return res.json({
      photographers: nearbyPhotographers,
      totalPhotographers: nearbyPhotographers.length,
    });
  } catch (error) {
    console.error("Error in getNearbyPhotographers:", error);
    return res.status(500).json({
      message: "An error occurred while fetching nearby photographers",
      error: error.message,
    });
  }
});
