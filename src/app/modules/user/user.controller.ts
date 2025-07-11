/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
    });

});



const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const users = await userServices.getAllUsers();
    res.status(StatusCodes.OK).json({
        message: "All users retrieved successfully",
        data: users,
    });

})



export const userController = {
  createUser,
  getAllUsers
};
