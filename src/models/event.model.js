const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    location: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  if (this.isNew && this.availableTickets === undefined) {
    this.availableTickets = this.totalTickets;
  }
  next();
});

eventSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Event", eventSchema);
