const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController,
  createArtworkController,
  editArtworkController
} = require("./artwork.controller")
const {
  getArtworkByArtIdAdminIdValidator,
  editArtworkValidator
} = require("./artwork.validator")


router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))
router.get("/get", getArtworkByArtIdAdminIdValidator, handleValidationErrors, connectDatabase(getArtworkByArtIdAdminIdController))
router.post("/create", connectDatabase(createArtworkController))
router.post("/edit", editArtworkValidator, handleValidationErrors, connectDatabase(editArtworkController))

module.exports = router;
