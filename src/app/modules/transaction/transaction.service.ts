/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { User } from '../auth/auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ITransaction, ITransactionProps } from './transaction.interface';
import { Transaction } from './transaction.model';
import mongoose from 'mongoose';

const sendMoney = async (
  sendMoneryData: ITransactionProps
): Promise<ITransaction | null> => {
  const { id: senderId, number, amount: sendAmount, pin } = sendMoneryData;
  const amount = Number(sendAmount);

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ number: number });
    const admin = await User.findOne({ account_type: 'admin' });

    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sender not found');
    }
    if (!receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'This number has no Account');
    }
    //@ts-ignore
    const isPinExist = await User.isPinMatched(pin, sender?.pin);

    if (!isPinExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Wrong Pin');
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
    //@ts-ignore
    admin.balance += transactionFee;
    //@ts-ignore
    admin.income += transactionFee;

    // Save the updated sender, receiver, and admin details
    //@ts-ignore
    await Promise.all([sender.save(), receiver.save(), admin.save()]);
    const result = await Transaction.create({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(receiver._id),
      amount,
      fee: transactionFee,
      type: 'sendMoney',
      status: 'success',
    });

    return result;
  } catch (error) {
    //@ts-ignore
    console.error('Transaction failed:', error.message);
    throw error;
  }
};

const cashOut = async (
  cashOutData: ITransactionProps
): Promise<ITransaction | null> => {
  const { id: senderId, number, amount: sendAmount, pin } = cashOutData;

  const amount = Number(sendAmount);

  try {
    // Find the user initiating the cash-out
    const user = await User.findById(senderId);
    const admin = await User.findOne({ account_type: 'admin' });
    const agent = await User.findOne({
      number: number,
      authorized: true,
    });
    //@ts-ignore
    const isPinExist = await User.isPinMatched(pin, user?.pin);

    if (!isPinExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Wrong Pin');
    }

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }
    if (!agent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Agent not found');
    }

    // Validate the cash-out amount
    const minAmount = 0;
    if (amount <= minAmount) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, `Invalid cash-out amount`);
    }

    // Calculate the cash-out fee (1.5%)
    const cashOutFee = amount * 0.015;

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
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(agent._id),
      amount: -amount,
      fee: cashOutFee,
      type: 'cashOut',
      status: 'success',
    });

    return transaction;
  } catch (error) {
    //@ts-ignore
    console.error('Cash-out failed:', error.message);
    throw error;
  }
};

const cashIn = async (
  cashInData: ITransactionProps
): Promise<ITransaction | null> => {
  const { number: userNumber, id: agentId, amount, pin: agentPin } = cashInData;

  console.log(userNumber, agentId, amount,agentPin,"userNumber, agentId, amount,agentPin" );
  try {
    const user = await User.findOne({ number: userNumber });
    const agent = await User.findOne({
      _id: agentId,
      account_type: 'agent',
      authorized: true,
    });

    //@ts-ignore
    const isPinExist = await User.isPinMatched(agentPin, agent?.pin);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!agent) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Agent not found or unauthorized'
      );
    }
    // Verify agent's PIN for security purposes
    if (!isPinExist) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid agent PIN');
    }

    if (agent) {
      //@ts-ignore
      if (agent?.balance < amount) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient balance');
      }

      //@ts-ignore
      user.balance = user.balance + amount;
      //@ts-ignore
      agent.balance = agent.balance - amount;

      await user.save();
      await agent.save();

      // Create transaction record
      const transaction = await Transaction.create({
        sender: new mongoose.Types.ObjectId(agent._id),
        receiver: new mongoose.Types.ObjectId(user._id),
        amount: amount,
        fee: 0,
        type: 'cashin',
        status: 'success',
      });
      return transaction;
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Only Agent Can Cashin');
    }
  } catch (error) {
    //@ts-ignore
    console.error('Cash-in failed:', error.message);
    throw error;
  }
};

export const TransactionService = {
  sendMoney,
  cashOut,
  cashIn,
};
