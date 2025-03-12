const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "USER",
    timestamps: false,
  }
);

module.exports = User;
