const express = require("express");
const bookingController = require("../controllers/booking.controller");
const esewaController = require("../controllers/esewa.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/photographer", bookingController.getPhotographerBookings);

// Booking routes
router.post("/", bookingController.createBooking);
// router.get("/photographer", bookingController.getPhotographerBookings);
router.get("/all", bookingController.getAllBookings);
router.get("/me", bookingController.getClientBookings);
router.get("/:id", bookingController.getBookingDetails);
router.put("/:id/status", bookingController.updateBookingStatus);
router.post("/:bookingId/review", bookingController.createReview);

// eSewa payment routes
router.post("/esewa/initiate", esewaController.initiateEsewaPayment);
router.get("/esewa/verify", esewaController.verifyEsewaPayment);

module.exports = router;
