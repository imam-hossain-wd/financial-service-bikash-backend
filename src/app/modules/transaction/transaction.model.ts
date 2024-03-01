import mongoose, { Schema } from 'mongoose';
import { ICashin, ICashout, ISendMoney } from './transaction.interface';


//Send money schema
const SendMoneySchema: Schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      reciverId: { type: Schema.Types.ObjectId, ref: 'User' },
      senderNumber: { type: Number, required: true },
      reciverNumber: { type: Number, required: true },
      sendAmount: { type: Number, required: true },
      fee: { type: String, required: true },
      type: { type: String, required: true },
      status: { type: String, required: true },
    },
    { timestamps: true }
  );

//Cashin schema
const CashinSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    cashInNumber: { type: Number, required: true },
    cashInAmount: { type: Number, required: true },
    fee: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
  },

  { timestamps: true }
);



//cashout schema
const CashoutSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    cashoutNumber: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Cashin = mongoose.model<ICashin>('Cashin', CashinSchema);

export const SendMoney = mongoose.model<ISendMoney>(
  'SendMoney',
  SendMoneySchema
);
export const Cashout = mongoose.model<ICashout>('Cashout', CashoutSchema);
