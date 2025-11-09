const express = require("express");
const LoginValidation = require("../validation/auth/login.validation");
const RegisterValidation = require("../validation/auth/register.validation");
const versionMiddleware = require("../middlewares/version.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const { login, register, logout } = require("../controllers/auth.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/login",
  versionMiddleware(["1.0.0"]),
  validationMiddleware(LoginValidation, "body"),
  login
);
router.post(
  "/register",
  versionMiddleware(["1.0.0"]),
  validationMiddleware(RegisterValidation, "body"),
  register
);
router.post("/logout", versionMiddleware(["1.0.0"]), authMiddleware, logout);

module.exports = router;
