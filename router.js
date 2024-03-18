const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artwork/artwork.router")
const adminRouter = require("./api/admin/admin.router")
const sectionRouter = require("./api/section/section.router")

router.use("/artwork", artworkRouter)
router.use("/admin", adminRouter)
router.use("/section", sectionRouter)

module.exports = router;
