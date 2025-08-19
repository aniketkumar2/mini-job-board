const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const jobRoutes = require("./routes/jobRoutes");
const locationRoutes = require("./routes/locationRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");

const corsOptions = {
  origin: [process.env.CLIENT_URL || "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // instead of "*"
  credentials: true,
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Test
app.get("/test", (req, res) => {
  res.send("✅ Hello from Mini Job Board backend!");
});

// 404 handler
app.use((req, res) => {
  console.log("\n-----\n", req.method, req.originalUrl, req.body, "\n-----\n");
  res.status(404).json({ status: false, message: "Not Found", data: null });
});

// Global error handler (last middleware)
app.use(errorHandler);

// Start server
connectDB();
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
