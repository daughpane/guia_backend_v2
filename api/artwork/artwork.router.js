const { getAllArtworkByAdminIdController, createArtworkController } = require("./artwork.controller")

const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))
router.post("/create", connectDatabase(createArtworkController))

module.exports = router;
