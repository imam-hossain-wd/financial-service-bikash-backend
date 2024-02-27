/* eslint-disable no-unused-vars */

import { Model } from "mongoose";

export enum AccountType {
  AGENT = 'agent',
  USER = 'user',
  ADMIN = 'admin'
}

export enum AccountStatus {
  COMPLETE = 'complete',
  PENDING = 'pending',
  BLOCK = 'block'
}

export type IUser = {
  _id?: string;
  name: string;
  pin: string; 
  number: string;
  email: string;
  income?:number;
  authorized?:boolean;
  account_type?: AccountType;
  account_status?:AccountStatus;
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

export type IFilters = {
  searchTerm:string;
  status:string
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
