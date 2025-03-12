require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/dbconfig");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync(); // Sync DB
  console.log("Database Synced!");
});
