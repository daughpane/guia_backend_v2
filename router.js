const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artwork/artwork.router")
const adminRouter = require("./api/admin/admin.router")
const museumRouter = require("./api/museum/museum.router")

router.use("/artwork/", artworkRouter)
router.use("/admin/", adminRouter)
router.use("/museum/", museumRouter)    

module.exports = router;
