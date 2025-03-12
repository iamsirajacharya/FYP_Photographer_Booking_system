const express = require("express");
const { register, login, protect } = require("../controllers/usercontroller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Example of a protected route
router.get("/protected", protect, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

module.exports = router;
