const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define("Booking", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
    photographer_id: { type: DataTypes.INTEGER, allowNull: false },
    date_time: { type: DataTypes.DATE },
    location: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
    total_price: { type: DataTypes.DECIMAL(10, 2) },
  });
};
