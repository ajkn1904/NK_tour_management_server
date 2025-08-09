import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "No token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;


      const isUserExists = await User.findOne({email: verifiedToken.email});


      if(!isUserExists){
          throw new AppError(StatusCodes.BAD_REQUEST, "User does not exists!")
      };

      if (!isUserExists.isVerified) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified")
      }


      if(isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE){
          throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExists.isActive}`)
      };
      if(isUserExists.isDeleted){
          throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!")
      };

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You do not have permission to access this route!"
        );
      };

      
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
