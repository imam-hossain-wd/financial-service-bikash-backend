"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const router = (0, express_1.Router)();
router.post('/send-money', transaction_controller_1.TransactionController.sendMoney);
router.post('/cash-out', transaction_controller_1.TransactionController.userCashOut);
router.post('/cash-in', transaction_controller_1.TransactionController.cashIn);
exports.TransactionRoutes = router;