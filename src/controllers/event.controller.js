const {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
  togglePublishEventService,
  browseEventsService,
  getTicketAvailabilityService,
} = require("../service/event.service");

exports.createEvent = async (req, res) => {
  try {
    const event = await createEventService(req.user.id, req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  const events = await getAllEventsService(req.user);
  res.status(200).json(events);
};

exports.getEventById = async (req, res) => {
  const event = await getEventByIdService(req.user.id, req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.status(200).json(event);
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await updateEventService(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const result = await deleteEventService(req.user, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTicketAvailability = async (req, res) => {
  try {
    const { eventId } = req.params;
    const availability = await getTicketAvailabilityService(eventId);
    res.status(200).json({
      message: "Ticket availability fetched successfully.",
      data: availability,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.togglePublish = async (req, res) => {
  try {
    const { publish } = req.body;
    const user = req.user;

    const event = await togglePublishEventService(user, req.params.id, publish);

    res.status(200).json({
      message: `Event ${
        event.isPublished ? "published" : "unpublished"
      } successfully`,
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.browseEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy,
    } = req.query;
    const events = await browseEventsService({
      search,
      category,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy,
    });
    res.status(200).json({
      message: "Events fetched successfully",
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
