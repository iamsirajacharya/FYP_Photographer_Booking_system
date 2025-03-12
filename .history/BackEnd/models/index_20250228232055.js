const { Sequelize } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const User = require("./usermodel")(sequelize);
const Photographer = require("./photographer")(sequelize);
const Booking = require("./booking")(sequelize);
const Payment = require("./Payment")(sequelize);
const Review = require("./Review")(sequelize);
const Portfolio = require("./Portfolio")(sequelize);
const Message = require("./Message")(sequelize);
const Notification = require("./Notification")(sequelize);
const Category = require("./Category")(sequelize);
const PhotographerCategory = require("./PhotographerCategory")(sequelize);

// Define relationships
User.hasOne(Photographer, { foreignKey: "user_id" });
Photographer.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Booking, { foreignKey: "client_id" });
Booking.belongsTo(User, { foreignKey: "client_id" });

Photographer.hasMany(Booking, { foreignKey: "photographer_id" });
Booking.belongsTo(Photographer, { foreignKey: "photographer_id" });

Booking.hasOne(Payment, { foreignKey: "booking_id" });
Payment.belongsTo(Booking, { foreignKey: "booking_id" });

Booking.hasMany(Review, { foreignKey: "booking_id" });
Review.belongsTo(Booking, { foreignKey: "booking_id" });

Photographer.hasMany(Review, { foreignKey: "photographer_id" });
Review.belongsTo(Photographer, { foreignKey: "photographer_id" });

Photographer.hasMany(Portfolio, { foreignKey: "photographer_id" });
Portfolio.belongsTo(Photographer, { foreignKey: "photographer_id" });

User.hasMany(Message, { foreignKey: "sender_id" });
User.hasMany(Message, { foreignKey: "receiver_id" });

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

Photographer.belongsToMany(Category, { through: PhotographerCategory });
Category.belongsToMany(Photographer, { through: PhotographerCategory });

module.exports = {
  sequelize,
  User,
  Photographer,
  Booking,
  Payment,
  Review,
  Portfolio,
  Message,
  Notification,
  Category,
  PhotographerCategory,
};
