import dotenv from "dotenv";
import path from "path";
import APIError from "../database/error/api-error";

function Createconfig(configPath: string) {
  dotenv.config({ path: configPath });

  const Requirementcofig = [
    "MONGODB_URL",
    "LOG_LEVEL",
    "PORT",
    "API_GATEWAY",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
  ];
  const missingConfig = Requirementcofig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }
  return {
    monogourl: process.env.MONGODB_URL,
    logLevel: process.env.LOG_LEVEL,
    port: process.env.PORT,
    apiGateway: process.env.API_GATEWAY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
  };
}
const getConfig = (currentEnv: string = "development") => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return Createconfig(configPath);
};

export default getConfig;
