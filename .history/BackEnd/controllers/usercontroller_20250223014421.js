const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/usermodel");
const handleAsync = require("../middlewares/handleAsync");
const responseError = require("../middlewares/responseError");

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

const fieldValidation = (field, fieldName) => {
  if (!field) {
    throw new responseError(`${fieldName} is required`, 400);
  }
};

// Register function
exports.register = handleAsync(async (req, res) => {
  const { username, email, password, phone_number, speciality } = req.body;
  console.log("Request Body:", req.body); // Debugging

  const profilePhoto = req.file ? req.file.buffer : null;

  fieldValidation(username, "Username");
  fieldValidation(email, "Email");
  fieldValidation(password, "Password");
  fieldValidation(phone_number, "Phone Number");
  fieldValidation(speciality, "Speciality");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phone_number,
    speciality,
    photo: profilePhoto,
  });

  res
    .status(201)
    .json({ message: "User registered successfully!", user: newUser });
});

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    // Generate JWT Token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware for Authentication
exports.protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Access Denied! No token provided." });

    const actualToken = token.split(" ")[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token!", error: error.message });
  }
};
