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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const handleDuplicateError_1 = require("../utils/errorHelpers/handleDuplicateError");
const handleCastError_1 = require("../utils/errorHelpers/handleCastError");
const handleZodError_1 = require("../utils/errorHelpers/handleZodError");
const handleValidationError_1 = require("../utils/errorHelpers/handleValidationError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENVIRONMENT === "development") {
        console.log(err);
    }
    console.log(({ file: req.files }));
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = req.files.map(file => file.path);
        yield Promise.all(imageUrls.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    let errorSources = [];
    let statusCode = err.statusCode || 500;
    let message = "Something went wrong!";
    //duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    //Object ID error / cast error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    //zod error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    //other global errors
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err: env_1.envVars.NODE_ENVIRONMENT === "development" ? err : null,
        stack: env_1.envVars.NODE_ENVIRONMENT === "development" ? err.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
