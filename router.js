const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artwork/artwork.router")
const adminRouter = require("./api/admin/admin.router")

router.use("/artwork", artworkRouter)
router.use("/admin", adminRouter)

module.exports = router;
