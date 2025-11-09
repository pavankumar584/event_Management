const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const createEventValidation = require("../validation/event/create.validation");
const updateEventValidation = require("../validation/event/update.validation");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  togglePublish,
  browseEvents,
  getTicketAvailability,
} = require("../controllers/event.controller");
const versionMiddleware = require("../middlewares/version.middleware");

router.get("/event-browse", versionMiddleware(["1.0.0"]), browseEvents);
router.get("/event/:id", versionMiddleware(["1.0.0"]), getEventById);

router.post(
  "/create",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["organizer"]),
  validationMiddleware(createEventValidation, "body"),
  createEvent
);

router.get(
  "/allEvent",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["organizer", "admin"]),
  getAllEvents
);

router.put(
  "/update/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["organizer"]),
  validationMiddleware(updateEventValidation, "body"),
  updateEvent
);

router.delete(
  "/delete/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["admin", "organizer"]),
  deleteEvent
);
router.patch(
  "/publish/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["admin", "organizer"]),
  togglePublish
);

router.get(
  "/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  roleMiddleware(["organizer"]),
  getEventById
);

router.get(
  "/availability/:eventId",
  versionMiddleware(["1.0.0"]),
  getTicketAvailability
);

module.exports = router;
