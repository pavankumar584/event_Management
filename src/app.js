// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// === Middlewares ===
app.use(express.json());
app.use(cors());

// === Routes ===
app.use("/auth", require("../src/routes/auth.route"));
app.use("/user", require("../src/routes/user.route"));
app.use("/event", require("../src/routes/event.route"));
app.use('/admin',require('../src/routes/admin.route'));
app.use("/uploads", express.static("uploads"));

// === 404 Handler ===
app.use("/", (req, res) => {
  res.status(404).json({ message: "URL not found" });
});

// === MongoDB Connection ===
const { MONGOURL, PORT } = process.env;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) =>
    console.error("❌ Database connection error:", err.message)
  );
