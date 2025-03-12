require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/dbConfig");
const authRoutes = require("./routes/authroutes");

const app = express();

// Middleware
var corsOptions = {
  origin: "http://localhost:5174",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
const users = require("./routes/authroutes");

// mount routes
app.use(users);

// Start Server
const PORT = 3001; // Changed port to avoid permission issues

// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
//   // Sync Database with models
//   await sequelize.sync({ alter: true });
//   console.log("Database Synced Succesfully!");
// });

const sync = async () => {
  try {
    await sequelize.sync({ alter: true }); // Keeps existing data and updates schema
    console.log("Database synced successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};
sync();
