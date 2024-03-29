const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController
} = require("./artwork.controller")
const {
  getAllArtworkByAdminIdValidator,
  getArtworkByArtIdAdminIdValidator
} = require("./artwork.validator")


router.get("/get/all", getAllArtworkByAdminIdValidator, handleValidationErrors, connectDatabase(getAllArtworkByAdminIdController))
router.get("/get", getArtworkByArtIdAdminIdValidator, handleValidationErrors, connectDatabase(getArtworkByArtIdAdminIdController))

module.exports = router;
