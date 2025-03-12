const bcrypt = require("bcryptjs");
const User = require("../models/usermodel");
const handleAsync = require("../middlewares/handleAsync");
const responseError = require("../middlewares/responseError");
const { sign } = require("../utils/jwt");

const fieldValidation = (field, fieldName) => {
  if (!field || field === "") {
    console.log(`Validation failed for: ${fieldName}`);
    throw new responseError(`${fieldName} is required`, 400);
  }
};

exports.register = handleAsync(async (req, res) => {
  try {
    const { Username, email, password, phone, role } = req.body; // Changed speciality to role
    const profile_image = req.file ? req.file.path : null;

    // Validation
    fieldValidation(Username, "Username");
    fieldValidation(email, "Email");
    fieldValidation(password, "Password");
    fieldValidation(role, "Role");

    // Validate role directly
    if (!["client", "photographer"].includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role selection" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user - Password hashing handled by model hooks
    const newUser = await User.create({
      Username,
      email,
      password,
      phone,
      role: role.toLowerCase(), // Store as lowercase
      profile_image,
      // location: req.body.location || null,
    });

    // Response - Don't include password
    const userResponse = {
      id: newUser.id,
      Username: newUser.Username,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      location: newUser.location,
    };

    res.status(201).json({
      message: "User registered successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User Login
exports.login = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  fieldValidation(email, "Email");
  fieldValidation(password, "Password");

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Compare password using the model method
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Wrong password" });
  }

  // Generate JWT token
  const token = sign({ userId: user.id }, { expiresIn: "1h" });

  // User data to return (exclude password)
  const userData = {
    id: user.id,
    Username: user.Username,
    email: user.email,
    role: user.role,
  };

  res.status(200).json({
    user: userData,
    token,
  });
});
