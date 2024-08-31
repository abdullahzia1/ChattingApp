const Joi = require("joi");

const signupValidation = Joi.object().keys({
  email: Joi.string().min(3).max(30).required().messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
  password: Joi.string().min(6).max(15).required().messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
  // phone: Joi.number().min(11).max(11).required().messages({
  //   "string.min": "Phone number should be 11 numeric nums",
  //   "string.max": "Phone number should be 11 numeric nums",
  //   "any.number":
  //     "Phone Number is a string, convert it to Integer before saving it to server xD",
  //   "any.required": "Phone Number is required",
  // }),

  name: Joi.string().min(1).max(50).required().messages({
    "string.min": "Minimum 1 letter",
    "string.max": "Max name cannot exceed 50 cahracters ",
  }),
  // role: Joi.string().required().min(4).messages({
  //   "string.min": "Minimum 4 letters",
  //   "any.required": "Role is required",
  // }),
});

const loginValidation = Joi.object().keys({
  email: Joi.string().min(3).max(30).required().messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
  password: Joi.string().min(6).max(15).required().messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
});

export { signupValidation, loginValidation };
