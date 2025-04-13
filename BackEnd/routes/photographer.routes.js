const express = require("express");
const photographerController = require("../controllers/photographer.controller");
const { authenticate } = require("../middleware/auth");
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
router.put("/profile/me", photographerController.updateProfile);
router.get("/bookings/me", photographerController.getPhotographerBookings);
router.put("/bookings/:id/status", photographerController.updateBookingStatus);
router.get("/reviews/me", photographerController.getPhotographerReviews);
router.get("/earnings/me", photographerController.getPhotographerEarnings);
router.put("/availability", photographerController.updateAvailability);
router.get("/:id/availability", photographerController.getAvailability);
router.get("/:id/portfolio", photographerController.getPortfolio);

router.delete(
  "/portfolio/:imageId",
  photographerController.deletePortfolioImage
);

router.post(
  "/portfolio",
  uploadPortfolioImages,
  photographerController.uploadPortfolioImage
);

module.exports = router;
