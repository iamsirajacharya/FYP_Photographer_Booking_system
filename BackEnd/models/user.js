// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
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
    role: {
      type: DataTypes.ENUM("client", "photographer", "admin"),
      defaultValue: "client",
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    camera: DataTypes.STRING,
    expertise: DataTypes.STRING,
    address: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Booking, {
      as: "PhotographerBookings",
      foreignKey: "photographer_id",
    });
    User.hasMany(models.Booking, {
      as: "ClientBookings",
      foreignKey: "client_id",
    });
    User.hasMany(models.Notification, {
      as: "SentNotifications",
      foreignKey: "from_user_id",
    });
    User.hasMany(models.Notification, {
      as: "ReceivedNotifications",
      foreignKey: "to_user_id",
    });
    User.hasMany(models.Image, { foreignKey: "user_id" });
    User.hasMany(models.Meeting, { foreignKey: "photographer_id" });
  };

  return User;
};
