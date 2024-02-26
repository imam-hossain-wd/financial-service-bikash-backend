import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    pin: z.string({
      required_error: 'pin is required',
    }),
    number: z.number({
      required_error: 'number is required',
    }),
    account_type: z.string({
      required_error: 'account_type is required',
    }),
    nid: z.number({
      required_error: 'nid is required',
    }),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    number: z.number({
      required_error: 'number is required',
    }),
    deviceId: z.string({
      required_error: 'deviceId is required',
    }),
    pin: z.string({
      required_error: 'pin is required',
    })
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const changePinZodSchema = z.object({
  body: z.object({
    number: z.number({
      required_error: 'number is required',
    }),
    oldPin: z.string({
      required_error: 'oldPin is required',
    }),
    newPin: z.string({
      required_error: 'newPin is required',
    }),
  }),
});


export const AuthValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
  changePinZodSchema
};