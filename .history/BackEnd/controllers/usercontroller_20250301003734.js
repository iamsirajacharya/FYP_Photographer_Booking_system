const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/index");

exports.register = async (req, res) => {
  const { Username, email, password, phone, role, profile_image } = req.body;
  console.log(Username, email, password, phone, role, profile_image);
  try {
    if (!Username || !email || !password || !phone || !role || !profile_image) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "All fields are required",
      });
    }

    console.log("User exists1");
    const userExists = await User.findOne({ where: { email } });
    console.log(userExists);
    console.log("User exists2");
    if (userExists) {
      return res
        .status(400)
        .json({ status: "error", data: null, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      phoneNumber: phone,
      gender,
      role,
    });
    console.log("User created successfully");
    return res.status(200).json({
      status: "success",
      data: null,
      message: "User created successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", data: null, message: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", data: null, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: "error", data: null, message: "Invalid credentials" });
    }
    const loggedInToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: "success",
      data: loggedInToken,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", data: null, message: "Error logging in" });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: null,
    message: "Logged out successfully",
  });
};
