const express = require("express")
const router = express.Router()

const { connectDatabase } = require("../../middlewares/connectDatabase")
const { checkToken } = require("../../middlewares/checkToken")

const { getDashboardController } = require("./dashboard.controller")

router.get("/get", checkToken, connectDatabase(getDashboardController))

module.exports = router;