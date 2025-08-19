const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using social login
    user_type: { type: String, enum: ["admin", "user"], default: "user" },
    social_provider: { type: String }, // e.g., 'google', 'facebook'
    social_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
