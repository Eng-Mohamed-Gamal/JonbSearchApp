import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";

export const auth = (accessRules) => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers;
      if (!accesstoken)
        return res.status(400).json({ message: "Please LogIn" });
      if (!accesstoken.startsWith(process.env.PREFIX_TOKEN))
        return res.status(400).json({ message: "InValid Token" });
      const token = accesstoken.split(process.env.PREFIX_TOKEN)[1];
      const decodedData = jwt.verify(token, process.env.TOKEN_MAIN_SIGNATURE);
      if (!decodedData || !decodedData.id)
        return res.status(400).json({ message: "InValid Token" });
      const user = await User.findById(decodedData.id);
      if (!user)
        return res
          .status(404)
          .json({ message: "User Not Found Please signUp" });
      if (!accessRules.includes(user.role))
        return next(new Error("Not Authorized To Get This Api" ,  {cause : 401}));
      req.authUser = user;
      next();
    } catch (err) {
      return res
        .status(500)
        .json({
          message: "Catch Error From Auth MiddleWare",
          errMsg: err.message,
        });
    }
  };
};
