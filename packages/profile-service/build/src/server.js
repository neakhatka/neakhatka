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
exports.userProfile = void 0;
const logger_1 = require("./utils/logger");
const userdatabase_1 = require("./database/ConnectToDBServer/userdatabase");
const config_1 = __importDefault(require("./utils/config"));
const app_1 = __importDefault(require("./app"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = (0, config_1.default)(process.env.NODE_ENV);
            // Activate Logger
            (0, logger_1.logInit)({ env: process.env.NODE_ENV, logLevel: config.logLevel });
            // Activate Database!
            const mongodb = userdatabase_1.ConnectToMongoDB.getInstance();
            yield mongodb.connectMongoDB({ url: config.monogourl });
            // Start Server
            app_1.default.listen(config.port, () => {
                logger_1.logger.info(`Server is listening on port: ${config.port}`);
            });
        }
        catch (error) {
            logger_1.logger.info("Error", error);
        }
    });
}
run();
//# sourceMappingURL=server.js.map