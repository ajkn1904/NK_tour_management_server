/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { TErrorSources } from "../interfaces/error.interface";
import { handleDuplicateError } from "../utils/errorHelpers/handleDuplicateError";
import { handleCastError } from "../utils/errorHelpers/handleCastError";
import { handleZodError } from "../utils/errorHelpers/handleZodError";
import { handleValidationError } from "../utils/errorHelpers/handleValidationError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

  if(envVars.NODE_ENVIRONMENT === "development"){
    console.log(err);
  }

  console.log(({file:req.files}));
  if(req.file){
    await deleteImageFromCloudinary(req.file.path)
  }
  if(req.files && Array.isArray(req.files) && req.files.length){
    const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

    await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))

  }


  let errorSources : TErrorSources[] = [];
  let statusCode = err.statusCode || 500;
  let message = "Something went wrong!";

  
  //duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message
  }
  //Object ID error / cast error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message
  }
  //zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources as TErrorSources[]
  }
  //mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[]
    message = simplifiedError.message
  }
  //other global errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }


  res.status(statusCode).json({
    success: false,
    message,
    err: envVars.NODE_ENVIRONMENT === "development" ? err : null,
    stack: envVars.NODE_ENVIRONMENT === "development" ? err.stack : null,
  });
};
