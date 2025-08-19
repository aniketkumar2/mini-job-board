const Location = require("../models/Location");

// ✅ GET all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });

    if (!locations.length) {
      return res.status(200).json({
        status: false,
        message: "No locations found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Locations fetched successfully",
      data: locations,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching locations",
    });
  }
};

// ✅ POST a new location (check if already exists)
exports.createLocation = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: false,
        message: "Location name is required",
      });
    }

    const trimmedName = name.trim();

    // Check if location already exists (case-insensitive)
    const existing = await Location.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(200).json({
        status: false,
        message: "Location already exists",
        data: existing,
      });
    }

    const newLocation = new Location({ name: trimmedName });
    await newLocation.save();

    res.status(201).json({
      status: true,
      message: "Location added successfully",
      data: newLocation,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to add location",
    });
  }
};
