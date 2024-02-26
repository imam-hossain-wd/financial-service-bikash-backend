import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
router.post('/signup',
AuthController.createUser);

export const AuthRoutes = router;