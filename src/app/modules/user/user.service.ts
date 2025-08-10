import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const authsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  
  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized")
    }
  }

  const ifUserExists = await User.findById(userId);
  if(!ifUserExists){
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  };

  if (decodedToken.role === Role.ADMIN && ifUserExists.role === Role.SUPER_ADMIN) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized")
  }

  /**
   * email - can not update
   * name, phone, password address
   * password - re hashing
   *  only admin superadmin - role, isDeleted...
   * 
   * promoting to superadmin - superadmin
   */

  if(payload.role){
    if(decodedToken.role === Role.USER || decodedToken.role ===  Role.GUIDE){
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
    }
    // if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
    //   throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
    // }
  };

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === Role.USER || decodedToken.role ===  Role.GUIDE){
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
    }
  };

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

  return newUpdatedUser;

};



const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])
  return {
    data,
    meta
  };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
      data: user
  }
}


export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe
};
