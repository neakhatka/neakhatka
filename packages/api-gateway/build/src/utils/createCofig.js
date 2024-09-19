"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// npm install dotenv
const api_error_1 = __importDefault(require("../error/api-error"));
const path_1 = __importDefault(require("path"));
function createConfig(configPath) {
    dotenv_1.default.config({ path: configPath });
    // "RABBITMQ_ENDPOINT",
    // Validate essential configuration
    const requiredConfig = [
        "NODE_ENV",
        "PORT",
        "LOG_LEVEL",
        "CLIENT_URL",
        "COOKIE_SECRET_KEY_ONE",
        "COOKIE_SECRET_KEY_TWO",
        "AUTH_SERVICE_URL",
        "USER_SERVICE_URL",
        "COMPANY_SERVICE_URL",
    ];
    const missingConfig = requiredConfig.filter((key) => !process.env[key]);
    if (missingConfig.length > 0) {
        throw new api_error_1.default(`Missing required environment variables: ${missingConfig.join(", ")}`);
    }
    // Return configuration object
    return {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        logLevel: process.env.LOG_LEVEL,
        // rabbitMQ: process.env.RABBITMQ_ENDPOINT,
        clientUrl: process.env.CLIENT_URL,
        cookieSecretKeyOne: process.env.COOKIE_SECRET_KEY_ONE,
        cookieSecretKeyTwo: process.env.COOKIE_SECRET_KEY_TWO,
        authServiceUrl: process.env.AUTH_SERVICE_URL,
        userServiceUrl: process.env.USER_SERVICE_URL,
        companyserviceurl: process.env.COMPANY_SERVICE_URL,
    };
}
const getConfig = (currentEnv = "development") => {
    const configPath = currentEnv === "development"
        ? path_1.default.join(__dirname, `../../configs/.env`)
        : path_1.default.join(__dirname, `../../configs/.env.${currentEnv}`);
    return createConfig(configPath);
};
exports.default = getConfig;
//# sourceMappingURL=createCofig.js.map