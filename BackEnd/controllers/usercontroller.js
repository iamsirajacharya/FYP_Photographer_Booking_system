const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/index");
const validator = require("validator");
const { sign } = require("../utils/jwt");
require("dotenv").config();
const sequelize = require("../utils/dbConfig");

// const responseError = require("../middlewares/responseError");
// const handleAsync = require("../middlewares/handleAsync");

exports.register = async (req, res) => {
  const { Username, email, password, phone, role } = req.body;

  try {
    // Check if all required fields are provided
    if (!Username || !email || !password || !phone || !role) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "Invalid email format",
      });
    }

    // Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        status: "error",
        data: null,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    // Validate phone number
    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "Invalid phone number format",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({
        status: "error",
        data: null,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      Username,
      email,
      password,
      phone,
      role,
    });

    return res.status(201).json({
      status: "success",
      data: null,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Server error while creating user",
    });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(400).json({
//         status: "error",
//         data: null,
//         message: "All fields are required",
//       });
//     }
//     const user = await User.findOne({ where: { email: req.body.email } });
//     if (!user) {
//       return res.status(401).json({
//         status: "error",
//         data: null,
//         message: "Invalid credentials",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         status: "error",
//         data: null,
//         message: "Invalid credentials",
//       });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     return res.status(200).json({
//       status: "success",
//       data: { token },
//       message: "User logged in successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       data: null,
//       message: "Server error while logging in",
//     });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")),
        email.toLowerCase()
      ),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await sign(user);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error while logging in" });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({
    status: "success",
    data: null,
    message: "Logged out successfully",
  });
};

exports.getPhotographers = async (req, res) => {
  try {
    const photographers = await User.findAll({
      where: { role: "photographer" },
    });
    res.status(200).json({
      status: "success",
      data: photographers,
    });
  } catch (error) {
    console.error("Error fetching photographers:", error);
    res.status(500).json({
      status: "error",
      data: null,
      message: "Server error while fetching photographers",
    });
  }
};
