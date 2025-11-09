const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "organizer", "admin"],
  },
  profilePic: { type: String },
  banned: { type: Boolean, default: false },
});

userSchema.virtual("avatar").get(function () {
  if (this.profilePic) return this.profilePic;
  const seed = this._id
    ? this._id.toString()
    : Math.random().toString(36).substring(2, 15);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
