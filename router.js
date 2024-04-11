const express = require("express");

const router = express.Router();

const artworkRouter = require("./api/artwork/artwork.router")
const adminRouter = require("./api/admin/admin.router")
const sectionRouter = require("./api/section/section.router")
const dashboardRouter = require("./api/dashboard/dashboard.router")
const museumRouter = require("./api/museum/museum.router")
const visitorRouter = require("./api/visitor/visitor.router")
const amazonRouter = require("./api/amazon/amazon.router")

router.use("/artwork", artworkRouter)
router.use("/admin", adminRouter)
router.use("/museum", museumRouter)    
router.use("/section", sectionRouter)
router.use("/dashboard", dashboardRouter)
router.use("/visitor", visitorRouter)
router.use("/amazon", amazonRouter)
module.exports = router;
