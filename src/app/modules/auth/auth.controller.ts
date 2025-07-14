import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthService.credentialsLogin(req.body);


  setAuthCookie(res, loginInfo)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: loginInfo,
  });
});


const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    throw new AppError(StatusCodes.BAD_REQUEST, "No refresh token received from cookies.");
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);


  setAuthCookie(res, tokenInfo)


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New Access Token Retrieved successfully",
    data: tokenInfo,
  });
});



export const AuthController = {
  credentialsLogin,
  getNewAccessToken,

};
