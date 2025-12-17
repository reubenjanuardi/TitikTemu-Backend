// Auth Service Server
require("dotenv").config();
const express = require("express");
const prisma = require("./prisma");

const app = express();

require("./app")(app);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("HTTP server closed");
  });
});

