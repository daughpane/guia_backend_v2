const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const { getVisitorTokenController, getArtworkVisitsPerSectionIdController } = require("../visitor/visitor.controller")

router.get("/generate-token", connectDatabase(getVisitorTokenController))
router.get("/artwork-visits", connectDatabase(getArtworkVisitsPerSectionIdController))

module.exports = router

