// controllers/applicationController.js
const Application = require("../models/Application");
const Job = require("../models/Job");

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      user: req.user.id,
      job: jobId,
    });
    if (existingApp) {
      return res.json({
        status: false,
        message: "Already applied to this job",
      });
    }

    const application = new Application({
      user: req.user.id,
      job: jobId,
    });

    await application.save();

    res.status(201).json({
      status: true,
      message: "Job application submitted successfully",
      // data: application,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error while applying" });
  }
};

// controllers/applicationController.js
exports.getAppliedJobs = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: "job",
        select: "title company location salary",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
