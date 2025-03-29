// photographerSpecialty.model.js (corrected)
module.exports = (sequelize, DataTypes) => {
  const PhotographerSpecialty = sequelize.define("PhotographerSpecialty", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    photographerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Photographers",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialtyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Specialties",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  // (Optional associations here, typically not mandatory)
  PhotographerSpecialty.associate = (models) => {
    PhotographerSpecialty.belongsTo(models.Photographer, {
      foreignKey: "photographerId",
      as: "photographers",
    });

    PhotographerSpecialty.belongsTo(models.PhotographerSpecialty, {
      foreignKey: "specialtyId",
      as: "specialty",
    });
  };

  return PhotographerSpecialty;
};
