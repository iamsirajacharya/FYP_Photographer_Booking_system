// Specialty.model.js
module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define("Specialty", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Specialty.associate = (models) => {
    Specialty.belongsToMany(models.Photographer, {
      through: "PhotographerSpecialty",
      foreignKey: "specialtyId",
      otherKey: "photographerId",
      as: "photographers",
    });
  };

  return Specialty;
};
