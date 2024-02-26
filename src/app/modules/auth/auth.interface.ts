/* eslint-disable no-unused-vars */

import { Model } from "mongoose";

export enum AccountType {
  AGENT = 'agent',
  USER = 'user',
}

export type IUser = {
  _id?: string;
  name: string;
  pin: string; 
  number: number;
  email: string;
  account_type?: AccountType;
  nid: number;
};

export type ILogInUser = {
  number: string;
  email:string;
  pin:string
}

export type UserModel = {
  isUserExist(
    number: string
  ): Promise<Pick<IUser, 'number' | '_id' | 'email' | 'account_type'>>;

  isPinMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
