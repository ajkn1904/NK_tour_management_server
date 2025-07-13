import { Router } from "express";
import { userController } from "./user.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", validationRequest(createZodSchema), userController.createUser);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN) ,userController.getAllUsers);

router.patch("/:id", checkAuth(...Object.values(Role)) ,userController.updateUser);


export const UserRoutes = router;