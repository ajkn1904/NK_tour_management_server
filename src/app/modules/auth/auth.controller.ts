/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //const loginInfo = await AuthService.credentialsLogin(req.body);

  passport.authenticate("local", async (error: any, user: any, info:any) => {
    if(error){
      return next(new AppError(StatusCodes.NOT_FOUND, error))
    }
    if(!user){
      return next(new AppError(StatusCodes.NOT_FOUND, info.message))
    };

    const userToken = await createUserTokens(user);
    setAuthCookie(res, userToken);

    const {password, ...rest} = user.toObject();


    //setAuthCookie(res, loginInfo)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User Logged in Successfully",
      data: {
        //loginInfo
        accessToken : userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
      },
    });

  })(req, res, next);
  
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


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Changed Successfully",
    data: null,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  const decodedToken = req.user;

  await AuthService.resetPassword(req.body, decodedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Reset Successfully",
    data: null,
  });
});


const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  const decodedToken = req.user as JwtPayload;;
  const {password} = req.body;

  await AuthService.setPassword(decodedToken.userId, password)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Added Successfully",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email } = req.body;

    await AuthService.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  let redirectTo = req.query.state ? req.query.state as string : "";
  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1)
  };

  const user = req.user;
  if(!user){
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  };

  const tokenInfo = createUserTokens(user);

  setAuthCookie(res, tokenInfo);

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});



export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
  googleCallbackController

};
