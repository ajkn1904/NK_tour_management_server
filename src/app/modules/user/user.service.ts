import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

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

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};



export const userServices = {
  createUser,
  getAllUsers,
};
