const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to true to see raw SQL queries
  }
);

const Connection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database Connected Succesfully!`.underline.bold);
  } catch (error) {
    console.error("Unable to connect to the database:".red.bold, error);
  }
};

Connection();

module.exports = sequelize;
