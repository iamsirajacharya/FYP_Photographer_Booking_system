module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      photographerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Photographers",
          key: "id",
        },
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Bookings",
          key: "id",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      hooks: {
        afterCreate: async (review, options) => {
          // Update photographer's average rating
          const { Photographer, Review } = sequelize.models;

          const reviews = await Review.findAll({
            where: { photographerId: review.photographerId },
            attributes: ["rating"],
          });

          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRating / reviews.length;

          await Photographer.update(
            {
              averageRating,
              reviewCount: reviews.length,
            },
            {
              where: { id: review.photographerId },
              transaction: options.transaction,
            }
          );

          // Mark booking as rated
          await sequelize.models.Booking.update(
            {
              isRated: true,
            },
            {
              where: { id: review.bookingId },
              transaction: options.transaction,
            }
          );
        },
      },
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
    });

    Review.belongsTo(models.Photographer, {
      foreignKey: "photographerId",
      as: "photographer",
    });

    Review.belongsTo(models.Booking, {
      foreignKey: "bookingId",
      as: "booking",
    });
  };

  return Review;
};
