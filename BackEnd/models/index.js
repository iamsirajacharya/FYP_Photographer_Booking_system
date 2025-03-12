const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

// Initialize models by passing sequelize and DataTypes
const User = require("./user")(sequelize, DataTypes);
const Booking = require("./booking")(sequelize, DataTypes);
const Image = require("./image")(sequelize, DataTypes);
const Meeting = require("./meeting")(sequelize, DataTypes);
const Notification = require("./notifications")(sequelize, DataTypes);

// Associations for Booking model
User.hasMany(Booking, {
  foreignKey: "photographer_id",
  as: "photographerBookings",
});
User.hasMany(Booking, {
  foreignKey: "client_id",
  as: "clientBookings",
});
Booking.belongsTo(User, {
  foreignKey: "photographer_id",
  as: "photographer",
});
Booking.belongsTo(User, {
  foreignKey: "client_id",
  as: "client",
});

// Associations for Notification model
Notification.belongsTo(User, {
  foreignKey: "from_user_id",
  as: "sender",
});
Notification.belongsTo(User, {
  foreignKey: "to_user_id",
  as: "receiver",
});
Notification.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

// Associations for Image model
User.hasMany(Image, { foreignKey: "user_id", as: "images" });
Image.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Associations for Meeting model
User.hasMany(Meeting, { foreignKey: "photographer_id", as: "meetings" });
Meeting.belongsTo(User, { foreignKey: "photographer_id", as: "photographer" });

module.exports = {
  sequelize,
  User,
  Booking,
  Image,
  Meeting,
  Notification,
};
