// const express = require("express");
// const router = express.Router();
// // const {
// //   EsewaPaymentGateway,
// //   EsewaCheckStatus,
// //   base64Decode,
// // } = require("esewajs");

// const db = require("../models");
// const { catchAsync } = require("../utils/catchAsync");

// const Booking = db.Booking;
// const Payment = db.Payment;

// // Initiate eSewa Payment
// router.post(
//   "/initiate",
//   catchAsync(async (req, res) => {
//     const { EsewaPaymentGateway } = await import("esewajs");
//     const { bookingId, amount } = req.body;
//     const clientId = req.userId;

//     // Validate booking
//     const booking = await Booking.findOne({
//       where: { id: bookingId, clientId, paymentStatus: "pending" },
//     });

//     if (!booking) {
//       return res
//         .status(404)
//         .json({ message: "Booking not found or already paid" });
//     }

//     const transactionId = `TXN-${booking.bookingNumber}-${Date.now()}`;

//     try {
//       const paymentResponse = await EsewaPaymentGateway(
//         amount, // Total amount
//         0, // Product delivery charge
//         0, // Product service charge
//         0, // Tax amount
//         transactionId, // Unique transaction ID
//         process.env.MERCHANT_ID,
//         process.env.SECRET,
//         process.env.SUCCESS_URL,
//         process.env.FAILURE_URL,
//         process.env.ESEWA_PAYMENT_URL
//       );

//       if (!paymentResponse || paymentResponse.status !== 200) {
//         return res.status(400).json({ message: "Failed to initiate payment" });
//       }

//       // Update booking with transaction ID
//       await booking.update({ transactionId, paymentMethod: "online" });

//       // Create payment record
//       await Payment.create({
//         bookingId: booking.id,
//         userId: clientId,
//         amount,
//         currency: "NPR",
//         paymentMethod: "online",
//         transactionId,
//         status: "pending",
//       });

//       // Return the eSewa payment URL
//       res.status(200).json({ url: paymentResponse.request.res.responseUrl });
//     } catch (error) {
//       console.error("Error initiating eSewa payment:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })
// );

// // Handle eSewa Success Redirect
// router.get(
//   "/success",
//   catchAsync(async (req, res) => {
//     const { base64Decode } = await import("esewajs");
//     const { data } = req.query; // eSewa sends base64-encoded data

//     if (!data) {
//       return res.redirect(
//         `${process.env.FRONTEND_FAILURE_URL}?error=Invalid payment data`
//       );
//     }

//     try {
//       const decoded = base64Decode(data);
//       const transactionId = decoded.transaction_uuid;

//       // Find booking by transaction ID
//       const booking = await Booking.findOne({
//         where: { transactionId },
//         include: [{ model: Payment, as: "payments" }],
//       });

//       if (!booking) {
//         return res.redirect(
//           `${process.env.FRONTEND_FAILURE_URL}?error=Booking not found`
//         );
//       }

//       // Verify payment status
//       const paymentStatus = await EsewaCheckStatus(
//         booking.totalPrice,
//         transactionId,
//         process.env.MERCHANT_ID,
//         process.env.ESEWA_STATUS_CHECK_URL
//       );

//       if (
//         paymentStatus.status === 200 &&
//         paymentStatus.data.status === "COMPLETE"
//       ) {
//         // Update booking and payment status
//         await booking.update({
//           paymentStatus: "paid",
//           status: "confirmed",
//           paymentDate: new Date(),
//         });

//         const payment = booking.payments[0];
//         await payment.update({
//           status: "completed",
//           paymentDate: new Date(),
//         });

//         // Notify photographer via socket.io
//         const io = req.app.get("io");
//         if (io && booking.photographerId) {
//           const photographer = await db.Photographer.findByPk(
//             booking.photographerId,
//             {
//               include: [{ model: db.User, as: "users" }],
//             }
//           );
//           if (photographer && photographer.users) {
//             io.to(`user:${photographer.users.id}`).emit(
//               "booking_payment_confirmed",
//               {
//                 bookingId: booking.id,
//                 status: booking.status,
//                 paymentMethod: "online",
//                 message:
//                   "Payment processed for your booking via online payment.",
//               }
//             );
//           }
//         }

//         return res.redirect(
//           `${process.env.FRONTEND_SUCCESS_URL}?bookingId=${booking.id}`
//         );
//       } else {
//         await booking.update({ paymentStatus: "failed" });
//         const payment = booking.payments[0];
//         await payment.update({ status: "failed" });
//         return res.redirect(
//           `${process.env.FRONTEND_FAILURE_URL}?error=Payment verification failed`
//         );
//       }
//     } catch (error) {
//       console.error("Error processing eSewa success:", error);
//       return res.redirect(
//         `${process.env.FRONTEND_FAILURE_URL}?error=Server error`
//       );
//     }
//   })
// );

// // Handle eSewa Failure Redirect
// router.get(
//   "/failure",
//   catchAsync(async (req, res) => {
//     const { base64Decode } = await import("esewajs");
//     const { data } = req.query;

//     if (data) {
//       try {
//         const decoded = base64Decode(data);
//         const transactionId = decoded.transaction_uuid;

//         const booking = await Booking.findOne({
//           where: { transactionId },
//           include: [{ model: Payment, as: "payments" }],
//         });

//         if (booking) {
//           await booking.update({ paymentStatus: "failed" });
//           const payment = booking.payments[0];
//           await payment.update({ status: "failed" });
//         }
//       } catch (error) {
//         console.error("Error processing eSewa failure:", error);
//       }
//     }

//     return res.redirect(
//       `${process.env.FRONTEND_FAILURE_URL}?error=Payment failed`
//     );
//   })
// );

// module.exports = router;
