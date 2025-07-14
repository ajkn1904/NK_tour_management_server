/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginInfo = await AuthService.credentialsLogin(req.body);


  setAuthCookie(res, loginInfo)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Logged in Successfully",
    data: loginInfo,
  });
});


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    throw new AppError(StatusCodes.BAD_REQUEST, "No Refresh Token Received from Cookies.");
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);


  setAuthCookie(res, tokenInfo)


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New Access Token Retrieved Successfully",
    data: tokenInfo,
  });
});


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged Out Successfully",
    data: null,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Changed Successfully",
    data: null,
  });
});



export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword

};
