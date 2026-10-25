const router = require("express").Router();
const { body } = require("express-validator");
const { register } = require("../controllers/authController");

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  register
);

module.exports = router;