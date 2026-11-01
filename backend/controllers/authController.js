// 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { issueTokens, issueAccessToken, clearTokens } = require("../utils/tokens");

// Compared against when the email is unknown, so response time doesn't reveal which emails exist
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, email, password } = req.body; // email already lowercased by the route

    if (await User.exists({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    issueTokens(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isLocked()) {
      return res.status(429).json({ message: "Too many failed attempts. Try again in 15 minutes." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await user.registerFailedAttempt();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await user.resetAttempts();
    issueTokens(res, user);
    return res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.session = async (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.json({ success: false, user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) return res.json({ success: false, user: null });
    return res.json({ success: true, user: publicUser(user) });
  } catch {
    return res.json({ success: false, user: null });
  }
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });
    const user = await User.findById(decoded.id).select("_id");
    if (!user) {
      clearTokens(res);
      return res.status(401).json({ message: "Not authenticated" });
    }
    issueAccessToken(res, user);
    return res.json({ success: true });
  } catch {
    clearTokens(res);
    return res.status(401).json({ message: "Not authenticated" });
  }
};

exports.logout = (req, res) => {
  clearTokens(res);
  return res.json({ success: true, message: "Logged out" });
};

// keep your existing socialCallback here, unchanged (parked)