/* eslint-disable @typescript-eslint/ban-ts-comment */


// const sendMoney = async()=> {


import { User } from "../auth/auth.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ISendMonery, ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

    
// }
// const cashIn = async()=> {
    
// }
// const cashOut = async()=> {
    
// }

// const balanceInquiry = async()=> {
    
// }

const sendMoney = async (sendMoneryData:ISendMonery): Promise<ITransaction | null> => {
    const {senderId,receiverId,amount}= sendMoneryData;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        const admin = await User.findOne({account_type:"admin"})

        // console.log(admin, 'admin');

        if (!sender) {
            throw new ApiError(httpStatus.NOT_FOUND,'Sender not found');
        }
        if (!receiver) {
            throw new ApiError(httpStatus.NOT_FOUND,'Receiver not found');
        }

        // Validate minimum amount and sender's balance
        const minAmount = 50;

        if (amount < minAmount) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE,`Minimum amount for transaction is ${minAmount}`);
        }

        //@ts-ignore
        if (sender.balance < amount) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE,'Insufficient balance');
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

        // Save the updated sender, receiver, and admin details
        //@ts-ignore
        await Promise.all([sender.save(), receiver.save(), admin.save()]);
        
       const result =  await Transaction.create({
            sender: senderId,
            receiver: receiverId,
            amount,
            fee: transactionFee,
            type: 'sendMoney',
            status: 'completed'
        });

        return result;


    } catch (error) {
        //@ts-ignore
        console.error('Transaction failed:', error.message);
        throw error;
    }
};







export const TransactionService= {
    sendMoney,
    // cashOut,
    // balanceInquiry,
    // cashIn
}