const express = require("express");
const router = express.Router();
const {
  getAllLocations,
  createLocation,
} = require("../controllers/locationController");

const {
  validateLocation,
  handleLocationErrors,
} = require("../middleware/locationValidator");

// GET all locations
router.get("/", getAllLocations);

// POST a new location with validation
router.post("/", validateLocation, handleLocationErrors, createLocation);

module.exports = router;
