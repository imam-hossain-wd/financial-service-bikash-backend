import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/signup',
AuthController.createUser);

router.post('/login',
AuthController.logInUser);

export const AuthRoutes = router;