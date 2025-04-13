// review.controller.js
const { Review } = require("../models"); // Remove Booking since we won't use it
const { User } = require("../models"); // If you need to include user for the getReviewsByPhotographer

// Create a new review (directly, without requiring a booking)
exports.createReview = async (req, res) => {
  try {
    const { photographerId, rating, comment } = req.body;
    const userId = req.user.id;

    // Directly create the review without any booking dependency.
    const review = await Review.create({
      userId,
      photographerId,
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all reviews (optionally, you could add filtering by photographer or user)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update a review (only allowed if the review belongs to the authenticated user)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to update this review.",
      });
    }

    const { rating, comment } = req.body;
    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    await review.save();
    return res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete a review (only allowed if the review belongs to the authenticated user)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to delete this review.",
      });
    }

    await review.destroy();
    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all reviews for a specific photographer
exports.getReviewsByPhotographer = async (req, res) => {
  try {
    const { photographerId } = req.params;
    const reviews = await Review.findAll({
      where: { photographerId },
      // Exclude bookingId from the selected fields
      attributes: { exclude: ["bookingId"] },
      include: [
        {
          model: User,
          as: "users", // Ensure this alias matches your Review model association
          attributes: ["id", "name", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews by photographer:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
