const { body, validationResult } = require("express-validator");

// Validate and sanitize job creation fields
exports.validateJob = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("company").notEmpty().withMessage("Company name is required").trim(),
  body("type")
    .isIn(["Full-time", "Part-time", "Internship"])
    .withMessage("Job type must be valid"),
  body("location").notEmpty().withMessage("Location is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
];

// Handle any validation errors
exports.handleValidationErrors = (req, res, next) => {
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
