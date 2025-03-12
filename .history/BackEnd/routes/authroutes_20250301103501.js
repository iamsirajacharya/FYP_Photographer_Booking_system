const express = require("express");
// const { register, login, protect } = require("../controllers/usercontroller");
const userController = require("../controllers/usercontroller");
const router = express.Router();

router.route("/register").post(userController.register);
router.route("/login", userController.login);
router.route("/logout").post(userLogin);

module.exports = router;
