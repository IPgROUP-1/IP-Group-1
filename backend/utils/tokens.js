const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_PATH = "/api/auth";

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");
exports.sha256 = sha256;

const baseCookie = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

const issueAccessToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id, tv: user.tokenVersion ?? 0 },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "15m" }
  );
  res.cookie("accessToken", token, { ...baseCookie(), maxAge: ACCESS_MS });
};

const issueRefreshToken = async (res, user, family = crypto.randomBytes(16).toString("hex")) => {
  const jti = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(
    { id: user._id, tv: user.tokenVersion ?? 0, fam: family, jti },
    process.env.JWT_REFRESH_SECRET,
    { algorithm: "HS256", expiresIn: "7d" }
  );

  await RefreshToken.create({
    user: user._id,
    family,
    tokenHash: sha256(jti),
    expiresAt: new Date(Date.now() + REFRESH_MS),
  });

  res.cookie("refreshToken", token, { ...baseCookie(), path: REFRESH_PATH, maxAge: REFRESH_MS });
};

exports.issueAccessToken = issueAccessToken;
exports.issueRefreshToken = issueRefreshToken;

exports.issueTokens = async (res, user) => {
  issueAccessToken(res, user);
  await issueRefreshToken(res, user);
};

exports.clearTokens = (res) => {
  res.clearCookie("accessToken", baseCookie());
  res.clearCookie("refreshToken", { ...baseCookie(), path: REFRESH_PATH });
};

exports.revokeAllSessions = async (userId) => {
  await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
  await RefreshToken.deleteMany({ user: userId });
};