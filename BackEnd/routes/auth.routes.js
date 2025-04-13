const express = require("express");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const { uploadProfileImage } = require("../middleware/multerConfig");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);
router.put(
  "/profile",
  authenticate,
  uploadProfileImage,
  authController.updateProfile
);
router.put("/password", authenticate, authController.updatePassword);

module.exports = router;
