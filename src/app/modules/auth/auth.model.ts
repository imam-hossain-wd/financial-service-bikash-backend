/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { AccountStatus, AccountType, ISession, IUser, UserModel } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
  balance: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  authorized: { type: Boolean, default:false },
  deviceId: { type: String, required: true },
  account_type: { type: String, enum: [AccountType.AGENT, AccountType.USER, AccountType.ADMIN], default: AccountType.USER },
  nid: { type: Number, required: true , unique:true},
  account_status: { type: String, enum: [AccountStatus.COMPLETE, AccountStatus.PENDING,AccountStatus.BLOCK] },
});

const SessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  sessionToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});

export const Session = model<ISession>('Session', SessionSchema);


// Pre-save Hook: pin hashing before save

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('pin') || user.isNew) {
    user.pin = await bcrypt.hash(
      user.pin,
      Number(config.bycrypt_salt_rounds)
    );
  }
  next();
});


//check user exit  Static Method
UserSchema.statics.isUserExist = async function (
  number: number
): Promise<IUser | null> {
  return await User.findOne(
    { number },
    { _id: 1, account_type: 1, email: 1, pin:1 }
  );
};


// pin match 
UserSchema.statics.isPinMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};


export const User = model<IUser, UserModel>('User', UserSchema);
