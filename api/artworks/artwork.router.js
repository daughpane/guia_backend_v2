const express = require("express");
const { getAllArtworkByAdminIdController } = require("./artwork.controller")
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))

module.exports = router;
