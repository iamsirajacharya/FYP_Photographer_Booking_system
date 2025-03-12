const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/usermodel");
const handleAsync = require("../middlewares/handleAsync");
const responseError = require("../middlewares/responseError");
const { sign } = require("../Util/jwt");

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

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Wrong password" });
  }
});
