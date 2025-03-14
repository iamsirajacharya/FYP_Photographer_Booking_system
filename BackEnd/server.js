const express = require("express");
const sequelize = require("./utils/dbConfig").default; // Sequelize instance connecting to MySQL
const { logger } = require("./middlewares/logger");
const { userRoute } = require("./routes/userRoutes");
const { BookingRouter } = require("./routes/bookingRoutes");
// const { authRoute } = require("./routes/authroutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configure CORS to allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(logger);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  try {
    res.send({ ok: true, msg: "Welcome to the Backend of snapShoot" });
  } catch (error) {
    res.send({ ok: false, msg: error.message });
  }
});

app.use("/user", userRoute);
// app.use("/auth", authRoute);
app.use("/booking", BookingRouter);

const port = parseInt(process.env.PORT, 10) || 3001;
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL Database");

    // Synchronize all models (tables)
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error.message);
  }
  console.log(`Server is running at port ${port}`);
});
