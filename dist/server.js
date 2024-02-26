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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const { port, database_url } = index_1.default;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default
            .connect(database_url)
            .then(() => console.log('database connected successfully'));
        console.log('Database connected successfully');
        // Start the Express server
        const server = app_1.default.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        // Handle server shutdown
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed');
                    process.exit(1);
                });
            }
        };
        // Handle unexpected errors
        const unexpectedErrorHandler = (error) => {
            console.error(error);
            exitHandler();
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        // Handle SIGTERM signal
        process.on('SIGTERM', () => {
            console.log('SIGTERM received');
            exitHandler();
        });
    }
    catch (error) {
        console.error(error);
    }
});
run().catch(error => console.error(error));
