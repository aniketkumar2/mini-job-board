// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const User = require("../models/User");

// Generate access token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, user_type: user.user_type },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

exports.validateTokenUser = (req, res) => {
  // req.user is attached by verifyToken middleware
  res.json({
    status: true,
    user: req.user,
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, user_type });
    await user.save();

    res
      .status(201)
      .json({ status: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ status: false, message: "User not found" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass)
    return res
      .status(401)
      .json({ status: false, message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Send refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    status: true,
    accessToken,
    user: { id: user._id, email: user.email, user_type: user.user_type },
  });
};

// Refresh access token
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ status: false, message: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ status: false, message: "Invalid refresh token" });

    const accessToken = generateAccessToken({
      _id: decoded.id,
      user_type: decoded.user_type,
    });
    res.json({ status: true, accessToken });
  });
};

// Logout (clear refresh token)
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ status: true, message: "Logged out successfully" });
};

// Social login helper
const socialLoginHandler = async (email, res) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, password: null, user_type: "user" });
    await user.save();
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: true,
    accessToken,
    user: { id: user._id, email: user.email, user_type: user.user_type },
  });
};

// Google
exports.googleAuth = async (req, res) => {
  console.log("Received Google access token:", req.body.token);

  try {
    const { token } = req.body;

    // Fetch user info using access token
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email } = googleRes.data;
    if (!email) throw new Error("Google email not found");

    // Use your existing social login handler
    await socialLoginHandler(email, res);
  } catch (err) {
    console.error("Google auth error:", err.message || err.response?.data);
    res.status(401).json({ status: false, message: "Invalid Google token" });
  }
};

// Facebook
exports.facebookAuth = async (req, res) => {
  console.log("Received Facebook access token:", req.body.token);

  try {
    const { token } = req.body;

    // Fetch Facebook user info using access token
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
    );

    const { email } = fbRes.data;
    if (!email) throw new Error("Facebook email not found");

    // Pass email to your social login handler
    await socialLoginHandler(email, res);
  } catch (err) {
    console.error("Facebook auth error:", err.message || err.response?.data);
    res.status(401).json({ status: false, message: "Invalid Facebook token" });
  }
};
