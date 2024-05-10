import { Router } from "express";
import * as jc from "./job.controller.js";
import { auth } from "../../middleWares/auth.js";
import { systemRoles } from "../../utils/systemRules.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middleWares/validation.middleWare.js";
import {
  addJobSchema,
  applyToJobSchema,
  deleteJobSchema,
  getAllJobsWithFiltersSchema,
  getAllJobsWithSpecificCompanySchema,
  updateJobSchema,
} from "./job.validation.js";
import multerMiddleWare from "../../middleWares/multer.js"


const router = Router();

router.post(
  "/",
  auth([systemRoles.Company_HR]),
  validationMiddleware(addJobSchema),
  expressAsyncHandler(jc.addJob)
);
router.put(
  "/updateJob/:jobId",
  auth([systemRoles.Company_HR]),
  validationMiddleware(updateJobSchema),
  expressAsyncHandler(jc.updateJob)
);
router.delete(
  "/deleteJob/:jobId",
  auth([systemRoles.Company_HR]),
  validationMiddleware(deleteJobSchema),
  expressAsyncHandler(jc.deleteJob)
);
router.get(
  "/getAllJobsWithCompanys",
  auth([systemRoles.Company_HR, systemRoles.User]),
  expressAsyncHandler(jc.getAllJobsWithCompanys)
);
router.get(
  "/getAllJobsWithSpecificCompany",
  auth([systemRoles.Company_HR, systemRoles.User]),
  validationMiddleware(getAllJobsWithSpecificCompanySchema),
  expressAsyncHandler(jc.getAllJobsWithSpecificCompany)
);
router.get(
  "/getAllJobsWithFilters",
  auth([systemRoles.Company_HR, systemRoles.User]),
  validationMiddleware(getAllJobsWithFiltersSchema),
  expressAsyncHandler(jc.getAllJobsWithFilters)
);
router.post(
  "/applyToJob/:jobId",
  auth([systemRoles.User]),
  validationMiddleware(applyToJobSchema),
  multerMiddleWare({
    extensions : allowedExtensions.document
  }).single("Resume") ,
  expressAsyncHandler(jc.applyToJob)
);

export default router;
