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
    message: "User Logged in Successfully",
    data: loginInfo,
  });
});


const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
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


const logout = catchAsync(async (req: Request, res: Response) => {
 
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



export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout

};
