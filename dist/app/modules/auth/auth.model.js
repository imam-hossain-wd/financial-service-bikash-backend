"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Session = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const auth_interface_1 = require("./auth.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    balance: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    authorized: { type: Boolean, default: false },
    deviceId: { type: String, required: true },
    account_type: { type: String, enum: [auth_interface_1.AccountType.AGENT, auth_interface_1.AccountType.USER, auth_interface_1.AccountType.ADMIN], default: auth_interface_1.AccountType.USER },
    nid: { type: Number, required: true },
    account_status: { type: String, enum: [auth_interface_1.AccountStatus.COMPLETE, auth_interface_1.AccountStatus.PENDING, auth_interface_1.AccountStatus.BLOCK] },
});
const SessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    sessionToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }
});
exports.Session = (0, mongoose_1.model)('Session', SessionSchema);
// Pre-save Hook: pin hashing before save
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('pin') || user.isNew) {
            user.pin = yield bcrypt_1.default.hash(user.pin, Number(config_1.default.bycrypt_salt_rounds));
        }
        next();
    });
});
//check user exit  Static Method
UserSchema.statics.isUserExist = function (number) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ number }, { _id: 1, account_type: 1, email: 1, pin: 1 });
    });
};
// pin match 
UserSchema.statics.isPinMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
