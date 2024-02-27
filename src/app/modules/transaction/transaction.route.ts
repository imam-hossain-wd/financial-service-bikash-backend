
import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post('/send-money', TransactionController.sendMoney);
router.post('/cash-out', TransactionController.userCashOut);



export const TransactionRoutes = router;