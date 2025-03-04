const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Photographer", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    experience: { type: DataTypes.STRING },
    specialization: { type: DataTypes.STRING },
    pricing: { type: DataTypes.DECIMAL(10, 2) },
    availability: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  });
};
