import { z } from 'zod';

const SendMoneyZodSchema = z.object({
    body: z.object({
      userId: z.string({
        required_error: 'userId is required',
      }),
      reciverNumber: z.string({
        required_error: 'reciverNumber is required',
      }),
      amount: z.string({
        required_error: 'amount is required',
      }),
      userPin: z.string({
        required_error: 'userPin is required',
      })
    }),
  });

const CashinZodSchema = z.object({
    body: z.object({
      agentId: z.string({
        required_error: 'agentId is required',
      }),
      userNumber: z.string({
        required_error: 'userNumber is required',
      }),
      amount: z.string({
        required_error: 'amount is required',
      }),
      agentPin: z.string({
        required_error: 'agentPin is required',
      })
    }),
  });
  
const CashoutZodSchema = z.object({
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
    CashoutZodSchema,
    CashinZodSchema,
    SendMoneyZodSchema
  }