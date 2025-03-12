const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

const Connection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database Connected Successfully!`.yellow.underline.bold);
  } catch (error) {
    console.error("Unable to connect to the database:".red.bold, error);
  }
};

Connection();

module.exports = sequelize;
