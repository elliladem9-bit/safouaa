// models/User.js
const mongoose = require("mongoose");
const courSchema = new mongoose.Schema({


titre: String,
description: String,
niveau: String,
categorie: String,
image: String,




}, { timestamps: true });
module.exports = mongoose.model("Cour", courSchema);