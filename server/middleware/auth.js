// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token and attach user object
exports.verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res
      .status(403)
      .json({ status: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to ensure it still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.error("Token validation error:", err.message);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

exports.attachUserIfExists = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(); // no token → continue
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id email user_type");
    if (user) req.user = user; // ✅ only attach if valid
  } catch (err) {
    console.log("Optional auth check failed:", err.message);
  }

  next();
};

// Check admin role
exports.isAdmin = (req, res, next) => {
  if (req.user?.user_type !== "admin") {
    return res
      .status(403)
      .json({ status: false, message: "Access denied. Admins only" });
  }
  next();
};

// Check user role
exports.isUser = (req, res, next) => {
  if (req.user?.user_type !== "user") {
    return res
      .status(403)
      .json({ status: false, message: "Access denied for non-user accounts" });
  }
  next();
};
