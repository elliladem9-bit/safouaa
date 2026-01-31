// controllers/coursController.js
/*const cour = require("../models/cours");
// Ajouter un cours (admin uniquement)
exports.ajouterCours = async (req, res) => {
try {
const nouvelcours = new cour(req.body);
await nouvelcours.save();
res.status(201).json(nouvelcours);
} catch (err) {
res.status(400).json({ message: "Erreur d’ajout", error:
err.message });
}
};
// Récupérer tous les cours
exports.listerCours = async (req, res) => {
try {
const cours = await cours.find();
res.json(cours);
} catch (err) {
res.status(500).json({ error: err.message });
}
};*/
const cours = require("../models/cours");

export const createCours = async (req, res) => {
  const cours = await cours.create({
    ...req.body,
    teacher: req.user.id
  });
  res.json(cours);
};

export const getCours = async (req, res) => {
  const courss= await cours.find().populate("teacher", "name");
  res.json(courss);
};