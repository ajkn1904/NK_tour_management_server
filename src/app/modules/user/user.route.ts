import { Router } from "express";
import { userController } from "./user.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema, updateZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", validationRequest(createZodSchema), userController.createUser);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN) ,userController.getAllUsers);

router.get("/me", checkAuth(...Object.values(Role)), userController.getMe)


router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getSingleUser)


router.patch("/:id", validationRequest(updateZodSchema), checkAuth(...Object.values(Role)) ,userController.updateUser);


export const UserRoutes = router;