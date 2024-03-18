const { getSectionController } = require("./section.controller")

const express = require("express")
const {connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router()

router.get("/get", connectDatabase(getSectionController))

module.exports = router; 