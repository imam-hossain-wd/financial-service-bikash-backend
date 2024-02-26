/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {  AccountType, ILogInAuth, IUser } from './auth.interface';
import { Session, User } from './auth.model';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';



const insertIntoDB = async (user: IUser): Promise<IUser | null> => {
 // @ts-ignore
  const isUserExist = await User.isUserExist(user?.number);
  if(isUserExist){
    throw new ApiError(httpStatus.FOUND, "This number already has an account")
  }
  const isEmailExist = await User.findOne({ email: user?.email });
  if (isEmailExist) {
    throw new ApiError(httpStatus.FOUND, "An account with this email already exists");
  }

  let createdUser = await User.create(user);

  if (createdUser.account_type === AccountType.USER) {
    // @ts-ignore
    createdUser.balance  = 40;
    // @ts-ignore
    createdUser.account_status = 'complete';
  } else if (createdUser.account_type === AccountType.AGENT) {
    // @ts-ignore
    createdUser.balance = 100000;
    // @ts-ignore
    createdUser.account_status = 'pending';
  }

  createdUser = await createdUser.save();

  return createdUser;
};


const logInUser = async (loginData:ILogInAuth) => {
  const deviceId = loginData?.deviceId;
 // @ts-ignore
  const isUserExist = await User.isUserExist(loginData?.number);
  //@ts-ignore
  const isPinExist = await User.isPinMatched(loginData?.pin, isUserExist?.pin)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user does not exist');
  }
 
  if (
    //@ts-ignore
    isUserExist?.pin &&
    !isPinExist
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id, account_type, email } = isUserExist;


  const existingSession = await Session.findOne({ userId: isUserExist._id });
  console.log(existingSession, 'existingSession');

  if (existingSession && existingSession.deviceId !== deviceId) {
 
    await Session.deleteOne({ _id: existingSession._id });
  }


  // Create a new session for the current login

  const sessionToken = jwtHelpers.createToken(
    { userId: isUserExist._id, deviceId },
    config.jwt.session_secret as Secret,
    config.jwt.session_expires_in as string
  );
  
  // Save the session in the database
  await Session.create({
    userId: isUserExist._id,
    deviceId,
    sessionToken,
  });


  const accessToken = jwtHelpers.createToken(
    { _id, account_type , email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, account_type },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };

}

export const AuthService = {
  insertIntoDB,
  logInUser
};
