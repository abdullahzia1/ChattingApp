import Joi from "joi";

const signupValidation = Joi.object().keys({
  email: Joi.string().min(3).required().max(30).messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
  password: Joi.string().min(6).required().max(15).messages({
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

  name: Joi.string().min(1).required().max(50).messages({
    "string.min": "Minimum 1 letter",
    "string.max": "Max name cannot exceed 50 cahracters ",
  }),
  // role: Joi.string().required().min(4).messages({
  //   "string.min": "Minimum 4 letters",
  //   "any.required": "Role is required",
  // }),
});

const loginValidation = Joi.object().keys({
  email: Joi.string().min(3).required().max(30).messages({
    "string.min": "email must be 3 characters long",
    "string.max": "Maximum email characters are 15, ",
    "any.required": "email is required",
  }),
  password: Joi.string().min(6).required().max(15).messages({
    "string.min": "Password must be 6 characters long",
    "string.max": "Maximum password characters are 15, ",
    "any.required": "Password is required",
  }),
  // twoFAcode: Joi.number().min(1).required().max(6).messages({
  //   "number.min": "2fa must be 6 characters long",
  //   "number.max": "Maximum 2fa characters are 6, ",
  //   "any.required": "2FA code is required",
  // }),
});

const todoValidation = Joi.object().keys({
  description: Joi.string().min(6).required().messages({
    "string.min": "todo Description must be 6 characters long",
    "any.required": "Description is required",
  }),
});

export { signupValidation, loginValidation, todoValidation };
