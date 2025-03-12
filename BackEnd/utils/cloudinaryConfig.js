// utils/cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Either use the .config call or rely on CLOUDINARY_URL in .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export the v2 instance so it has the .uploader
module.exports = cloudinary;
