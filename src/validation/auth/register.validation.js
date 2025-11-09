const Joi = require("joi");

const RegisterValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role:Joi.string().valid('organizer','user').required(),
});

module.exports = RegisterValidation;
