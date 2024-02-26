import { RequestHandler } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IUser } from "./auth.interface";




const createUser: RequestHandler = catchAsync(async (req, res) => {
    const user = req.body;
    const result = await AuthService.insertIntoDB(user);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  });


  export const AuthController = {
    createUser
  }
  