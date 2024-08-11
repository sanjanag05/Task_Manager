const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profieRoutes.js");
const { verifyAccessToken } = require("../middleware/index.js");

// Routes beginning with /api/profile
router.get("/", verifyAccessToken, getProfile);

module.exports = router;
