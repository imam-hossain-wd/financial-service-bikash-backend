import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get('/',UserController.getAllUsers);
router.get('/get-balance',UserController.getBalance);
router.get('/:id',UserController.getSingleUser);
router.patch('/:id',UserController.updateUser);
router.delete('/:id',UserController.deleteUser);

export const UserRoutes = router;