const Joi = require("joi");

const updateEventValidation = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters long",
  }),

  description: Joi.string().min(10).max(1000).messages({
    "string.min": "Description must be at least 10 characters long",
  }),

  category: Joi.string()
    .valid("Music", "Sports", "Education", "Technology", "Art", "Other")
    .messages({
      "any.only":
        "Category must be one of Music, Sports, Education, Technology, Art, or Other",
    }),

  date: Joi.date().greater("now").messages({
    "date.greater": "Date must be a future date",
  }),

  time: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .messages({
      "string.pattern.base": "Time must be in HH:MM (24-hour) format",
    }),

  totalTickets: Joi.number().integer().min(1).messages({
    "number.min": "Total tickets must be at least 1",
  }),

  availableTickets: Joi.number().integer().min(0).messages({
    "number.min": "Available tickets cannot be negative",
  }),

  location: Joi.string().min(3).messages({
    "string.min": "Location must be at least 3 characters long",
  }),

  ticketPrice: Joi.number().min(0).messages({
    "number.min": "Ticket price cannot be negative",
  }),

  isPublished: Joi.boolean(),
});

module.exports = updateEventValidation;
