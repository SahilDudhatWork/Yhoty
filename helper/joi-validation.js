const Joi = require("joi");

const options = {
  abortEarly: false,
};

// Common Schemas
const emailSchema = Joi.string()
  .email({ tlds: { allow: true } })
  .max(256)
  .required()
  .messages({
    "string.base": `Enter your email address in format: yourname@example.com`,
    "string.email": `Enter a valid email address`,
    "string.empty": `Email is required`,
    "string.max": `Email can have a maximum of {#limit} characters`,
    "any.required": `Email is required`,
  });

const passwordSchema = Joi.string()
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,15}$/,
    "password requirements"
  )
  .required()
  .messages({
    "string.pattern.name": `Password must include at least one uppercase letter, one lowercase letter, and one number, and be between 8-15 characters long`,
    "string.empty": `Password is required`,
    "any.required": `Password is required`,
  });

const countryCodeSchema = Joi.string()
  .pattern(/^\+\d{1,4}$/, "country code")
  .required()
  .messages({
    "string.pattern.name": `Country code must start with '+' followed by 1-4 digits`,
    "string.empty": `Country code is required`,
    "any.required": `Country code is required`,
  });

const phoneNumberSchema = Joi.string()
  .pattern(/^\d{10,15}$/, "phone number")
  .required()
  .messages({
    "string.pattern.name": `Phone number must be between 10-15 digits`,
    "string.empty": `Phone number is required`,
    "any.required": `Phone number is required`,
  });

const dobSchema = Joi.date().iso().required().messages({
  "date.base": `Date of birth must be a valid ISO date`,
  "date.format": `Date of birth must be in YYYY-MM-DD format`,
  "any.required": `Date of birth is required`,
});

const addressSchema = Joi.string().max(256).required().messages({
  "string.base": `Address must be a string`,
  "string.max": `Address cannot exceed {#limit} characters`,
  "string.empty": `Address is required`,
  "any.required": `Address is required`,
});

const optionalAddressSchema = Joi.string().max(256).allow(null, "").messages({
  "string.base": `Address must be a string`,
  "string.max": `Address cannot exceed {#limit} characters`,
});

const countrySchema = Joi.string().max(50).required().messages({
  "string.base": `Country must be a string`,
  "string.max": `Country cannot exceed {#limit} characters`,
  "string.empty": `Country is required`,
  "any.required": `Country is required`,
});

const citySchema = Joi.string().max(50).required().messages({
  "string.base": `City must be a string`,
  "string.max": `City cannot exceed {#limit} characters`,
  "string.empty": `City is required`,
  "any.required": `City is required`,
});

const fullNameSchema = Joi.string().max(100).required().messages({
  "string.base": `Full name must be a string`,
  "string.max": `Full name cannot exceed {#limit} characters`,
  "string.empty": `Full name is required`,
  "any.required": `Full name is required`,
});

const emailPasswordSchema = Joi.object()
  .keys({
    email: emailSchema,
    password: passwordSchema,
  })
  .unknown(true);

// Signup Schema
const signUpSchema = Joi.object().keys({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  countryCode: countryCodeSchema,
  phoneNumber: phoneNumberSchema,
  dob: dobSchema,
  address1: addressSchema,
  address2: optionalAddressSchema,
  country: countrySchema,
  city: citySchema,
});

const loginWithEmailSchema = Joi.object()
  .keys({
    email: emailSchema,
    password: passwordSchema,
  })
  .unknown(true);

// Function to validate signup data
const signUpSchemaValidate = (data) => {
  return signUpSchema.validate({ ...data }, options);
};

const emailAndPassVerification = (data) => {
  return emailPasswordSchema.validate(data, options);
};

const validateResetPassword = (data) => {
  return passwordSchema.validate(data.password, options);
};

const adminLogin = (data) => {
  return loginWithEmailSchema.validate(data, options);
};

module.exports = {
  signUpSchemaValidate,
  emailAndPassVerification,
  validateResetPassword,
  adminLogin,
};
