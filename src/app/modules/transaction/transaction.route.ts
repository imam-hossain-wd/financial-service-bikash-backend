
import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TransactionValidation } from "./transation.validation";

const router = Router();

router.post('/send-money',validateRequest(TransactionValidation.SendMoneyZodSchema),TransactionController.sendMoney);

router.post('/cash-out',validateRequest(TransactionValidation.CashoutZodSchema), TransactionController.userCashOut);

router.post('/cash-in',validateRequest(TransactionValidation.CashinZodSchema), TransactionController.cashIn);



export const TransactionRoutes = router;