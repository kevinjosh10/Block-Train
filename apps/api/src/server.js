require("dotenv").config();

// For Hackathon Demo: Auto-fallback if the user didn't add it in Render yet.
// The JWT_SECRET must be loaded from environment variables in production.

// Refuse to start with a forgeable or missing signing key (except we provided a fallback).
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 random characters.");
}

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});