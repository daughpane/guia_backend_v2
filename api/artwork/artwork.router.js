const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController,
  createArtworkController,
  editArtworkController,
  deleteArtworkController
} = require("./artwork.controller")

const {
  getArtworkByArtIdAdminIdValidator,
  editArtworkValidator,
  createArtworkValidator
} = require("./artwork.validator")

const {
  checkToken
} = require("../../middlewares/checkToken")


router.get("/get/all", connectDatabase(getAllArtworkByAdminIdController))
router.post("/delete", checkToken, connectDatabase(deleteArtworkController))
router.get("/get", getArtworkByArtIdAdminIdValidator, handleValidationErrors, connectDatabase(getArtworkByArtIdAdminIdController))
router.post("/create", checkToken, createArtworkValidator, handleValidationErrors, connectDatabase(createArtworkController))
router.post("/edit", editArtworkValidator, handleValidationErrors, connectDatabase(editArtworkController))

module.exports = router;
