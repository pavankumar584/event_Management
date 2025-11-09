require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const MONGOURL = process.env.MONGOURL;

(async () => {
  try {
    console.log("🟡 Checking MongoDB URL...");
    console.log("MONGOURL =", MONGOURL);

    if (!MONGOURL || typeof MONGOURL !== "string") {
      throw new Error("❌ MONGOURL is missing or not a valid string in .env file");
    }

    // ✅ Connect to MongoDB
    await mongoose.connect(MONGOURL);
    console.log("✅ Connected to MongoDB successfully");

    // Admin details
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";
    const adminName = "admin";
    const avatar = "https://i.pravatar.cc/150?img=5";

    let admin = await User.findOne({ email: adminEmail });
    const hashed = await bcrypt.hash(adminPassword, 10);

    if (!admin) {
      admin = new User({
        name: adminName,
        email: adminEmail,
        password: hashed,
        avatar,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin created");
    } else {
      admin.name = adminName;
      admin.password = hashed;
      admin.avatar = avatar;
      admin.role = "admin";
      await admin.save();
      console.log("✅ Admin updated");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.SECRET_KEY,
    );

    console.log("\n=== Admin Account ===");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\nUse this token (Bearer):\n", token);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
