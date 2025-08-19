// controllers/jobController.js
const Job = require("../models/Job");
const Location = require("../models/Location");
const Application = require("../models/Application");

// --- GET ALL JOBS (Public) ---_
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "_id email");

    const result = await Promise.all(
      jobs.map(async (job) => {
        let is_admin = false;
        let is_applied = false;

        if (req.user) {
          is_admin = job.postedBy._id.toString() === req.user._id.toString();
          is_applied = await Application.exists({
            job: job._id,
            user: req.user._id, // ✅ FIXED
          });
        }

        return {
          ...job.toObject(),
          is_admin,
          is_applied: Boolean(is_applied),
        };
      })
    );

    res.status(200).json({ status: true, data: result });
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// --- GET JOB BY ID (Public) ---
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "_id email"
    );

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    let is_admin = false;
    let is_applied = false;

    if (req.user) {
      const jobOwnerId = job.postedBy?._id?.toString();
      const currentUserId = req.user._id.toString();

      // ✅ Check if current user is the job creator
      if (jobOwnerId && jobOwnerId === currentUserId) {
        is_admin = true;
      }

      // ✅ Check if current user already applied
      const applied = await Application.exists({
        job: job._id,
        user: req.user._id, // ✅ FIXED
      });
      is_applied = Boolean(applied);
    }

    res.status(200).json({
      status: true,
      data: {
        ...job.toObject(),
        is_admin,
        is_applied,
      },
    });
  } catch (err) {
    console.error("Error fetching job by id:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Get jobs created by logged-in user
exports.getJobsByUser = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(400).json({ status: false, message: "Invalid user" });
    }
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ status: true, data: jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res
      .status(500)
      .json({ status: false, message: "Server error fetching listings" });
  }
};

// ✅ POST new job + add location if new
exports.createJob = async (req, res) => {
  try {
    const { title, company, type, location, description } = req.body;

    if (!title || !company || !type || !location || !description) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const newJob = new Job({
      title,
      company,
      type,
      location,
      description,
      postedBy: req.user._id,
    });
    await newJob.save();

    const existingLocation = await Location.findOne({ name: location });
    if (!existingLocation) {
      await new Location({ name: location }).save();
    }

    res.status(201).json({
      status: true,
      message: "Job added successfully",
      data: newJob,
    });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({
      status: false,
      message: "Failed to add job",
    });
  }
};

// ✅ UPDATE job (Admin only)
exports.updateJob = async (req, res) => {
  try {
    const { job_id, ...updateFields } = req.body;

    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Job ID is required",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(job_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({
      status: false,
      message: "Error updating job",
    });
  }
};

// ✅ DELETE job (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({
      status: false,
      message: "Error deleting job",
    });
  }
};
