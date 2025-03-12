// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      from_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      to_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Bookings", key: "id" },
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.User, {
        foreignKey: "from_user_id",
        as: "Sender",
      });
      Notification.belongsTo(models.User, {
        foreignKey: "to_user_id",
        as: "Receiver",
      });
      Notification.belongsTo(models.Booking, { foreignKey: "booking_id" });
    };
  
    return Notification;
  };
  