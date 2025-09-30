import Joi from "joi";

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments:2,
    tlds:{allow:["com","in"]}
  }).required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional()
});