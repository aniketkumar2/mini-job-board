const { body, validationResult } = require("express-validator");

// Validate and sanitize location input
exports.validateLocation = [
  body("name")
    .notEmpty()
    .withMessage("Location name is required")
    .isString()
    .withMessage("Location must be a string")
    .trim(),
];

// Handle validation errors
exports.handleLocationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
