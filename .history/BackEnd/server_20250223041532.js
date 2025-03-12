require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/dbConfig");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// const authRoutes = require("./routes/authroutes");

const app = express();

const allowedOrigins = ["http://localhost:5174", "http://127.0.0.1:5174"];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Routes
const users = require("./routes/authroutes");

app.use("/api/users", users);

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
    await sequelize.sync({ extended: true }); // Keeps existing data and updates schema
    console.log("Database synced successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};
sync();
