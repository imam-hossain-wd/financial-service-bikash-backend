/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../auth/auth.interface";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constrants";
import pick from "../../../shared/pick";


const getAllUsers:RequestHandler = catchAsync(async (req, res) => {

  const filters = pick(req.query,userFilterableFields);

  // const filters = req.query
//@ts-ignore
    const result = await UserService.getAllUsers(filters);
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