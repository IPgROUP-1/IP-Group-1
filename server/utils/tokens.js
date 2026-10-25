const jwt = require("jsonwebtoken");

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge,
});

exports.issueTokens = (res, user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
};