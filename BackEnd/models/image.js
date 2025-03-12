module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("sample", "gallery", "profile"),
        allowNull: false,
        defaultValue: "gallery",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
  
    Image.associate = (models) => {
      Image.belongsTo(models.User, { foreignKey: "user_id" });
    };
  
    return Image;
  };
  