require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/dbConfig");

const app = express();

// const allowedOrigins = ["http://localhost:5174", "http://127.0.0.1:5173"];

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: err.stack,
  });
});

// Routes
const users = require("./routes/authroutes");

app.use("/api", users);

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
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};
sync();
