import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {  ILogInUser, IUser } from './auth.interface';
import { User } from './auth.model';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';



const insertIntoDB = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);
  return createdUser;
};


const logInUser = async (loginData:ILogInUser) => {

  console.log(loginData, 'loginData');
  const isUserExist = await User.isUserExist(loginData?.number);
  const isPinExist = await User.isPinMatched(loginData?.pin, isUserExist?.pin)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user does not exist');
  }

  if (
    isUserExist?.pin &&
    !isPinExist
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id, account_type, email } = isUserExist;

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
