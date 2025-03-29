// index.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("./models");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const photographerRoutes = require("./routes/photographer.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler } = require("./middleware/errorHandler");
const { socketAuthMiddleware } = require("./middleware/socketAuth");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach the io instance to the Express app
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io middleware and event handlers
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Join user to their own room for private messages
  socket.join(`user:${socket.userId}`);

  // Join admin room if user is admin
  if (socket.userRole === "admin") {
    socket.join("admin");
  }

  // Handle chat messages
  socket.on("send_message", async (data) => {
    try {
      const { recipientId, message } = data;

      // Save message to database
      const newMessage = await db.Message.create({
        senderId: socket.userId,
        recipientId,
        content: message,
        read: false,
      });

      // Emit to recipient
      io.to(`user:${recipientId}`).emit("receive_message", {
        id: newMessage.id,
        senderId: socket.userId,
        content: message,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.error("Message error:", error);
    }
  });

  // Handle booking notifications
  socket.on("booking_update", (data) => {
    const { bookingId, status, userId } = data;

    // Emit to specific user
    io.to(`user:${userId}`).emit("booking_status_changed", {
      bookingId,
      status,
    });

    // Also notify admins
    io.to("admin").emit("admin_booking_update", {
      bookingId,
      status,
      userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// Database synchronization and server start
const PORT = process.env.PORT;

db.sequelize
  .sync()
  .then(async () => {
    // Optionally create an admin user if not already present
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await db.User.findOne({
      where: { email: adminEmail, role: "admin" },
    });

    if (!existingAdmin) {
      console.log("No admin user found. Creating one now...");

      await db.User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Will be hashed automatically via the User model hooks
        role: "admin",
      });

      console.log(`Admin user created with email: ${adminEmail}`);
    } else {
      console.log("Admin user already exists. Skipping creation.");
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
