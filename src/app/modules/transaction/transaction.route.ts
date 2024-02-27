
import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post('/send-money', TransactionController.sendMoney);
router.post('/cash-out', TransactionController.userCashOut);
router.post('/cash-in', TransactionController.cashIn);



export const TransactionRoutes = router;