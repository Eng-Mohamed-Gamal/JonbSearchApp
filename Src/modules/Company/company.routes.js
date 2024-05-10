import { Router } from "express";
import * as cc from "./company.controller.js";
import expressAsyncHandler from "express-async-handler";
const router = Router();
import { auth } from "../../middleWares/auth.js";
import { systemRoles } from "../../utils/systemRules.js";
import { validationMiddleware } from "../../middleWares/validation.middleWare.js";
import { addCompanySchema, deleteCompanySchema, getAllApplicationsAndCreateExcelSheetSchema, getAllApplicationsForSpecificJobsSchema, getCompanyDataSchema, searchCompanyWithNameSchema, updateCompanySchema } from "./company.validation.js";

router.post(
  "/",
  auth([systemRoles.Company_HR]),
  validationMiddleware(addCompanySchema) ,
  expressAsyncHandler(cc.addCompany)
);
router.put(
  "/updateCompany",
  auth([systemRoles.Company_HR]),
  validationMiddleware(updateCompanySchema) ,
  expressAsyncHandler(cc.updateCompany)
);
router.delete(
  "/deleteCompany",
  auth([systemRoles.Company_HR]),
  validationMiddleware(deleteCompanySchema) ,
  expressAsyncHandler(cc.deleteCompany)
);
router.get(
  "/searchCompanyWithName",
  auth([systemRoles.Company_HR, systemRoles.User]),
  validationMiddleware(searchCompanyWithNameSchema) ,
  expressAsyncHandler(cc.searchCompanyWithName)
);
router.get(
  "/getCompanyData/:companyId",
  auth([systemRoles.Company_HR]),
  validationMiddleware(getCompanyDataSchema) ,
  expressAsyncHandler(cc.getCompanyData)
);
router.get(
  "/getAllApplicationsForSpecificJobs",
  auth([systemRoles.Company_HR]),
  validationMiddleware(getAllApplicationsForSpecificJobsSchema) ,
  expressAsyncHandler(cc.getAllApplicationsForSpecificJobs)
);
router.get(
  "/getAllApplicationsAndCreateExcelSheet",
  auth([systemRoles.Company_HR]) ,
  validationMiddleware(getAllApplicationsAndCreateExcelSheetSchema) ,
  expressAsyncHandler(cc.getAllApplicationsAndCreateExcelSheet)
);

export default router;
