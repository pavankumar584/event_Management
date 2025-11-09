const Joi = require("joi");

const createEventValidation = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
  }),

  description: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters long",
  }),

  category: Joi.string()
    .valid("Music", "Sports", "Education", "Technology", "Art", "Other")
    .required()
    .messages({
      "any.only": "Category must be one of Music, Sports, Education, Technology, Art, or Other",
    }),

  date: Joi.date().greater("now").required().messages({
    "date.greater": "Date must be a future date",
    "any.required": "Date is required",
  }),

  time: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM (24-hour) format",
      "string.empty": "Time is required",
    }),

  totalTickets: Joi.number().integer().min(1).required().messages({
    "number.base": "Total tickets must be a number",
    "number.min": "Total tickets must be at least 1",
  }),

  availableTickets: Joi.number()
    .integer()
    .min(0)
    .optional() 
    .messages({
      "number.base": "Available tickets must be a number",
      "number.min": "Available tickets cannot be negative",
    }),

  location: Joi.string().min(3).required().messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 3 characters long",
  }),

  ticketPrice: Joi.number().min(0).required().messages({
    "number.base": "Ticket price must be a number",
    "number.min": "Ticket price cannot be negative",
  }),
});

module.exports = createEventValidation;
