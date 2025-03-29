const express = require("express");
const bookingController = require("../controllers/booking.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Booking routes
router.post("/", bookingController.createBooking);
router.get("/all", bookingController.getAllBookings);
router.get("/me", bookingController.getClientBookings);
router.get("/:id", bookingController.getBookingDetails);
router.put("/:id/status", bookingController.updateBookingStatus);
router.post("/:bookingId/review", bookingController.createReview);
router.post("/:id/payment", bookingController.processPayment);

module.exports = router;
