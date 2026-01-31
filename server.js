// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const  path = require("path");
dotenv.config();
connectDB();// Connexion BDD
const app = express();
// Middleware
app.use(cors());//autoriser les requettes externes
app.use(express.json());//lire le body JSON
app.use("/api/users",require("./routes/userRoutes"));
app.use("/api/auth",require("./routes/authRoutes"));// Routes


// Lancer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur demarre sur le port ${PORT}`);
});