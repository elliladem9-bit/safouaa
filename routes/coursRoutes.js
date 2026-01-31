///// routes/coursRoutes.js
const express = require("express");
const router = express.Router();
const coursController = require("../controllers/coursController");
router.post("/ajouter", coursController.ajouterCours);
router.get("/", coursController.listerCours);
module.exports = router;
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");




router.post("/ajouter", userController.ajouterUtilisateur);
router.get("/", protect, authorize(["baybsitter","admin"]) ,userController.listerUtilisateurs);
module.exports = router;