import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../auth/auth.interface";
import httpStatus from "http-status";


const getAllUsers:RequestHandler = catchAsync(async (req, res) => {

    const result = await UserService.getAllUsers();
    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get all users successfully',
      data: result
    });
  });


  export const UserController= {
    getAllUsers
  }