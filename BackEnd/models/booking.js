// models/booking.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    photographer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("accepted", "rejected", "pending"),
      defaultValue: "pending",
    },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "photographer_id",
      as: "Photographer",
    });
    Booking.belongsTo(models.User, { foreignKey: "client_id", as: "Client" });
    Booking.hasMany(models.Notification, { foreignKey: "booking_id" });
  };

  return Booking;
};
