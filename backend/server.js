// 
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
// const passport = require("./config/passport"); // parked: social login

const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || (isProd ? "" : "http://localhost:5173");

// Refuse to start with missing or weak secrets
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
if (!JWT_SECRET || !JWT_REFRESH_SECRET || JWT_SECRET.length < 32 || JWT_REFRESH_SECRET.length < 32) {
  console.error("JWT_SECRET and JWT_REFRESH_SECRET must both be set (32+ characters).");
  process.exit(1);
}
if (JWT_SECRET === JWT_REFRESH_SECRET) {
  console.error("JWT_SECRET and JWT_REFRESH_SECRET must be different.");
  process.exit(1);
}
if (!CLIENT_URL) {
  console.error("CLIENT_URL is required in production.");
  process.exit(1);
}

const app = express();

// Behind a proxy (Render, Nginx, etc.) so rate limiting sees real IPs
if (isProd) app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true })); // only your frontend
app.use(express.json({ limit: "10kb" }));                  // reject huge payloads
app.use(cookieParser());
// app.use(passport.initialize()); // parked

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" });
  if (err.type === "entity.too.large") return res.status(413).json({ message: "Request too large" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });