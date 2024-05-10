import { Router } from "express";
import * as uc from "./user.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middleWares/auth.js";
import { systemRoles } from "../../utils/systemRules.js";
import { validationMiddleware } from "../../middleWares/validation.middleWare.js";
import {
  forgetPasswordSchema,
  getProfilDataForAnotherUserSchema,
  getUsersByRecoveryEmailSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  updatedUserSchema,
} from "./user.validationSchema.js";

const router = Router();

router.post(
  "/signUp",
  validationMiddleware(signUpSchema),
  expressAsyncHandler(uc.signUp)
);
router.post(
  "/signIn",
  validationMiddleware(signInSchema),
  expressAsyncHandler(uc.signIn)
);
router.put(
  "/",
  auth([systemRoles.User, systemRoles.Company_HR]),
  validationMiddleware(updatedUserSchema),
  expressAsyncHandler(uc.updateUser)
);
router.patch(
  "/",
  auth([systemRoles.User, systemRoles.Company_HR]),
  validationMiddleware(updatePasswordSchema),
  expressAsyncHandler(uc.updatePassword)
);
router.delete(
  "/",
  auth([systemRoles.User, systemRoles.Company_HR]),
  expressAsyncHandler(uc.deleteUser)
);
router.get(
  "/",
  auth([systemRoles.User, systemRoles.Company_HR]),
  expressAsyncHandler(uc.getUser)
);
router.get(
  "/getProfilDataForAnotherUser/:id",
  validationMiddleware(getProfilDataForAnotherUserSchema),
  expressAsyncHandler(uc.getProfilDataForAnotherUser)
);
router.get(
  "/getUsersByRecoveryEmail",
  validationMiddleware(getUsersByRecoveryEmailSchema),
  expressAsyncHandler(uc.getUsersByRecoveryEmail)
);
router.post(
  "/forgetPassword",
  validationMiddleware(forgetPasswordSchema),
  expressAsyncHandler(uc.forgetPassword)
);

export default router;
