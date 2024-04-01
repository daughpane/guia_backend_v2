const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artwork/artwork.router")
const adminRouter = require("./api/admin/admin.router")
const sectionRouter = require("./api/section/section.router")
const museumRouter = require("./api/museum/museum.router")
const visitorRouter = require("./api/visitor/visitor.router")

router.use("/artwork", artworkRouter)
router.use("/admin", adminRouter)
router.use("/museum", museumRouter)    
router.use("/section", sectionRouter)
router.use("/visitor", visitorRouter)

module.exports = router;
