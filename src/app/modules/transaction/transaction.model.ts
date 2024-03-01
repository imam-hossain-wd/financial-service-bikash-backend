import mongoose, { Schema } from "mongoose";
import { ICashout, ITransaction } from "./transaction.interface";


const TransactionSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
});


const cashoutSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    cashoutNumber: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
});



export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export const Cashout = mongoose.model<ICashout>('Cashout', cashoutSchema);