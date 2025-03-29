const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload path
const uploadPath = path.join(__dirname, "..", "public", "uploads");

// Automatically create uploads directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter for images
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg formats allowed!"), false);
  }
}

// Set limits for upload
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB per file
};

// Multer instance for portfolio images
const uploadPortfolioImages = multer({
  storage,
  fileFilter,
  limits,
}).array("portfolioImages", 6); // Max 6 images

module.exports = {
  uploadPortfolioImages,
};
