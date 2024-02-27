
import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post('/send-money', TransactionController.sendMoney);



export const TransactionRoutes = router;