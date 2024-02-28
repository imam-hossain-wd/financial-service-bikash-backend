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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const auth_model_1 = require("../auth/auth.model");
const user_constrants_1 = require("./user.constrants");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const getAllUsers = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const status = filtersData.status;
    const andConditions = [];
    if (searchTerm) {
        const orConditions = user_constrants_1.userSearchAbleFields.map(field => {
            return {
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            };
        });
        andConditions.push({ $or: orConditions });
    }
    if (status) {
        andConditions.push({ account_status: status });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield auth_model_1.User.find(whereConditions);
    return result;
});
const updateUser = (UserId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield auth_model_1.User.findByIdAndUpdate(UserId, updatedData, { new: true });
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findByIdAndDelete(id);
    return result;
});
const getBalance = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId } = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const user = yield auth_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Forbidden');
    }
    const result = {
        balance: user.balance,
        income: user === null || user === void 0 ? void 0 : user.income
    };
    return result;
});
exports.UserService = {
    getAllUsers,
    updateUser,
    deleteUser,
    getBalance
};
