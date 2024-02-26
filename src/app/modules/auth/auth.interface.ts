/* eslint-disable no-unused-vars */

import { Model } from "mongoose";

export enum AccountType {
  AGENT = 'agent',
  USER = 'user',
  ADMIN = 'admin'
}

export enum AccountStatus {
  COMPLETE = 'complete',
  PENDING = 'pending'
}

export type IUser = {
  _id?: string;
  name: string;
  pin: string; 
  number: number;
  email: string;
  account_type?: AccountType;
  status?:AccountStatus;
  nid: number;
  balance?: string;
  deviceId :string
};

// session type
export type ISession ={
  userId: string;
  deviceId: string;
  sessionToken: string;
  createdAt: Date;
}

export type ILogInAuth = {
  number: number;
  deviceId:string;
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
