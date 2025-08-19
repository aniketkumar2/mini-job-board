const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err.message);

  // If headers already sent, just exit
  if (res.headersSent) {
    return;
  }

  // If res.statusCode was set before error, keep it; otherwise default
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : res.statusCode === 200
      ? 200
      : 500;

  res.status(statusCode).json({
    status: false,
    message: err.message || "Something went wrong",
    data: null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;
