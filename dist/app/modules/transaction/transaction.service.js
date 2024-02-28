"use strict";
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
// const sendMoney = async()=> {
const auth_model_1 = require("../auth/auth.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const transaction_model_1 = require("./transaction.model");
const auth_interface_1 = require("../auth/auth.interface");
const sendMoney = (sendMoneryData) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, amount } = sendMoneryData;
    try {
        const sender = yield auth_model_1.User.findById(senderId);
        const receiver = yield auth_model_1.User.findById(receiverId);
        const admin = yield auth_model_1.User.findOne({ account_type: 'admin' });
        // console.log(admin, 'admin');
        if (!sender) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        }
        if (!receiver) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        }
        // Validate minimum amount and sender's balance
        const minAmount = 50;
        if (amount < minAmount) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Minimum amount for transaction is ${minAmount}`);
        }
        //@ts-ignore
        if (sender.balance < amount) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Insufficient balance');
        }
        // Update sender's and receiver's balance
        //@ts-ignore
        sender.balance -= amount;
        //@ts-ignore
        receiver.balance += amount;
        // Apply fees
        const feeThreshold = 100;
        const transactionFee = amount > feeThreshold ? 5 : 0;
        // Update sender's balance after deducting fees
        //@ts-ignore
        sender.balance -= transactionFee;
        // Assume adminId is stored somewhere or fetched from a configuration
        //@ts-ignore
        admin.balance += transactionFee;
        //@ts-ignore
        admin.income += transactionFee;
        // Save the updated sender, receiver, and admin details
        //@ts-ignore
        yield Promise.all([sender.save(), receiver.save(), admin.save()]);
        const result = yield transaction_model_1.Transaction.create({
            sender: senderId,
            receiver: receiverId,
            amount,
            fee: transactionFee,
            type: 'sendMoney',
            status: 'completed',
        });
        return result;
    }
    catch (error) {
        //@ts-ignore
        console.error('Transaction failed:', error.message);
        throw error;
    }
});
const cashOut = (cashOutData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentId, amount } = cashOutData;
    try {
        // Find the user initiating the cash-out
        const user = yield auth_model_1.User.findById(userId);
        const admin = yield auth_model_1.User.findOne({ account_type: 'admin' });
        const agent = yield auth_model_1.User.findOne({
            _id: agentId,
            account_status: auth_interface_1.AccountStatus.COMPLETE,
        });
        if (!admin) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Admin not found');
        }
        if (!agent) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Agent not found');
        }
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Validate the cash-out amount
        const minAmount = 0;
        if (amount <= minAmount) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Invalid cash-out amount`);
        }
        // Calculate the cash-out fee (1.5%)
        const cashOutFee = amount * 0.015;
        // Deduct the cash-out amount and fee from the user's balance
        // Update balances
        //@ts-ignore
        user.balance -= amount + cashOutFee;
        //@ts-ignore
        admin.balance += cashOutFee * 0.5;
        //@ts-ignore
        admin.income += cashOutFee * 0.5;
        //@ts-ignore
        agent.balance += cashOutFee * 0.01;
        //@ts-ignore
        agent.income += cashOutFee * 0.01;
        // Save the updated user, admin, and agent details
        yield Promise.all([user.save(), admin.save(), agent.save()]);
        // Create transaction record
        const transaction = yield transaction_model_1.Transaction.create({
            userId,
            amount: -amount,
            fee: cashOutFee,
            type: 'cashOut',
            status: 'completed',
        });
        return transaction;
    }
    catch (error) {
        //@ts-ignore
        console.error('Cash-out failed:', error.message);
        throw error;
    }
});
const cashIn = (cashInData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentId, amount, agentPIN } = cashInData;
    try {
        const user = yield auth_model_1.User.findById(userId);
        const agent = yield auth_model_1.User.findOne({
            _id: agentId,
            account_type: 'agent',
            authorized: true,
        });
        //@ts-ignore
        const isPinExist = yield auth_model_1.User.isPinMatched(agentPIN, agent === null || agent === void 0 ? void 0 : agent.pin);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        if (!agent) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Agent not found or unauthorized');
        }
        // Verify agent's PIN for security purposes
        if (!isPinExist) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid agent PIN');
        }
        //@ts-ignore
        if ((agent === null || agent === void 0 ? void 0 : agent.balance) < amount) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Insufficient balance');
        }
        //@ts-ignore
        user.balance = user.balance + amount;
        //@ts-ignore
        agent.balance = agent.balance - amount;
        yield user.save();
        yield agent.save();
        const transaction = yield transaction_model_1.Transaction.create({
            userId,
            agentId,
            amount,
            fee: 0,
            type: 'cashIn',
            status: 'completed',
        });
        return transaction;
    }
    catch (error) {
        //@ts-ignore
        console.error('Cash-in failed:', error.message);
        throw error;
    }
});
exports.TransactionService = {
    sendMoney,
    cashOut,
    cashIn
};
