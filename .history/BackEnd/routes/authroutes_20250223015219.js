const express = require("express");
const { register, login, protect } = require("../controllers/usercontroller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
