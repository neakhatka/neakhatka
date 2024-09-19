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
exports.publicKey = void 0;
const logger_1 = require("./utils/logger");
const app_1 = __importDefault(require("./app"));
const createCofig_1 = __importDefault(require("./utils/createCofig"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// READ FILE JWT PUBLIC KEY FIRST
exports.publicKey = fs_1.default.readFileSync(path_1.default.join(__dirname, "../public_key.pem"), "utf-8");
console.log("############ Server is running on port " + 3000);
// RUN THE SERVER
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = (0, createCofig_1.default)();
            // Activate Logger
            (0, logger_1.logInit)({ env: process.env.NODE_ENV, logLevel: config.logLevel });
            // Start Server
            logger_1.logger.info(`Gateway server has started with process id ${process.pid}`);
            const server = app_1.default.listen(config.port, () => {
                logger_1.logger.info(`Gateway server is listening on port: ${config.port}`);
            });
            const exitHandler = () => __awaiter(this, void 0, void 0, function* () {
                if (server) {
                    server.close(() => __awaiter(this, void 0, void 0, function* () {
                        logger_1.logger.info("server closed!");
                        logger_1.logger.info("mongodb disconnected!");
                        // Gracefully Terminate
                        process.exit(1); // terminate the process due to error
                    }));
                }
                else {
                    process.exit(1);
                }
            });
            const unexpectedErrorHandler = (error) => {
                logger_1.logger.error("unhandled error", { error });
                exitHandler();
            };
            // Error that might occur duing execution that not caught by any try/catch blocks
            process.on("uncaughtException", unexpectedErrorHandler); // Syncronous
            process.on("unhandledRejection", unexpectedErrorHandler); // Asyncronous
            // A termination signal typically sent from OS or other software (DOCKER, KUBERNETES)
            process.on("SIGTERM", () => {
                logger_1.logger.info("SIGTERM received");
                if (server) {
                    // Stop the server from accepting new request but keeps existing connection open until all ongoin request are done
                    server.close();
                }
            });
        }
        catch (error) {
            logger_1.logger.error("Gateway Service Failed", { error });
            process.exit(1);
        }
    });
}
run();
//# sourceMappingURL=server.js.map