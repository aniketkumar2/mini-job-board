// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  validateTokenUser,
  login,
  register,
  refreshToken,
  googleAuth,
  facebookAuth,
  linkedinAuth,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Email/Password Auth
router.post("/login", login);
router.post("/register", register);

// Token refresh
router.post("/refresh-token", refreshToken);

// ✅ Token validation route
router.get("/validate", verifyToken, validateTokenUser);

// Social logins (redirect endpoints for OAuth)
router.post("/google", googleAuth);
router.post("/facebook", facebookAuth);

module.exports = router;
