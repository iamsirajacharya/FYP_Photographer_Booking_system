module.exports = (sequelize, DataTypes) => {
  const Photographer = sequelize.define(
    "Photographer",
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE", 
      },
      specialty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      equipment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      applicationStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      availableDays: {
        type: DataTypes.JSON, // Use JSON instead of storing as a string
        allowNull: true,
      },
      portfolioImages: {
        type: DataTypes.JSON, // Use JSON instead of TEXT
        allowNull: true,
      },
      averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      completedBookings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      applicationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "photographers",
    }
  );

  // Associations
  Photographer.associate = (models) => {
    Photographer.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
      onDelete: "CASCADE",
    });

    Photographer.hasMany(models.Booking, {
      foreignKey: "photographerId",
      as: "bookings",
      onDelete: "CASCADE",
    });

    Photographer.hasMany(models.Review, {
      foreignKey: "photographerId",
      as: "reviews",
      onDelete: "CASCADE",
    });

    Photographer.belongsToMany(models.PhotographerSpecialty, {
      through: "PhotographerSpecialty",
      foreignKey: "photographerId",
      otherKey: "specialtyId",
      as: "specialties",
      onDelete: "CASCADE",
    });
  };

  return Photographer;
};
