const jwt = require("jsonwebtoken");
const db = require("../models");

// Socket.io authentication middleware
exports.socketAuthMiddleware = async (socket, next) => {
  try {
    // Get token from handshake auth or cookies
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user info to socket
    socket.userId = user.id;
    socket.userRole = user.role;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication error"));
  }
};
