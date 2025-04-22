const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { catchAsync } = require("../utils/catchAsync");
const db = require("../models");

dotenv.config();

const Booking = db.Booking;
const Payment = db.Payment;

// Environment variables
const {
  MERCHANT_ID,
  ESEWA_SECRET,
  ESEWA_SUCCESS_URL,
  ESEWA_FAILURE_URL,
  ESEWA_PAYMENT_URL,
  ESEWA_STATUS_URL,
} = process.env;

// Initiate eSewa payment
const initiateEsewaPayment = catchAsync(async (req, res) => {
  const { bookingId, amount } = req.body;
  const clientId = req.userId;

  // Validate booking
  const booking = await Booking.findOne({
    where: { id: bookingId, clientId, paymentStatus: "pending" },
  });

  if (!booking) {
    return res
      .status(404)
      .json({ message: "Booking not found or not eligible for payment" });
  }

  // Generate unique transaction UUID
  const transaction_uuid = uuidv4();
  const total_amount = amount;
  const product_code = MERCHANT_ID;

  try {
    // Create signature
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto
      .createHmac("sha256", ESEWA_SECRET)
      .update(message)
      .digest("base64");

    // Prepare form data
    const formData = {
      amount,
      tax_amount: 0,
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: ESEWA_SUCCESS_URL,
      failure_url: ESEWA_FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    console.log("Generating eSewa payment form with data:", formData);

    // Generate HTML form
    const formHtml = `
      <form id="esewa_payment_form" action="${ESEWA_PAYMENT_URL}" method="POST">
        ${Object.entries(formData)
          .map(
            ([key, value]) =>
              `<input type="hidden" name="${key}" value="${value}">`
          )
          .join("")}
      </form>
      <script>document.getElementById("esewa_payment_form").submit();</script>
    `;

    // Update booking with transaction ID
    await booking.update({ transactionId: transaction_uuid });

    // Create payment record
    await Payment.create({
      bookingId,
      userId: clientId,
      amount,
      currency: "NPR",
      paymentMethod: "online",
      transactionId: transaction_uuid,
      status: "completed",
    });

    // Return form HTML for frontend to render
    res.status(200).json({
      message: "Payment initiated successfully",
      html: formHtml,
    });
  } catch (error) {
    console.error("Error initiating eSewa payment:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Failed to initiate eSewa payment",
      error: error.message,
    });
  }
});

// Verify eSewa payment
const verifyEsewaPayment = catchAsync(async (req, res) => {
  const { data } = req.query; // eSewa sends encoded data in query
  const clientId = req.userId;

  try {
    // Dynamically import esewajs for verification
    const { base64Decode, EsewaCheckStatus } = await import("esewajs");

    // Decode eSewa response
    const decodedData = base64Decode(data);
    const parsedData = JSON.parse(decodedData);

    const { status, transaction_uuid, total_amount } = parsedData;

    // Find booking
    const booking = await Booking.findOne({
      where: { transactionId: transaction_uuid, clientId },
      include: [
        {
          model: db.Photographer,
          as: "photographers",
          include: [
            {
              model: db.User,
              as: "users",
              attributes: ["id", "name", "email", "profileImage"],
            },
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { bookingId: booking.id, transactionId: transaction_uuid },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Verify payment status with eSewa
    const statusResponse = await EsewaCheckStatus(
      total_amount,
      transaction_uuid,
      MERCHANT_ID,
      ESEWA_STATUS_URL
    );

    if (statusResponse.status === "COMPLETE") {
      // Update payment and booking status
      await payment.update({
        status: "completed",
        paymentDate: new Date(),
      });

      await booking.update({
        status: "confirmed",
        paymentStatus: "paid",
        paymentDate: new Date(),
      });

      // Notify photographer via socket.io
      const io = req.app.get("io");
      if (io && booking.photographers && booking.photographers.users) {
        io.to(`user:${booking.photographers.users.id}`).emit(
          "booking_payment_confirmed",
          {
            bookingId: booking.id,
            status: booking.status,
            paymentMethod: "online",
            message: "Payment processed for your booking via eSewa.",
          }
        );
      }

      // Redirect to success page
      res.redirect(ESEWA_SUCCESS_URL);
    } else {
      // Update payment status to failed
      await payment.update({ status: "failed" });
      await booking.update({ paymentStatus: "failed" });

      // Redirect to failure page
      res.redirect(ESEWA_FAILURE_URL);
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.redirect(ESEWA_FAILURE_URL);
  }
});

module.exports = {
  initiateEsewaPayment,
  verifyEsewaPayment,
};
