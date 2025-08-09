/* eslint-disable @typescript-eslint/no-unused-vars */ 
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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



const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const verifiedToken = req.user;
    const payload = req.body;


    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User updated successfully",
        data: user,
    })

});



const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await userServices.getAllUsers(query as Record<string, string>);
    // res.status(StatusCodes.OK).json({
    //     message: "All users retrieved successfully",
    //     data: users,
    // });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All users retrieved successfully",
        data: result.data,
        meta: result.meta,
    })

})


const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await userServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})



export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe
};
