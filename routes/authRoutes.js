const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const protect = require("../midleware/authMidleware");
const authorize = require("../midleware/roleMidleware");

router.post("/register", register);
router.post("/login", login);

router.get("/useres", protect,authorize(["parent","admin"]), (req, res) => {
  res.json({ message: "Profil utilisateur", user: req.user });
});

router.get(
  "/admin",
  protect,
  authorize(["admin"]),
  (req, res) => {
    res.json({ message: "Espace administrateur" });
  }
);

module.exports = router;
