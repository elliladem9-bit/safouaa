///// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.post("/ajouter", userController.ajouterUtilisateurs);
router.get("/", userController.listerUtilisateurs);
module.exports = router;