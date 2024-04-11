const express = require("express");
const router = express.Router();

const { checkToken } = require("../../middlewares/checkToken")

const { getS3CredentialController } = require("./amazon.controller");

router.post("/get-credentials", checkToken, getS3CredentialController)

module.exports = router;