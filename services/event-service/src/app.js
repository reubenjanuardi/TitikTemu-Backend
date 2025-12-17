// Event Service Application
const express = require("express");
require("dotenv").config();

module.exports = (app) => {
  app.use(express.json());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "Event Service is running" });
  });

  // Routes
  app.use("/events", require("./routes/event.route"));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  });
};

