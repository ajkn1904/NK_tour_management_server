import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect");
  }

  // const jwtPayload = {
  //   userId: isUserExists._id,
  //   email: isUserExists.email,
  //   role: isUserExists.role,
  // };

  // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

  const userTokens = createUserTokens(isUserExists);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password: pass, ...rest} = isUserExists.toObject(); //it has been done for security purpose

  return {
    //email:isUserExists.email
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest
  };
};


const getNewAccessToken = async (refreshToken: string) => {

 const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  };
};

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
  
};
