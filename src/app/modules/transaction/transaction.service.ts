/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// const sendMoney = async()=> {

import { User } from '../auth/auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ICashIn, ICashOut, ISendMonery, ITransaction } from './transaction.interface';
import { Transaction } from './transaction.model';
import { AccountStatus } from '../auth/auth.interface';



const sendMoney = async (
  sendMoneryData: ISendMonery
): Promise<ITransaction | null> => {
  const { senderId, receiverId, amount } = sendMoneryData;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const admin = await User.findOne({ account_type: 'admin' });

    // console.log(admin, 'admin');

    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sender not found');
    }
    if (!receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Receiver not found');
    }

    // Validate minimum amount and sender's balance
    const minAmount = 50;

    if (amount < minAmount) {
      throw new ApiError(
        httpStatus.NOT_ACCEPTABLE,
        `Minimum amount for transaction is ${minAmount}`
      );
    }

    //@ts-ignore
    if (sender.balance < amount) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient balance');
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
    await Promise.all([sender.save(), receiver.save(), admin.save()]);

    const result = await Transaction.create({
      sender: senderId,
      receiver: receiverId,
      amount,
      fee: transactionFee,
      type: 'sendMoney',
      status: 'completed',
    });

    return result;
  } catch (error) {
    //@ts-ignore
    console.error('Transaction failed:', error.message);
    throw error;
  }
};

const cashOut = async (cashOutData: ICashOut): Promise<ITransaction | null> => {
  const { userId, agentId, amount } = cashOutData;

  try {
    // Find the user initiating the cash-out
    const user = await User.findById(userId);
    const admin = await User.findOne({ account_type: 'admin' });
    const agent = await User.findOne({
      _id: agentId,
      account_status: AccountStatus.COMPLETE,
    });

    if (!admin) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Admin not found');
    }
    if (!agent) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Agent not found');
    }

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Validate the cash-out amount
    const minAmount = 0;
    if (amount <= minAmount) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, `Invalid cash-out amount`);
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
    await Promise.all([user.save(), admin.save(), agent.save()]);

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      amount: -amount,
      fee: cashOutFee,
      type: 'cashOut',
      status: 'completed',
    });

    return transaction;
  } catch (error) {
    //@ts-ignore
    console.error('Cash-out failed:', error.message);
    throw error;
  }
};



const cashIn = async (cashInData: ICashIn): Promise<ITransaction | null> => {

    const { userId, agentId, amount, agentPIN } = cashInData;
    try {

      const user = await User.findById(userId);
      const agent = await User.findOne({
        _id: agentId,
        account_type: 'agent',
        authorized: true,
      });

      //@ts-ignore
      const isPinExist = await User.isPinMatched(agentPIN, agent?.pin)

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
  
      if (!agent) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Agent not found or unauthorized');
      }  
      // Verify agent's PIN for security purposes
      if (!isPinExist) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid agent PIN');
      }

        //@ts-ignore
      if (agent?.balance < amount) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient balance');
      }
  

      //@ts-ignore
       user.balance = user.balance + amount;
       //@ts-ignore
       agent.balance= agent.balance - amount ;

      await user.save();
      await agent.save();
      
      const transaction = await Transaction.create({
        userId,
        agentId,
        amount,
        fee: 0,
        type: 'cashIn',
        status: 'completed',
      });
  
  
      return transaction;
    } catch (error) {
        //@ts-ignore
      console.error('Cash-in failed:', error.message);
      throw error;
    }
  };



export const TransactionService = {
  sendMoney,
  cashOut,
  cashIn
};
