const { getDashboardController } = require("./dashboard.controller")

const express = require("express")
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router()

router.get("/get", connectDatabase(getDashboardController))

module.exports = router;