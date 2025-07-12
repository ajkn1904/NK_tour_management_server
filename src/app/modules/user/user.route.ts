import { Router } from "express";
import { userController } from "./user.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema } from "./user.validation";

const router = Router();

router.post("/register", validationRequest(createZodSchema), userController.createUser);

router.get("/", userController.getAllUsers);


export const UserRoutes = router;