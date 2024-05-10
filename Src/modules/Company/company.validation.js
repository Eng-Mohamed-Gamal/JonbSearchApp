import Joi from "joi";
import {generalRules} from "../../utils/general.validationRule.js"

export const addCompanySchema = {
    body : Joi.object({
        companyName : Joi.string().required().min(4),
        descreption : Joi.string().required(),
        industry : Joi.string().required(),
        address : Joi.string().required() ,
        numberOfEmployees : Joi.object({
            minNumber : Joi.number() ,
            maxNumber : Joi.number() ,
        }).required(),
        companyEmail : Joi.string().required().email(),
    })
}
export const updateCompanySchema = {
    body : Joi.object({
        oldCompanyName : Joi.string().required().min(4),
        newCompanyName : Joi.string().required().min(4),
        descreption : Joi.string().required(),
        industry : Joi.string().required(),
        address : Joi.string().required() ,
        numberOfEmployees : Joi.object({
            minNumber : Joi.number() ,
            maxNumber : Joi.number() ,
        }).required(),
        companyEmail : Joi.string().required().email(),
    })
}

export const deleteCompanySchema = {
    body : Joi.object({
        companyName : Joi.string().required().min(4)
    })
}

export const searchCompanyWithNameSchema = {
    body : Joi.object({
        companyName : Joi.string().required().min(4),
    })
}
export const getAllApplicationsForSpecificJobsSchema = {
    body : Joi.object({
        companyName : Joi.string().required().min(4),
    })
}

export const getCompanyDataSchema = {
    params : Joi.object({
        companyId : generalRules.dbId ,
    })
}


export const getAllApplicationsAndCreateExcelSheetSchema = {
    query : Joi.object({
        companyName : Joi.string().required().min(4) ,
        applyDate : Joi.string().required()
    })
}