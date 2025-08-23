"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const setCookie_1 = require("../../utils/setCookie");
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const loginInfo = await AuthService.credentialsLogin(req.body);
    passport_1.default.authenticate("local", (error, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return next(new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, error));
        }
        if (!user) {
            return next(new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, info.message));
        }
        ;
        const userToken = yield (0, userTokens_1.createUserTokens)(user);
        (0, setCookie_1.setAuthCookie)(res, userToken);
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        //setAuthCookie(res, loginInfo)
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User Logged in Successfully",
            data: {
                //loginInfo
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            },
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Refresh Token Received from Cookies.");
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Logged Out Successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    yield auth_service_1.AuthService.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_service_1.AuthService.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password Reset Successfully",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    ;
    const { password } = req.body;
    yield auth_service_1.AuthService.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password Added Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Email Sent Successfully",
        data: null,
    });
}));
const googleCallbackController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    ;
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User Not Found");
    }
    ;
    const tokenInfo = (0, userTokens_1.createUserTokens)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
    googleCallbackController
};
