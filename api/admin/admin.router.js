const express = require("express");
const router = express.Router();

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { handleValidationErrors } = require("../../middlewares/validateRequest")
const { checkToken } = require("../../middlewares/checkToken")
const { adminLoginController, adminChangePasswordController } = require("./admin.controller")
const { adminLoginValidator, adminChangePasswordValidator } = require("./admin.validator")

router.post("/login", adminLoginValidator, handleValidationErrors, connectDatabase(adminLoginController))
router.post("/change-password", checkToken, adminChangePasswordValidator, handleValidationErrors, connectDatabase(adminChangePasswordController))

module.exports = router;