const Joi = require("joi");

const updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
});

module.exports = updateProfileValidation;
