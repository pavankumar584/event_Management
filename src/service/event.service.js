const Event = require("../models/event.model");

exports.createEventService = async (organizerId, data) => {
  const existing = await Event.findOne({ title: data.title });
  if (existing) throw new Error("Event with this title already exists");

  if (!data.availableTickets) {
    data.availableTickets = data.totalTickets;
  }
  const event = await Event.create({ ...data, organizer: organizerId });
  return event;
};

exports.updateEventService = async (organizerId, eventId, data) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (event.organizer.toString() !== organizerId && data.role !== "admin") {
    throw new Error("Not authorized to update this event");
  }

  if (data.totalTickets && data.totalTickets !== event.totalTickets) {
    const difference = data.totalTickets - event.totalTickets;
    let newAvailableTickets = event.availableTickets + difference;

    if (newAvailableTickets < 0) newAvailableTickets = 0;

    data.availableTickets = newAvailableTickets;
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: data },
    { new: true, runValidators: true }
  );

  return updatedEvent;
};

exports.getAllEventsService = async (user) => {
  if (user.role === "organizer") {
    return await Event.find({ organizer: user.id });
  } else if (user.role === "admin") {
    return await Event.find();
  } else {
    return await Event.find({ isPublished: true });
  }
};

exports.getEventByIdService = async (organizerId, eventId) => {
  const event = await Event.findOne({ _id: eventId, organizer: organizerId });
  if (!event) throw new Error("Event not found or unauthorized to view");
  return event;
};

exports.deleteEventService = async (user, eventId) => {
  // If user is admin → delete any event
  if (user.role === "admin") {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new Error("Event not found");
    return { message: `Event "${event.title}" deleted by admin.` };
  }

  // If user is organizer → delete only their own event
  if (user.role === "Organizer") {
    const event = await Event.findOneAndDelete({
      _id: eventId,
      organizer: user.id,
    });
    if (!event) throw new Error("Event not found or unauthorized to delete");
    return { message: `Event "${event.title}" deleted successfully.` };
  }

  throw new Error("Unauthorized role");
};

exports.getTicketAvailabilityService = async (eventId) => {
  const event = await Event.findById(eventId).select(
    "title availableTickets totalTickets date"
  );
  if (!event) throw new Error("Event Not Found");
  const soldTickets = event.totalTickets - event.availableTickets;
  console.log(soldTickets);
  return {
    eventId: event._id,
    title: event.title,
    date: event.date,
    totalTickets: event.totalTickets,
    availableTickets: event.availableTickets,
    soldTickets,
    status: event.availableTickets > 0 ? "Available" : "Sold Out",
  };
};

exports.togglePublishEventService = async (user) => {
  let query = {};

  if (user.role === "organizer") {
    query.organizer = user.id;
  }
  const events = await Event.find(query);
  return events;
};

exports.browseEventsService = async (filters) => {
  const {
    search,
    category,
    location,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    sortBy,
  } = filters;

  const query = {
    isPublished: true,
    date: { $gte: new Date() },
  };

  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
  }

  if (category) query.category = category;
  if (location) query.location = new RegExp(location, "i");
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (minPrice || maxPrice) {
    query.ticketPrice = {};
    if (minPrice) query.ticketPrice.$gte = Number(minPrice);
    if (maxPrice) query.ticketPrice.$lte = Number(maxPrice);
  }
  let sortOption = { date: 1 };
  if (sortBy === "newest") sortOption = { createdAt: -1 };
  if (sortBy === "lowestPrice") sortOption = { ticketPrice: 1 };
  if (sortBy === "highestPrice") sortOption = { ticketPrice: -1 };
  if (sortBy === "popular") sortOption = { totalTickets: -1 };
  const events = await Event.find(query).sort(sortOption);
  return events;
};
