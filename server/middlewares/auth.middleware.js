import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = userDetails;

  next();
};

const authorizedRoles = (...roles)=> async (req,res,next)=>{
    const currentUserRoles = req.user.role;
    if(!roles.includes(currentUserRoles)){
        return next(
            new AppError('You do not have permission to access this route',403)
        )
    }
    next();
}

export { isLoggedIn,authorizedRoles };
