const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());

// Route qui renverra un fichier video au client
// app.get("/video", (req, res) => {
//   // On renvoie le fichier video "video1.mp4"
//   res.sendFile("assets/video1.mp4", { root: __dirname });
// });

// Videos routes
const Videos = require("./routes/Videos");
app.use("/videos", Videos);

app.listen(5000, () => {
  console.log("Ecoute sur le port 5000!");
});
