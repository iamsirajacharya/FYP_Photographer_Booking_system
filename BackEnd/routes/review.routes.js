const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
// Assume you have an authentication middleware that adds the user info to req.user
const { authenticate } = require("../middleware/auth");

// Create a new review (requires authentication)
router.post("/", authenticate, reviewController.createReview);

// Get all reviews
router.get("/", reviewController.getReviews);

// New route: Get reviews for a specific photographer
router.get(
  "/photographer/:photographerId",
  reviewController.getReviewsByPhotographer
);

// Get a review by its ID
router.get("/:id", reviewController.getReviewById);

// Update a review (requires authentication)
router.put("/:id", authenticate, reviewController.updateReview);

// Delete a review (requires authentication)
router.delete("/:id", authenticate, reviewController.deleteReview);

module.exports = router;
