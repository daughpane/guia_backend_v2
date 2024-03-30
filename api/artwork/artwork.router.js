const { getAllArtworkByAdminIdController } = require("./artwork.controller")

const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController,
  createArtworkController
} = require("./artwork.controller")
const {
  getArtworkByArtIdAdminIdValidator
} = require("./artwork.validator")


router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))
router.get("/get", getArtworkByArtIdAdminIdValidator, handleValidationErrors, connectDatabase(getArtworkByArtIdAdminIdController))
router.post("/create", connectDatabase(createArtworkController))

module.exports = router;
