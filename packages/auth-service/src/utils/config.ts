import dotenv from "dotenv";
import path from "path";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  const requiredConfig = [
    "NODE_ENV",
    "PORT",
    // "MONGODB_URL",
    "LOG_LEVEL",
    "RABBITMQ_ENDPOINT",
    "JWT_EXPIRES_IN",
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(`Missing configuration(s): ${missingConfig.join(", ")}`);
  }
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    // mongoUrl: process.env.MONGODB_URL,
    logLevel: process.env.LOG_LEVEL,
    rabbitMQ: process.env.RABBITMQ_ENDPOINT,
    apiGateway: process.env.API_GATEWAY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  };
}

const getConfig = (currentEnv: string = "development") => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
