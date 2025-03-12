const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const DEFAULT_SALT_ROUNDS = 10;

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("client", "photographer", "admin"),
      allowNull: false,
    },
    profile_image: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
  });

  // Hash password before creating or updating user
  User.addHook("beforeSave", async (user) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(DEFAULT_SALT_ROUNDS);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Method to compare passwords
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};
