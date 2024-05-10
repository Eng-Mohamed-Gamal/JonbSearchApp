import Joi from "joi";
import { systemRoles } from "../../utils/systemRules.js";
import { generalRules } from "../../utils/general.validationRule.js";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().required().min(3).max(15),
    lastName: Joi.string().required().min(3).max(15),
    email: Joi.string().required().email(),
    password: Joi.string().required().alphanum(),
    recoveryEmail: Joi.string().required().email(),
    DOB: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string()
      .valid(systemRoles.User, systemRoles.Company_HR)
      .required(),
      hint : Joi.string().required()
  }).with("email", "password"),
};

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().email(),
    mobileNumber: Joi.string(),
    password: Joi.string().required().alphanum(),
  }),
};

export const updatedUserSchema = {
  body: Joi.object({
    firstName: Joi.string().required().min(3).max(15),
    lastName: Joi.string().required().min(3).max(15),
    email: Joi.string().required().email(),
    recoveryEmail: Joi.string().required().email(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    newPassword: Joi.string().required().alphanum(),
    oldPassword: Joi.string().required().alphanum(),
  }).with("newPassword" , "oldPassword"),
};

export const getUsersByRecoveryEmailSchema = {
  body: Joi.object({
    recoveryEmail: Joi.string().required().email(),
  }),
};

export const getProfilDataForAnotherUserSchema = {
  params: Joi.object({
    id: generalRules.dbId,
  }),
};
export const forgetPasswordSchema = {
  body : Joi.object({
    email : Joi.string().email().required() ,
    OtpFromUser : Joi.string() ,
    hint : Joi.string() ,
    newPassword : Joi.string()
  })
  
};
