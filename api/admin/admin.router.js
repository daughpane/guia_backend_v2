const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

const { adminLoginController } = require("./admin.controller")

router.post("/login", connectDatabase(adminLoginController))

module.exports = router;