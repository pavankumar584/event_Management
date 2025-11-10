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
app.use("/admin", require("../src/routes/admin.route"));
app.use("/uploads", express.static("uploads"));

// === 404 Handler ===
app.use("/", (req, res) => {
  res.status(404).json({ message: "URL not found" });
});

// === MongoDB Connection ===
const { MONGOURL_DEV, MONGOURL_PROD, PORT } = process.env;
const MONGO_URL =
  process.env.NODE_ENV === "production" ? MONGOURL_PROD : MONGOURL_DEV;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`✅ Database connected (${process.env.NODE_ENV})`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Database connection error:", err.message));
