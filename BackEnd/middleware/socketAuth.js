const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.User;

exports.socketAuthMiddleware = async (socket, next) => {
  try {
    // Get token from handshake auth
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new Error("Invalid token"));
    }

    // Check if user is active
    if (user.status !== "active") {
      return next(new Error("Your account is not active"));
    }

    // Add user info to socket
    socket.userId = user.id;
    socket.userRole = user.role;

    next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
};
