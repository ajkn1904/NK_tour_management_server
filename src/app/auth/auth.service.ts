import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatch = await bcryptjs.compare( password as string, isUserExists.password as string );
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect");
  }


  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role
  }

  const accessToken = jwt.sign(jwtPayload, "secret", {
    expiresIn: "2d"
  })


  return {
    //email:isUserExists.email
    accessToken
  }
};

export const AuthService = {
  credentialsLogin,
};
