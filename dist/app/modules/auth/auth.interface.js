"use strict";
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["AGENT"] = "agent";
    AccountType["USER"] = "user";
    AccountType["ADMIN"] = "admin";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["COMPLETE"] = "complete";
    AccountStatus["PENDING"] = "pending";
    AccountStatus["BLOCK"] = "block";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
