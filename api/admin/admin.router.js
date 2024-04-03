const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")
const router = express.Router();

const { adminLoginController, adminChangePasswordController } = require("./admin.controller")
const { adminLoginValidator } = require("./admin.validator")

router.post("/login", adminLoginValidator, handleValidationErrors, connectDatabase(adminLoginController))
router.post("/change-password", connectDatabase(adminChangePasswordController))

module.exports = router;