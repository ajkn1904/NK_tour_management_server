/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../app/config/env";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
const statusCode = err.statusCode || 500;
const message = `Something went wrong! ${err.message}`;

res.status(statusCode).json({
    success: false,
    message,
    err,
    stack : envVars.NODE_ENVIRONMENT === "development" ? err.stack : null,
});

};