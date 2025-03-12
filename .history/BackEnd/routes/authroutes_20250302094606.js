const express = require("express");
// const { register, login, protect } = require("../controllers/usercontroller");
const userController = require("../controllers/usercontroller");
const router = express.Router();

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/photographers").get(userController.getPhotographers);

module.exports = router;
