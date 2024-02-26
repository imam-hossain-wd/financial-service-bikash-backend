import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post('/signup',
validateRequest(AuthValidation.createUserZodSchema),
AuthController.createUser);

router.post('/login',
validateRequest(AuthValidation.loginUserZodSchema),
AuthController.logInUser);

export const AuthRoutes = router;