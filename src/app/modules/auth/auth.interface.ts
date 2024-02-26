/* eslint-disable no-unused-vars */

export enum AccountType {
  AGENT = 'agent',
  USER = 'user',
}

export type IUser = {
  _id?: string;
  name: string;
  pin: number;
  number: number;
  email: string;
  account_type?: AccountType;
  nid: number;
};
