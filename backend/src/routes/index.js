const express = require("express");
const authRoutes = require("./auth.route")
const pageRoutes = require("./page.route")
const router = express.Router()


router.use("/auth",authRoutes)
router.use("/page",pageRoutes)

module.exports = router