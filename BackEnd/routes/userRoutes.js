const express = require("express");
// const User = require("../models/index.js");
// const { User } = require("../models");
const { User, Image } = require("../models");
// const Image = require("../models/image.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenList = {};
const session = require("express-session");
const { authMiddleWare } = require("../utils/jwt");
require("dotenv").config();
const userRoute = express.Router();
const cloudinary = require("../utils/cloudinaryConfig.js");

// Set up multer for file uploads
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to check user role
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

// Route for uploading images
userRoute.post(
  "/upload",
  upload.array("image", 5),
  authMiddleWare,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      // Use the first file in the array
      const file = req.files[0];
      // Convert the buffer to a Base64 data URI
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "MyAppUploads",
      });

      // Save the Cloudinary URL and Public ID in the database
      await Image.create({
        name: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        user_id: req.user.id,
      });

      res.send({
        message: "Image uploaded successfully to Cloudinary",
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Route for updating photographer details
userRoute.patch(
  "/submit_photographer_details",
  authMiddleWare,
  async (req, res) => {
    const payload = req.body;
    try {
      await User.update(payload, { where: { id: req.user.id } });
      res.send({ message: "Success" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Route for getting images along with approved photographers
userRoute.get("/images", async (req, res) => {
  try {
    const photographers = await User.findAll({ where: { approved: true } });
    const imagesData = await Image.findAll();
    // Group images by user_id
    const images = imagesData.reduce((acc, img) => {
      const key = img.user_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ _id: img.data, content_type: img.contentType });
      return acc;
    }, {});
    res.send({ images, photographers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for getting photographers sorted by price and filtered by location
userRoute.get("/SortByPrice", async (req, res) => {
  try {
    const whereClause = { approved: true };
    if (req.query.location) {
      whereClause.address = req.query.location;
    }
    const orderClause = [];
    if (req.query.Sortby) {
      orderClause.push([
        "price",
        req.query.Sortby.toLowerCase() === "asc" ? "ASC" : "DESC",
      ]);
    }
    const photographers = await User.findAll({
      where: whereClause,
      order: orderClause,
    });
    const imagesData = await Image.findAll();
    const images = imagesData.reduce((acc, img) => {
      const key = img.user_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ _id: img.data, content_type: img.contentType });
      return acc;
    }, {});
    res.send({ images, photographers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for getting photos of an individual photographer
userRoute.get("/images/:id", async (req, res) => {
  try {
    const photographer = await User.findOne({
      where: { id: req.params.id, approved: true },
    });
    const images = await Image.findAll({ where: { user_id: req.params.id } });
    // Format the images with URL, publicId, and any other properties you need
    const formattedImages = {
      [req.params.id]: images.map((img) => ({
        url: img.url, // Include the URL from your model
        publicId: img.publicId,
        content_type: img.contentType, // If this property exists, or remove if not needed
      })),
    };
    res.send({ Images: formattedImages, photographer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for getting all users
userRoute.get("/", async (req, res) => {
  try {
    const data = await User.findAll();
    res.send(data);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// Route for registering a new user
userRoute.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({ ok: false, msg: "User already exists" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ ok: false, msg: err.message });
      }
      try {
        await User.create({ name, email, password: hash, role });
        res.status(200).json({ ok: true, msg: "Registered Successfully" });
      } catch (error) {
        res.status(400).json({ ok: false, msg: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "User with this email not found", ok: false });
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (!isPasswordSame) {
      return res
        .status(401)
        .json({ msg: "Invalid email or password", ok: false });
    }
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    const response = {
      ok: true,
      token,
      msg: "Login Successful",
      role: user.role,
      approved: user.approved,
      id: user.id,
      userName: user.name,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
});

// Example: userRoute.post("/apply", authMiddleWare, ...)
userRoute.post(
  "/apply",
  authMiddleWare,
  upload.array("image", 5),
  async (req, res) => {
    try {
      // 1) Grab the user ID from the token
      const userId = req.user.id; // from authMiddleWare

      // 2) Find the user by ID instead of email
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({ msg: "User not found", ok: false });
      }

      // 3) Handle file uploads
      const uploadedImages = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;

          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: "MyAppPhotographers",
          });

          const newImage = await Image.create({
            name: file.originalname,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type: "sample",
            user_id: user.id, // or userId
          });

          uploadedImages.push(newImage);
        }
      } else {
        return res.status(400).json({ msg: "No files uploaded", ok: false });
      }

      // 4) Update user info from the request body
      const { name, camera, expertise, address, price } = req.body;
      if (name) user.name = name;
      if (camera) user.camera = camera;
      if (expertise) user.expertise = expertise;
      if (address) user.address = address;
      if (price) user.price = price;

      user.approved = false;
      user.role = "photographer";

      await user.save();

      return res.json({
        msg: "Application submitted successfully",
        ok: true,
        uploadedImages,
      });
    } catch (error) {
      console.error("Apply Photographer Error:", error);
      res.status(500).json({ msg: "Internal server error", ok: false });
    }
  }
);

// Route for getting pending photographer applications
userRoute.get("/pending", authMiddleWare, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "photographer", approved: false },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for updating photographer applications (approval)
userRoute.put(
  "/applications/:email",
  authMiddleWare,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { email } = req.params;
      const { approved } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      } else if (user.role !== "photographer") {
        return res.status(400).send({ error: "User is not a photographer" });
      } else {
        user.approved = approved;
        await user.save();
        res.send({ message: "Photographer application updated successfully" });
      }
    } catch (err) {
      res.status(500).send({ error: "Server Error" });
    }
  }
);

// Setup session middleware for logout
userRoute.use(
  session({
    secret: "dancingCar",
    resave: false,
    saveUninitialized: false,
  })
);

// Route for logging out the user
userRoute.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
});

// Route for getting info of a particular user by id
userRoute.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }
    const {
      name,
      email,
      role,
      approved,
      camera,
      expertise,
      address,
      price,
      id,
    } = user;
    res.send({
      ok: true,
      user: {
        name,
        email,
        role,
        approved,
        camera,
        expertise,
        address,
        price,
        id,
      },
    });
  } catch (error) {
    res.status(500).send({ msg: error.message, ok: false });
  }
});

// Route for blocking a user
userRoute.post(
  "/block/:userId",
  authMiddleWare,
  checkRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.params.user_id } });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      user.isBlocked = true;
      await user.save();
      return res.json({ ok: true, message: "User blocked Successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// GET all approved photographers with one sample image
userRoute.get("/allPhotographers", async (req, res) => {
  try {
    const photographers = await User.findAll({
      where: { approved: true, role: "photographer" },
      attributes: ["id", "name", "address", "price"],
      include: [
        {
          model: Image,
          as: "images",
          limit: 1, // fetch only one sample image
        },
      ],
    });

    // Format the data to include a single sampleImage
    const formatted = photographers.map((p) => {
      const sampleImage = p.images?.[0]?.url || null;
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        price: p.price,
        sampleImage,
      };
    });

    return res.json({ photographers: formatted });
  } catch (error) {
    console.error("GET /allPhotographers error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET full details for a photographer (including all images)
userRoute.get("/photographer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await User.findOne({
      where: { id, approved: true, role: "photographer" },
      attributes: [
        "id",
        "name",
        "email",
        "price",
        "address",
        "camera",
        "expertise",
        "bio", // if available
      ],
      include: [
        {
          model: Image,
          as: "images", // all images
        },
      ],
    });

    if (!photographer) {
      return res.status(404).json({ msg: "Photographer not found" });
    }

    res.json({ photographer });
  } catch (error) {
    console.error("GET /photographer/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  userRoute,
  checkRole,
};
