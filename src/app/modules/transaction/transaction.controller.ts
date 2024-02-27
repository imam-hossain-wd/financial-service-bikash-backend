import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";




const sendMoney: RequestHandler = catchAsync(async (req, res) => {
    const sendMoneryData = req.body;

    const updatedProduct = await TransactionService.sendMoney(sendMoneryData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Send Money successfully",
      data: updatedProduct,
    });
  });


  export const TransactionController = {
    sendMoney
  }