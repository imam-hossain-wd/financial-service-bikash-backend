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
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const auth_interface_1 = require("./auth.interface");
const auth_model_1 = require("./auth.model");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const insertIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const isUserExist = yield auth_model_1.User.isUserExist(user === null || user === void 0 ? void 0 : user.number);
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.FOUND, "This number already has an account");
    }
    const isEmailExist = yield auth_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
    if (isEmailExist) {
        throw new ApiError_1.default(http_status_1.default.FOUND, "An account with this email already exists");
    }
    let createdUser = yield auth_model_1.User.create(user);
    if (createdUser.account_type === auth_interface_1.AccountType.USER) {
        // @ts-ignore
        createdUser.authorized = true;
        // @ts-ignore
        createdUser.balance = 40;
        // @ts-ignore
        createdUser.account_status = 'complete';
    }
    else if (createdUser.account_type === auth_interface_1.AccountType.AGENT) {
        // @ts-ignore
        createdUser.balance = 100000;
        // @ts-ignore
        createdUser.account_status = 'pending';
    }
    createdUser = yield createdUser.save();
    return createdUser;
});
const logInUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = loginData === null || loginData === void 0 ? void 0 : loginData.deviceId;
    // @ts-ignore
    const isUserExist = yield auth_model_1.User.isUserExist(loginData === null || loginData === void 0 ? void 0 : loginData.number);
    //@ts-ignore
    const isPinExist = yield auth_model_1.User.isPinMatched(loginData === null || loginData === void 0 ? void 0 : loginData.pin, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.pin);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user does not exist');
    }
    if (
    //@ts-ignore
    (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.pin) &&
        !isPinExist) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const { _id, account_type, email } = isUserExist;
    const existingSession = yield auth_model_1.Session.findOne({ userId: isUserExist._id });
    console.log(existingSession, 'existingSession');
    if (existingSession && existingSession.deviceId !== deviceId) {
        yield auth_model_1.Session.deleteOne({ _id: existingSession._id });
    }
    // Create a new session for the current login
    const sessionToken = jwtHelper_1.jwtHelpers.createToken({ userId: isUserExist._id, deviceId }, config_1.default.jwt.session_secret, config_1.default.jwt.session_expires_in);
    // Save the session in the database
    yield auth_model_1.Session.create({
        userId: isUserExist._id,
        deviceId,
        sessionToken,
    });
    const accessToken = jwtHelper_1.jwtHelpers.createToken({ _id, account_type, email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({ _id, account_type }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AuthService = {
    insertIntoDB,
    logInUser
};
