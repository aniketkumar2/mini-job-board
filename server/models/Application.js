const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Compound index (user + job) -> ensures a user can apply only once
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

// ✅ Single-field index on user -> speeds up queries like: find({ user })
applicationSchema.index({ user: 1 });

// ✅ Single-field index on job -> useful if you later query by job
applicationSchema.index({ job: 1 });

module.exports = mongoose.model("Application", applicationSchema);
