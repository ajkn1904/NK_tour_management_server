import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodeToken.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking Created Successfully!",
        data: booking
    })
});


const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getUserBookings();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved Successfully!",
        data: booking
    })
});


const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getBookingById();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved Successfully!",
        data: booking
    })
});


const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    //const booking = await BookingService.getAllBookings();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved Successfully!",
        data: {}
    })
});


const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const updated = await BookingService.updateBookingStatus();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking Status Updated Successfully!",
        data: updated
    })
});


export const BookingController = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus,
}

