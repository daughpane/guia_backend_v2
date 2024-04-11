const express = require("express");
const router = express.Router();

const { getS3CredentialController } = require("./amazon.controller");

router.post("/get-credentials", getS3CredentialController)

module.exports = router;