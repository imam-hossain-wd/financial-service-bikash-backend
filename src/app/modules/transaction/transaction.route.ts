
import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TransactionValidation } from "./transation.validation";

const router = Router();

router.post('/send-money', TransactionController.sendMoney);

router.post('/cash-out',validateRequest(TransactionValidation.cashoutZodSchema), TransactionController.userCashOut);

router.post('/cash-in', TransactionController.cashIn);



export const TransactionRoutes = router;