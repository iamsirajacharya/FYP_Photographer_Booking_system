const express = require("express");
const photographerController = require("../controllers/photographer.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { uploadPortfolioImages } = require("../middleware/multerConfig");

const router = express.Router();

// Public routes
router.get("/all/photographers", photographerController.getAllPhotographers);
router.get("/:id", photographerController.getPhotographerDetails);

// Protected routes
router.use(authenticate);

// Apply to become a photographer
// router.post("/apply", photographerController.applyAsPhotographer);
router.post(
  "/apply",
  uploadPortfolioImages,
  photographerController.applyAsPhotographer
);

// Photographer-only routes
router.get("/profile/me", photographerController.getProfile);
router.put(
  "/profile/me",
  authorizeRoles("photographer"),
  photographerController.updateProfile
);
router.get(
  "/bookings/me",
  authorizeRoles("photographer"),
  photographerController.getPhotographerBookings
);
router.put(
  "/bookings/:id/status",
  authorizeRoles("photographer"),
  photographerController.updateBookingStatus
);
router.get(
  "/reviews/me",
  authorizeRoles("photographer"),
  photographerController.getPhotographerReviews
);
router.get(
  "/earnings/me",
  authorizeRoles("photographer"),
  photographerController.getPhotographerEarnings
);

module.exports = router;
