const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User profile routes
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/password", userController.updatePassword);

module.exports = router;
