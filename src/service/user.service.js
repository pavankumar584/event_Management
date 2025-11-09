const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const Waitlist = require("../models/waitlist.model");
const { sendBookingEmail } = require("../utils/mailer");
const eventModel = require("../models/event.model");

/**
 * Get user profile details by ID
 */
exports.getProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const userObj = user.toJSON();

  return {
    name: userObj.name,
    email: userObj.email,
    role: userObj.role,
    profilePic: userObj.profilePic || null,
    avatar: userObj.avatar,
  };
};

/**
 * Update user profile details (name, email, profilePic)
 */
exports.updateProfileService = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const updatedData = {};

  if (data.name) updatedData.name = data.name;
  if (data.email) updatedData.email = data.email;
  if (data.profilePic) {
    if (
      user.profilePic &&
      !user.profilePic.startsWith("https://api.dicebear.com")
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        user.profilePic.replace(/^\//, "")
      );

      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Failed to delete old image:", err.message);
        }
      }
    }

    updatedData.profilePic = data.profilePic;
  }

  await User.updateOne({ _id: userId }, { $set: updatedData });

  const updatedUser = await User.findById(userId);
  return updatedUser.toJSON();
};

exports.bookingService = async (userId, body) => {
  const { eventId, tickets } = body;
  console.log(body);
  const event = await eventModel.findById(eventId);
  if (!event) throw new Error("Event not found");
  if (event.availableTickets < tickets) {
    await Waitlist.create({
      user: userId,
      event: eventId,
      ticketsRequested: tickets,
    });
    throw new Error("Tickets sold out. You’ve been added to the waitlist.");
  }
  const booking = await Booking.create({
    user: userId,
    event: eventId,
    tickets,
  });
  console.log(booking);
  await Event.updateOne(
    { _id: eventId },
    { $inc: { availableTickets: -tickets } }
  );
  const qrData = `Booking ID: ${booking._id}\nEvent: ${event.title}\nTickets: ${tickets}`;
  const qrCode = await QRCode.toDataURL(qrData);

  const user = await User.findById(userId);

  const emailHTML = `
    <h2>🎟️ Booking Confirmation</h2>
    <p>Hi ${user.name},</p>
    <p>Your booking for <b>${event.title}</b> was successful!</p>
    <p><b>Date:</b> ${new Date(event.date).toDateString()}</p>
    <p><b>Tickets:</b> ${tickets}</p>
    <p>Show this QR code at the event entrance:</p>
    <img src="${qrCode}" alt="QR Code" />
    <p>Thank you for booking with Eventify!</p>
  `;

  const emailtesting = await sendBookingEmail(
    user.email,
    `Booking Confirmation - ${event.title}`,
    emailHTML
  );
  console.log(emailtesting);
  return {
    message: "Booking successful. Confirmation email sent.",
    bookingId: booking._id,
  };
};

exports.bookingHistoryService = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate("event", "title date location ticketPrice")
    .sort({ createdAt: -1 });

  if (!bookings.length) {
    return { message: "No bookings found for this user.", bookings: [] };
  }

  return bookings.map((b) => ({
    bookingId: b._id,
    eventTitle: b.event?.title,
    eventDate: b.event?.date,
    location: b.event?.location,
    tickets: b.tickets,
    totalAmount: b.tickets * b.event?.ticketPrice,
    bookedAt: b.createdAt,
  }));
};
