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
const reviewRoutes = require("./routes/review.routes");
const messageRoutes = require("./routes/message.routes");
const esewaRoutes = require("./routes/esewa.routes");
const { errorHandler } = require("./middleware/errorHandler");
const { socketAuthMiddleware } = require("./middleware/socketAuth");
const path = require("path");

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
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/esewa", esewaRoutes);

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
      const { recipientId, content } = data;

      // Save message to database
      const newMessage = await db.Message.create({
        senderId: socket.userId,
        recipientId,
        content,
        read: false,
      });

      // Get sender info
      const sender = await db.User.findByPk(socket.userId, {
        attributes: ["id", "name", "profileImage"],
      });

      // Emit to recipient
      io.to(`user:${recipientId}`).emit("receive_message", {
        id: newMessage.id,
        senderId: socket.userId,
        recipientId,
        content,
        createdAt: newMessage.createdAt,
        read: false,
        sender: {
          id: sender.id,
          name: sender.name,
          profileImage: sender.profileImage,
        },
      });

      // Emit to sender for confirmation
      socket.emit("message_sent", {
        id: newMessage.id,
        senderId: socket.userId,
        recipientId,
        content,
        createdAt: newMessage.createdAt,
        read: false,
      });
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { recipientId, isTyping } = data;
    io.to(`user:${recipientId}`).emit("user_typing", {
      userId: socket.userId,
      isTyping,
    });
  });

  // Handle read receipts
  socket.on("mark_read", async (data) => {
    try {
      const { conversationId } = data;

      // Update messages in database
      await db.Message.update(
        { read: true, readAt: new Date() },
        {
          where: {
            senderId: conversationId,
            recipientId: socket.userId,
            read: false,
          },
        }
      );

      // Notify the sender that their messages were read
      io.to(`user:${conversationId}`).emit("messages_read", {
        by: socket.userId,
      });
    } catch (error) {
      console.error("Mark read error:", error);
    }
  });

  // Handle booking notifications
  socket.on("booking_update", (data) => {
    const { bookingId, status, userId } = data;

    io.to(`user:${userId}`).emit("booking_status_changed", {
      bookingId,
      status,
    });

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


const defaultSpecialties = [
  'Portrait',
  'Wedding',
  'Event',
  'Family',
  'Commercial',
  'Landscape',
  'Fine Art',
  'Fashion',
  'Sports',
  'Product',
];

const Specialty = require('./models').Specialty;

async function insertDefaultSpecialties() {
  for (const name of defaultSpecialties) {
    await Specialty.findOrCreate({ where: { name } });
  }
}

const PORT = process.env.PORT;

db.sequelize
  .sync()
  .then(async () => {
    insertDefaultSpecialties();
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
        password: adminPassword, 
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
