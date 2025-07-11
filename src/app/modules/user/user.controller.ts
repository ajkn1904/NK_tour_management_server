/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({ name, email });
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
    });

  } catch (error: any) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Something went wrong!! ${error.message}`,
    });
  }
};

export const userController = {
    createUser,
};
