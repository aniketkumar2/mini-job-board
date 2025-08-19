// routes/jobRoutes
const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");
const {
  validateJob,
  handleValidationErrors,
} = require("../middleware/jobValidator");
const {
  verifyToken,
  isAdmin,
  attachUserIfExists,
} = require("../middleware/auth");

// Public - view jobs
router.get("/", attachUserIfExists, jobController.getAllJobs);

// router.get("/my-listings", verifyToken, );
// Protected route for user’s listings
router.get("/my-listings", verifyToken, jobController.getJobsByUser);

router.get("/:id", attachUserIfExists, jobController.getJobById);

// Admin only - create job
router.post(
  "/",
  verifyToken,
  isAdmin,
  validateJob,
  handleValidationErrors,
  jobController.createJob
);

// Admin only - update job
router.put("/", verifyToken, isAdmin, jobController.updateJob);

// Admin only - delete job
router.delete("/:id", verifyToken, isAdmin, jobController.deleteJob);

module.exports = router;
