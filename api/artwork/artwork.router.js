const { getAllArtworkByAdminIdController, deleteArtworkController } = require("./artwork.controller")

const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))
router.post("/delete", connectDatabase(deleteArtworkController))

module.exports = router;
