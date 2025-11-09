const Joi = require("joi");

const BookingValidation = Joi.object({
  eventId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid event ID format",
      "any.required": "Event ID is required",
    }),

  tickets: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Tickets must be a number",
      "number.min": "You must book at least one ticket",
      "any.required": "Number of tickets is required",
    }),
});

module.exports = BookingValidation;
