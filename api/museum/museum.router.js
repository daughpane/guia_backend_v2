const { getAllMuseumController } = require("./museum.controller")

const express = require("express");
const { connectDatabase } = require("../../middlewares/connectDatabase")
const router = express.Router();

router.get("/get", connectDatabase(getAllMuseumController))

module.exports = router;
