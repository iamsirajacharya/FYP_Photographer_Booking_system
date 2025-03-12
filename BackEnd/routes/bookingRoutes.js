const express = require("express");
const moment = require("moment");
const { authMiddleWare } = require("../utils/jwt");
const { checkRole } = require("../routes/userRoutes");

// Import Sequelize models
const { User } = require("../models/user");
const Booking = require("../models/booking");
const Notification = require("../models/notifications");
const Meeting = require("../models/meeting");

const BookingRouter = express.Router();

// GET all bookings with photographer and client names
BookingRouter.get("/", async (req, res) => {
  try {
    const data = await Booking.findAll({
      include: [
        { model: User, as: "photographer", attributes: ["name"] },
        { model: User, as: "client", attributes: ["name"] },
      ],
    });
    res.send({ data, ok: true });
  } catch (error) {
    console.error(error);
    res.send({ error: error.message, ok: false });
  }
});

// POST booking request
BookingRouter.post("/book", authMiddleWare, async (req, res) => {
  const { photographerId, startTime, endTime } = req.body;
  try {
    // Verify photographer exists
    const photographer = await User.findByPk(photographerId);
    if (!photographer) {
      return res
        .status(400)
        .json({ message: "Invalid photographer ID", ok: false });
    }
    // Create booking; note field names use photographerId and clientId
    await Booking.create({
      photographerId,
      clientId: req.user.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "pending",
    });
    return res
      .status(201)
      .json({ message: "Booking request sent successfully", ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message, ok: false });
  }
});

// GET all booking requests for a specific photographer by status
BookingRouter.get("/requests/:status", authMiddleWare, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { photographerId: req.user.id, status: req.params.status },
      include: [{ model: User, as: "client", attributes: ["name", "email"] }],
    });
    res.json({ ok: true, bookings });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, mssg: "Server Error", ok: false });
  }
});

// GET all booking requests for a specific client
BookingRouter.get("/requests", authMiddleWare, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { clientId: req.user.id },
      include: [
        { model: User, as: "photographer", attributes: ["name", "email"] },
      ],
    });
    res.json({ ok: true, bookings });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, mssg: "Server Error", ok: false });
  }
});

// POST to accept or reject a booking request
BookingRouter.post("/requests/:bookingid", authMiddleWare, async (req, res) => {
  try {
    const { bookingid } = req.params;
    const { status, Notification: notificationMessage } = req.body;

    const booking = await Booking.findOne({ where: { id: bookingid } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    // Check if the logged-in photographer owns the booking
    if (booking.photographerId !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    // Update booking status
    booking.status = status;
    await booking.save();

    // Create a notification for the client
    await Notification.create({
      fromUserId: req.user.id,
      toUserId: booking.clientId,
      bookingId: booking.id,
      message: notificationMessage,
    });
    res.json({
      ok: true,
      msg: "Booking updated and notification sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err.message });
  }
});

// POST to create a notification for a booking (alternative route)
BookingRouter.post(
  "/:bookingId/notifications",
  authMiddleWare,
  async (req, res) => {
    try {
      const { message } = req.body;
      const { bookingId } = req.params;
      const from = req.user.id;

      // Find booking ensuring the user is the photographer
      const booking = await Booking.findOne({
        where: { id: bookingId, photographerId: from },
      });
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      // Create notification
      const notification = await Notification.create({
        fromUserId: from,
        toUserId: booking.clientId,
        bookingId: booking.id,
        message,
      });
      res.json({ ok: true, notification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, msg: err.message });
    }
  }
);

// GET notifications for the logged-in user
BookingRouter.get("/notifications", authMiddleWare, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { toUserId: req.user.id },
      include: [
        { model: User, as: "sender" },
        { model: Booking, as: "booking" },
      ],
    });
    const messages = notifications.map((notification) => notification.message);
    res.json({ ok: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: error.message });
  }
});

// POST to create or update a meeting for a photographer
BookingRouter.post("/meeting/create", async (req, res) => {
  try {
    const { msg, photographer, link, name } = req.body;
    const meetingObj = { msg, link, name };

    // Find existing meeting record for the photographer
    let meetingData = await Meeting.findOne({ where: { photographer } });
    if (!meetingData) {
      // Create new record with the first meeting
      meetingData = await Meeting.create({
        photographer,
        meetings: [meetingObj],
      });
    } else {
      // Update the existing record's meetings array
      const currentMeetings = meetingData.meetings || [];
      currentMeetings.push(meetingObj);
      meetingData.meetings = currentMeetings;
      await meetingData.save();
    }
    res.json({ ok: true, msg: "Meeting created successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
});

// GET meeting information for a given photographer
BookingRouter.get("/:photographerId", async (req, res) => {
  try {
    const data = await Meeting.findOne({
      where: { photographer: req.params.photographerId },
    });
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
});

module.exports = {
  BookingRouter,
};
