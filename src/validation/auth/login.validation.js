const Joi = require("joi");

const LoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = LoginValidation;