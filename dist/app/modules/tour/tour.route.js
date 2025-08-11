"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = require("express");
const tour_controller_1 = require("./tour.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validationRequest_1 = require("../../middlewares/validationRequest");
const user_interface_1 = require("../user/user.interface");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
//------------ TOUR TYPE ROUTES --------------
router.get("/tour-types", tour_controller_1.TourController.getAllTourTypes);
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validationRequest_1.validationRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.TourController.createTourType);
router.get("/tour-types/:id", tour_controller_1.TourController.getSingleTourType);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validationRequest_1.validationRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.TourController.updateTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.deleteTourType);
/* --------------------- TOUR ROUTES ---------------------- */
router.get("/", tour_controller_1.TourController.getAllTours);
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validationRequest_1.validationRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.TourController.createTour);
router.get("/:slug", tour_controller_1.TourController.getSingleTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validationRequest_1.validationRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.TourController.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.deleteTour);
exports.TourRoutes = router;
