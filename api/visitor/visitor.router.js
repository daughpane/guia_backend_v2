const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")

const { getVisitorTokenController } = require("../visitor/visitor.controller")

router.get("/generate-token", connectDatabase(getVisitorTokenController))

module.exports = router

