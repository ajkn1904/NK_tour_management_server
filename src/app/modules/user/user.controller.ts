/* eslint-disable @typescript-eslint/no-unused-vars */ 
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    // res.status(StatusCodes.CREATED).json({
    //   message: "User created successfully",
    //   user,
    // });

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User created successfully",
        data: user,
    })

});



const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const result = await userServices.getAllUsers();
    // res.status(StatusCodes.OK).json({
    //     message: "All users retrieved successfully",
    //     data: users,
    // });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All users retrieved successfully",
        data: result.users,
        meta: result.meta,
    })

})



export const userController = {
  createUser,
  getAllUsers
};
