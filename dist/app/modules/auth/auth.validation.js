"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        email: zod_1.z.string({
            required_error: 'email is required',
        }),
        pin: zod_1.z.string({
            required_error: 'pin is required',
        }),
        number: zod_1.z.string({
            required_error: 'number is required',
        }),
        account_type: zod_1.z.string({
            required_error: 'account_type is required',
        }),
        nid: zod_1.z.number({
            required_error: 'nid is required',
        }),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        number: zod_1.z.string({
            required_error: 'number is required',
        }),
        deviceId: zod_1.z.string({
            required_error: 'deviceId is required',
        }),
        pin: zod_1.z.string({
            required_error: 'pin is required',
        })
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const changePinZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        number: zod_1.z.number({
            required_error: 'number is required',
        }),
        oldPin: zod_1.z.string({
            required_error: 'oldPin is required',
        }),
        newPin: zod_1.z.string({
            required_error: 'newPin is required',
        }),
    }),
});
exports.AuthValidation = {
    createUserZodSchema,
    loginUserZodSchema,
    refreshTokenZodSchema,
    changePinZodSchema
};
