const { getAllArtworkByAdminIdController } = require("./artwork.controller")

const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))

module.exports = router;
