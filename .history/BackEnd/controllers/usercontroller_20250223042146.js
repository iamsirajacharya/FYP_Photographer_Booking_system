const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/usermodel");
const handleAsync = require("../middlewares/handleAsync");
const responseError = require("../middlewares/responseError");

const fieldValidation = (field, fieldName) => {
  if (!field || field === "") {
    console.log(`Validation failed for: ${fieldName}`);
    throw new responseError(`${fieldName} is required`, 400);
  }
};

exports.register = handleAsync(async (req, res) => {
  try {
    const { username, email, password, phone_number, speciality } = req.body;
    const profilePhoto = req.file ? req.file.buffer : null;

    // Validation
    fieldValidation(username, "Username");
    fieldValidation(email, "Email");
    fieldValidation(password, "Password");
    fieldValidation(phone_number, "Phone Number");
    fieldValidation(speciality, "Speciality");

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      user_id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      phone_number,
      speciality,
      photo: profilePhoto,
    });

    // Response
    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.get({ plain: true }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Fetch user from the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    next(error); // Properly call next() to pass the error to the error handler
  }
};
