import mongoose, { Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";


const TransactionSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);