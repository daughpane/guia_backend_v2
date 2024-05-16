const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")
const multer = require('multer')
const upload = multer();

const {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController,
  createArtworkController,
  editArtworkController,
  deleteArtworkController,
  predictArtworkController
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
router.post("/edit", checkToken, editArtworkValidator, handleValidationErrors, connectDatabase(editArtworkController))
router.post("/predict", upload.single("image"), connectDatabase(predictArtworkController))

module.exports = router;
