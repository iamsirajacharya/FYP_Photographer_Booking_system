const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("client", "photographer", "admin"),
        defaultValue: "client",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastActive: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users", // Explicitly define table name to prevent inconsistencies
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password") && user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
      indexes: [{ unique: true, fields: ["email"] }],
    }
  );

  // Compare Password Method
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Associations
  User.associate = (models) => {
    User.hasOne(models.Photographer, {
      foreignKey: "userId",
      as: "photographerProfile",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Booking, {
      foreignKey: "clientId",
      as: "clientBookings",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Review, {
      foreignKey: "userId",
      as: "reviews",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Message, {
      foreignKey: "senderId",
      as: "sentMessages",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Message, {
      foreignKey: "recipientId",
      as: "receivedMessages",
      onDelete: "CASCADE",
    });
  };

  return User;
};
