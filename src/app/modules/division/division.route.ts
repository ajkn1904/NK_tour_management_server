import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validationRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validationRequest(createDivisionSchema), DivisionController.createDivision);

router.get("/", DivisionController.getAllDivision);

router.get("/:slug", DivisionController.getSingleDivision);

router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validationRequest(updateDivisionSchema), DivisionController.updatedDivision);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);

export const DivisionRoutes = router