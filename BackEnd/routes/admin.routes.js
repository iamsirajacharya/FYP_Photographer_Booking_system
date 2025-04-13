const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
// router.use(authorizeRoles("admin"));

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserDetails);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Photographer management
router.get(
  "/photographers/applications",
  adminController.getPendingApplications
);
router.put("/photographers/:id/approve", adminController.approveApplication);
router.put("/photographers/:id/reject", adminController.rejectApplication);

// Booking management
router.get("/bookings", adminController.getAllBookings);
router.get("/bookings/:id", adminController.getBookingDetails);
router.put("/bookings/:id/status", adminController.updateBookingStatus);

// Reports
router.get("/reports", adminController.getReports);

module.exports = router;
