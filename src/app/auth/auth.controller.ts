import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        data: loginInfo,
    })

});

export const AuthController = {
    credentialsLogin,
};