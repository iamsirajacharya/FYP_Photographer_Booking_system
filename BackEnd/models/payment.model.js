module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Bookings", // Ensure this matches your Booking table name
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users", // Ensure this matches your User table name
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USD",
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        defaultValue: "pending",
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, {
      foreignKey: "bookingId",
      as: "bookings",
      onDelete: "CASCADE",
    });

    Payment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
      onDelete: "CASCADE",
    });
  };

  return Payment;
};
