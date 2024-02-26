import mongoose, { Schema } from 'mongoose';
import { IUser } from './auth.interface';


const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  pin: { type: Number, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true },
  account_type: { type: String, enum: ['agent', 'user'], default: 'user' },
  nid: { type: Number, required: true },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;