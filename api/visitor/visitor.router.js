const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const {
  getVisitorTokenController,
  getArtworkVisitsPerSectionIdController,
  getTrafficPerMuseumIdController,
  getArtworkChecklistPerVisitorController
} = require("./visitor.controller");
const { getArtworkVisitsPerSectionIdValidator } = require("./visitor.validator");

router.get("/generate-token", connectDatabase(getVisitorTokenController))
router.get("/traffic", connectDatabase(getTrafficPerMuseumIdController))
router.get("/artwork-visits", getArtworkVisitsPerSectionIdValidator, handleValidationErrors, connectDatabase(getArtworkVisitsPerSectionIdController))
router.get("/artwork-checklist/get", connectDatabase(getArtworkChecklistPerVisitorController))

module.exports = router

