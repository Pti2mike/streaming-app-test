const express = require("express");
const router = express.Router();
const videos = require("../datatest");
const fs = require("fs");

// Obtenir la liste des vidéos
router.get("/", (req, res) => {
  res.json(videos);
});

// Obtenir les données pour une seule vidéo selon son id
router.get("/:id/data", (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.json(videos[id]);
});

// Streaming les videos
router.get("/video/:id", (req, res) => {
  // Creation du chemin vers la vidéo
  const videoPath = `assets/${req.params.id}.mp4`;
  // fs va générer la cartographie de la video
  const videoStat = fs.statSync(videoPath);
  // On récupère la taille du fichier
  const fileSize = videoStat.size;
  // On récupère le parametre de plage dans la request pour savoir quelle partie de la video renvoyée au client
  const videoRange = req.headers.range;

  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, {start, end});
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Range": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head); // le code HTTP 206 signifie que la réponse contient un contenu partiel => le navigateur continuera à faire des requêtes jusqu'à ce qu'il ait récupéré tous les morceaux de la vidéo.
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Route qui gérera la demande de sous-titres
const captionPath = "/Volumes/Samsung_T5/Divers Dev/Streaming_app_test/backend"
router.get("/video/:id/caption", (req, res) => {
  res.sendFile(`assets/captions/${req.params.id}.vtt`, { root: captionPath });
});

module.exports = router;
