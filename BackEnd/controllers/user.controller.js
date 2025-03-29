const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");

const User = db.User;

// Get user profile
exports.getProfile = catchAsync(async (req, res) => {
  const userId = req.userId;

  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

// Update user profile
exports.updateProfile = catchAsync(async (req, res) => {
  const userId = req.userId;
  // Now also extracting email along with name, phone, and profileImage
  const { name, email, phone, profileImage } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user
  await user.update({
    name,
    email,
    phone,
    profileImage,
  });

  res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    },
  });
});

// Update password
exports.updatePassword = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Update password (the hook in the User model will hash the new password)
  await user.update({ password: newPassword });

  res.json({ message: "Password updated successfully" });
});
