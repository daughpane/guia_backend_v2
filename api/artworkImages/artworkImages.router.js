const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")


const {
   getArtworkImagesPerArtIdController
} = require("./artworkImages.controller")
 
router.get("/get/all", connectDatabase(getArtworkImagesPerArtIdController))

module.exports = router