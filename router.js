const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artworks/artwork.router")

router.use("/artwork/", artworkRouter)

module.exports = router;
