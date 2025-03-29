module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      photographerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "photographers",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER, // in hours
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sessionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "canceled"),
        defaultValue: "pending",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "refunded"),
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      canceledBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      cancelReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isRated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate: (booking) => {
          // Generate booking number: BKG + YYYYMMDD + random 4 digits
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const random = Math.floor(1000 + Math.random() * 9000);
          booking.bookingNumber = `BKG${year}${month}${day}${random}`;
        },
      },
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "CASCADE",
    });

    Booking.belongsTo(models.Photographer, {
      foreignKey: "photographerId",
      as: "photographers",
    });

    Booking.hasOne(models.Review, {
      foreignKey: "bookingId",
      as: "reviews",
    });
  };

  return Booking;
};
