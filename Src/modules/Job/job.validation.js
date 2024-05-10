import Joi from "joi";
import { generalRules } from "../../utils/general.validationRule.js";

export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().required().valid("part-time", "full-time"),
    seniorityLevel: Joi.string()
      .required()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().required(),
    softSkills: Joi.array().required(),
    companyName: Joi.string().required(),
  }),
};
export const updateJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().required().valid("part-time", "full-time"),
    seniorityLevel: Joi.string()
      .required()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    technicalSkills: Joi.array().required(),
    jobDescription: Joi.string().required(),
    softSkills: Joi.array().required(),
  }),
  params: Joi.object({
    jobId: generalRules.dbId,
  }),
};
export const deleteJobSchema = {
  params: Joi.object({
    jobId: generalRules.dbId,
  }),
};
export const getAllJobsWithSpecificCompanySchema = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
};
export const getAllJobsWithFiltersSchema = {
  body: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().valid("part-time", "full-time"),
    seniorityLevel: Joi.string().valid(
      "Junior",
      "Mid-Level",
      "Senior",
      "Team-Lead",
      "CTO"
    ),
    technicalSkills: Joi.array(),
  }),
};
export const applyToJobSchema = {
  query: Joi.object({
    userTechSkills: Joi.array().required(),
    userSoftSkills: Joi.array().required(),
  }),
  params: Joi.object({
    jobId: generalRules.dbId.required(),
  }),
};
