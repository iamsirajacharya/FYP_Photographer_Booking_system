const jwt = require("jsonwebtoken");
const db = require("../models");
const { generateToken } = require("../utils/tokenUtils");
const { catchAsync } = require("../utils/catchAsync");

const User = db.User;

// Register a new user
exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role = "client" } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "client" : role, // Prevent direct admin registration
  });

  // Generate token
  const token = generateToken(user);

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Login user
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if user is active
  if (user.status !== "active") {
    return res.status(401).json({ message: "Your account is not active" });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Update last active
  await user.update({ lastActive: new Date() });

  // Generate token
  const token = generateToken(user);

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Logout user
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

// Get current user
exports.getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: {
      exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

// Request password reset
exports.requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token
  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, {
    expiresIn: "1h",
  });

  // Save token to database
  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpires: Date.now() + 3600000, // 1 hour
  });

  // In a real app, send email with reset link
  // For demo, just return the token
  res.json({
    message: "Password reset email sent",
    resetToken, // Remove this in production
  });
});

// Reset password
exports.resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    // Find user
    const user = await User.findOne({
      where: {
        id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    await user.update({
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Refresh token
exports.refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let decoded;
  try {
    // Verify token but ignore expiration so we can refresh it.
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Find user by id decoded from token
  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Generate a new token
  const newToken = generateToken(user);

  // Set the new token in a cookie
  res.cookie("token", newToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Token refreshed", token: newToken });
});
