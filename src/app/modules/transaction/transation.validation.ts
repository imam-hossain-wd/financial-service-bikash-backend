import { z } from 'zod';
const cashoutZodSchema = z.object({
    body: z.object({
        userId: z.string({
        required_error: 'userId is required',
      }),
      agentNumber: z.string({
        required_error: 'agentNumber is required',
      }),
      amount: z.string({
        required_error: 'amount is required',
      }),
      userPin: z.string({
        required_error: 'userPin is required',
      })
    }),
  });


  export const TransactionValidation ={
    cashoutZodSchema
  }