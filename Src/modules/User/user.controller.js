import User from "../../../DB/models/user.model.js";
import Otp from "../../../DB/models/otp.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import generateUniqueString from "../../utils/generateUniqueString.js";
import Application from "../../../DB/models/application.model.js";

/*==================================signUp============================================== */

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    hint,
  } = req.body;
  // email check
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist)
    return next(new Error("Email Is Already Exist", { cause: 400 }));

  // mobileNumber check
  const isMobileNumberExist = await User.findOne({ mobileNumber });
  if (isMobileNumberExist)
    return next(new Error("MobileNumber Is Already Exist", { cause: 400 }));

  // hashPassword
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  // add user
  const date = moment(DOB).format("L");
  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    userName: `${firstName} ${lastName}`,
    password: hashedPassword,
    recoveryEmail,
    mobileNumber,
    DOB: date,
    role,
    hint,
  });

  if (!createdUser) return next(new Error("Create Fail", { cause: 500 }));
  return res.status(201).json({ message: "Created", User: createdUser });
};

/*==================================signIn============================================== */

export const signIn = async (req, res, next) => {
  const { email, mobileNumber, password } = req.body;
  let user;
  // email check
  if (email) {
    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist)
      return next(new Error("Wrong Credentials", { cause: 404 }));
    user = isEmailExist;
  }
  // mobileNumber check
  if (mobileNumber) {
    const isMobileNumberExist = await User.findOne({ mobileNumber });
    if (!isMobileNumberExist)
      return next(new Error("Wrong Credentials", { cause: 404 }));
    user = isMobileNumberExist;
  }

  // compare Password
  const comparePassword = bcrypt.compareSync(password, user.password);
  if (!comparePassword)
    return next(new Error("Wrong Credentials", { cause: 404 }));

  //change status to online
  user.status = "online";
  await user.save();

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_MAIN_SIGNATURE
  );
  return res.status(200).json({ message: "Done", token });
};

/*==================================updateUser============================================== */

export const updateUser = async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  // email check
  if (email) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return next(new Error("Email Is Already Exist", { cause: 400 }));
  }

  // mobileNumber check
  if (mobileNumber) {
    const isMobileNumberExist = await User.findOne({ mobileNumber });
    if (isMobileNumberExist)
      return next(new Error("MobileNumber Is Already Exist", { cause: 400 }));
  }

  // updateUser
  const updatedUser = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      email,
      mobileNumber,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
    },
    { new: true }
  );

  if (!updatedUser) return next(new Error("Create Fail", { cause: 500 }));
  return res.status(200).json({ message: "Done", User: updatedUser });
};

/*==================================deleteUser============================================== */

export const deleteUser = async (req, res, next) => {
  const { _id : userId } = req.authUser;
  // deleteUser
  const deletedUser = await User.findByIdAndDelete(_id);
  if (!deletedUser) return next(new Error("Create Fail", { cause: 500 }));
 // 2-delete the related Applications
 const applications = await Application.deleteMany({ userId  });
 if (Application.deletedCount <= 0) {
   console.log(applications.deletedCount);
   console.log("There is no related applications");
 }
  return res.status(200).json({ message: "Done",  deletedUser });
};

/*==================================getUser============================================== */

export const getUser = async (req, res, next) => {
  const { _id } = req.authUser;
  // getUser
  const user = await User.findById(_id);
  return res.status(200).json({ message: "Done", user });
};

/*==================================getProfilDataForAnotherUser============================================== */

export const getProfilDataForAnotherUser = async (req, res, next) => {
  const { id } = req.params;
  // getUser
  const user = await User.findById(id);
  return res.status(200).json({ message: "Done", user });
};

/*==================================updatePassword============================================== */

export const updatePassword = async (req, res, next) => {
  const { oldPassword  , newPassword } = req.body;
  const { authUser } = req;
  // comparePassword
  const copmarePassword = bcrypt.compareSync(oldPassword , authUser.password)
  if(!copmarePassword) return next(new Error("Wrong Password", { cause: 400 }));
  // hashPassword
  const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);
  // updatePassword
  authUser.password = hashedPassword;
  await authUser.save();
  return res.status(200).json({ message: "Done", User: authUser });
};

/*==================================getUsersByRecoveryEmail============================================== */

export const getUsersByRecoveryEmail = async (req, res, next) => {
  const { recoveryEmail } = req.body;
  // get accounts
  const Users = await User.find({ recoveryEmail });
  if (!Users.length)
    return next(new Error("There Is No Users For This RecoveryEmail"), {
      cause: 400,
    });
  return res.status(200).json({ message: "Done", count: Users.length, Users });
};

/*==================================forgetPassword============================================== */

export const forgetPassword = async (req, res, next) => {
  const { email, OtpFromUser, hint, newPassword } = req.body;
  // find User
  const user = await User.findOne({ email });
  // if the user only send the email so he need the otp
  if (email && user && !OtpFromUser && !hint && !newPassword) {
    // generate Unique String
    const OtpWillSent = generateUniqueString("123456789", 6);
    // create Otp Schema
    await Otp.create({ email, otp: OtpWillSent });
    return res.status(200).json({ message: "Done", OtpWillSent });
  }
  // reset password operation 
  else if(email && OtpFromUser && hint && newPassword) {

    // find otp
    const otp = await Otp.findOne({ email });

    if (user?.hint === hint && otp?.otp === OtpFromUser) {
      const hashedPassword = bcrypt.hashSync(
        newPassword,
        +process.env.SALT_ROUNDS
      );
      user.password = hashedPassword;
      // save password
      await user.save();
      // delete otp
      await Otp.findOneAndDelete({ email });

      return res.status(200).json({ message: "Password Reseted", user });
    } else {
      return res.status(400).json({ message: "Wrong CredenTials Try Again" });
    }
  }  else {
    return res.status(400).json({ message: "Wrong CredenTials No User" });
  }
};
