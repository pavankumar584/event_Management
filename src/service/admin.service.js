const userModel = require("../models/user.model");
const eventModel = require("../models/event.model");
const waitlistModel = require("../models/waitlist.model");
const bookingModel = require("../models/booking.model");
const { sendBookingEmail } = require("../utils/mailer");

exports.getAllUserService = async () => {
  const users = await userModel.find({ role: "user" });
  return users.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
  }));
};

exports.getUserByIdService = async (id) => {
  const user = await userModel.findById(id);

  if (!user) {
    throw new Error("User not found");
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
};

exports.getAllOrganizerService = async () => {
  const organizers = await userModel.find({ role: "organizer" });

  return organizers.map((o) => ({
    _id: o._id,
    name: o.name,
    email: o.email,
    role: o.role,
    profilePic: o.profilePic || null,
    avatar: o.avatar,
  }));
};

exports.getOrganizerByIdService = async (id) => {
  const organizer = await userModel.findOne({ _id: id, role: "organizer" });

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  return {
    _id: organizer._id,
    name: organizer.name,
    email: organizer.email,
    profilePic: organizer.profilePic || null,
    avatar: organizer.avatar,
    role: organizer.role,
  };
};
exports.banUserIdByAdminService = async (data) => {
  const { userId } = data;

  const user = await userModel.findByIdAndUpdate(
    userId,
    { banned: true },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return { message: `User ${user.name} has been banned successfully` };
};

exports.unBanUserIdByAdminService = async (data) => {
  const { userId } = data;
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.banned) {
    throw new Error("User is already unbanned.");
  }
  await userModel.updateOne({ _id: userId }, { $set: { banned: false } });
  return { message: `User ${user.name} has been unbanned successfully` };
};

exports.getAllBannedUsersService = async () => {
  const users = await userModel.find({ banned: true }).select("-password");
  return users;
};

exports.notifyWaitlistUserService = async (eventId) => {
  const event = await eventModel.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Find users in the waitlist for this event
  const waitlistedUsers = await waitlistModel
    .find({ event: eventId })
    .populate("user");

  if (waitlistedUsers.length === 0) throw new Error("No users on waitlist");

  for (const entry of waitlistedUsers) {
    const user = entry.user;

    const emailHTML = `
      <h2>🎫 Good News!</h2>
      <p>Hi ${user.name},</p>
      <p>Tickets for <b>${event.title}</b> are now available again!</p>
      <p>You requested <b>${entry.ticketsRequested}</b> tickets earlier.</p>
      <p><a href="https://yourfrontend.com/events/${eventId}">Book Now</a></p>
      <p>Hurry! Tickets may sell out soon.</p>
    `;

    // Send the email
    await sendBookingEmail(
      user.email,
      `Tickets Available Again - ${event.title}`,
      emailHTML
    );
    // Remove from waitlist after notification
    await Waitlist.deleteOne({ _id: entry._id });
  }
  console.log("✅ Waitlisted users notified successfully.");
};

exports.getAnalyticsDashboardService = async () => {
  const totalUsers = await userModel.countDocuments({ role: "user" });
  const totalEvents = await eventModel.countDocuments();
  const totalBookings = await bookingModel.countDocuments();
  const totalNumberOfUserWaitingList = await waitlistModel.countDocuments()
  const totalRevenueData = await bookingModel.aggregate([
    {
      $lookup: {
        from: "events",
        localField: "event",
        foreignField: "_id",
        as: "eventDetails",
      },
    },
    { $unwind: "$eventDetails" },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $multiply: ["$tickets", "$eventDetails.ticketPrice"] },
        },
      },
    },
  ]);

  const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

  return {
    totalUsers,
    totalEvents,
    totalBookings,
    totalNumberOfUserWaitingList,
    totalRevenue,
  };
};
