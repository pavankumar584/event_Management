const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const loginService = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.banned) {
    throw new Error("Your account has been banned by the admin.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    role: user.role,
  };
};

const registerService = async (body) => {
  const { name, email, password, role, } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    banned: false,
  });
  return {
    message: "User registered successfully",
  };
};

const logoutService = async () => {
  return {
    message: "Logged out successfully...!",
  };
};

module.exports = { loginService, registerService, logoutService };
