const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    photo: {
      type: DataTypes.BLOB("long"),
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.BIGINT,
    },

    speciality: {
      type: DataTypes.ENUM("Client", "Photographer"),
    },
  },
  {
    tableName: "Users", // ✅ Correct way to specify table name
    timestamps: false, // ✅ Correct way to disable timestamps
  }
);

module.exports = User;
