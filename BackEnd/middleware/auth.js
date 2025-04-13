const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.User;

// exports.authenticate = async (req, res, next) => {
//   try {
//     // Get token from cookie or authorization header
//     let token = req.cookies.token;

//     if (!token && req.headers.authorization) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if user exists
//     const user = await User.findByPk(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // Check if user is active
//     if (user.status !== "active") {
//       return res.status(401).json({ message: "Your account is not active" });
//     }

//     // Add user info to request
//     req.userId = user.id;
//     req.userRole = user.role;

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.userRole)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or authorization header
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and include photographer profile if applicable
    const user = await User.findByPk(decoded.id, {
      include: [{ model: db.Photographer, as: "photographerProfile" }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (user.status !== "active") {
      return res.status(401).json({ message: "Your account is not active" });
    }

    // Attach user info to request
    req.userId = user.id;
    req.userRole = user.role;
    req.user = user; // Now req.user contains the full user object

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
