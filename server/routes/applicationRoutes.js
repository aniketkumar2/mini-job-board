// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, isUser } = require("../middleware/auth");
const {
  applyForJob,
  getAppliedJobs,
} = require("../controllers/applicationController");

// Apply for a job (Normal User)
router.post("/apply", verifyToken, isUser, applyForJob);

// Get my applications
router.get("/applied", verifyToken, isUser, getAppliedJobs);

module.exports = router;
