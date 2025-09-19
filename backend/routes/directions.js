const express = require("express");
const router = express.Router();
const { getDirections } = require("../controllers/directionsController");

router.get("/", getDirections);

module.exports = router;
