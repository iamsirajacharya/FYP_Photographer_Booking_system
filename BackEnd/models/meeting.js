// models/meeting.js
module.exports = (sequelize, DataTypes) => {
    const Meeting = sequelize.define("Meeting", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      photographer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      // Stores meeting details (an array or object) in JSON format
      meeting_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    });
  
    Meeting.associate = (models) => {
      Meeting.belongsTo(models.User, { foreignKey: "photographer_id" });
    };
  
    return Meeting;
  };
  