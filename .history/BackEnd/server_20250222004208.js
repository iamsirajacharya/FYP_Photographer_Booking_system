require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/dbConfig");
const authRoutes = require("./routes/authroutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/", authRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Sync Database with models
  await sequelize.sync();
  console.log("Database Synced Succesfully!");
});
