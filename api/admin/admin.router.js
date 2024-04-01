const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")
const router = express.Router();

const { adminLoginController } = require("./admin.controller")
const { adminLoginValidator } = require("./admin.validator")

router.post("/login", adminLoginValidator, handleValidationErrors, connectDatabase(adminLoginController))

module.exports = router;