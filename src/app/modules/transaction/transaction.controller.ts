import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const sendMoney: RequestHandler = catchAsync(async (req, res) => {
    const sendMoneryData = req.body;

    const result = await TransactionService.sendMoney(sendMoneryData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Send Money successfully",
      data: result,
    });
  });

const userCashOut: RequestHandler = catchAsync(async (req, res) => {
    const cashoutData = req.body;

    const result = await TransactionService.cashOut(cashoutData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Cashout successfully",
      data: result,
    });
  });





  export const TransactionController = {
    sendMoney,
    userCashOut
  }