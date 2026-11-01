// const jwt = require("jsonwebtoken");

// const cookieOptions = (maxAge) => ({
//   httpOnly: true,
//   sameSite: "lax",
//   secure: process.env.NODE_ENV === "production",
//   maxAge,
// });

// exports.issueTokens = (res, user) => {
//   const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
//   res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
//   res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
// };
const jwt = require("jsonwebtoken");

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_PATH = "/api/auth/refresh";

const baseCookie = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

const setAccess = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
  res.cookie("accessToken", token, { ...baseCookie(), maxAge: ACCESS_MS });
};

exports.issueAccessToken = setAccess;

exports.issueTokens = (res, user) => {
  setAccess(res, user);
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  res.cookie("refreshToken", refresh, { ...baseCookie(), path: REFRESH_PATH, maxAge: REFRESH_MS });
};

exports.clearTokens = (res) => {
  res.clearCookie("accessToken", baseCookie());
  res.clearCookie("refreshToken", { ...baseCookie(), path: REFRESH_PATH });
};