import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validationRequest";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = Router();

router.post("/", checkAuth(...Object.values(Role)), validationRequest(createBookingZodSchema), BookingController.createBooking);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), BookingController.getAllBookings);

router.get("/my-bookings", checkAuth(...Object.values(Role)), BookingController.getUserBookings);

router.get("/:bookingId", checkAuth(...Object.values(Role)), BookingController.getSingleBooking);

router.patch("/:bookingId/status", checkAuth(...Object.values(Role)), validationRequest(updateBookingStatusZodSchema), BookingController.updateBookingStatus);


export const BookingRouter = router;