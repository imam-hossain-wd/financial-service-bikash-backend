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


  const updateUser: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await UserService.updateUser(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Update User successfully",
      data: updatedProduct,
    });
  });
  
  const deleteUser: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
   const result =  await UserService.deleteUser(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Delete User Successful",
      data: result
    });
  });

  const getBalance: RequestHandler = catchAsync(async (req, res) => {
    const token = req.headers.authorization as string;

    const result = await UserService.getBalance(token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:"Balance Retrived successfully",
      data: result,
    });
  });


  export const UserController= {
    getAllUsers,
    updateUser,
    deleteUser,
    getBalance
  }