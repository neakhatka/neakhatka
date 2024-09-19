import { logger, logInit } from "./util/logger";
import { Channel } from "amqplib";
import { ConnectToMongoDB } from "./database/connectDB/conneed.DB";
import getConfig from "./util/config";
import app from "./app";

export let userProfile: Channel;

async function run() {
  try {
    const config = getConfig(process.env.NODE_ENV);

    // Activate Logger!
    logInit({ env: process.env.NODE_ENV, logLevel: config.logLevel });

    // Activate Database
    const mongodb = ConnectToMongoDB.getInstance();
    await mongodb.connectMongoDB({ url: config.monogourl! });
    // Start Server
    app.listen(config.port, () => {
      logger.info(`Server is listening on port: ${config.port}`);
    });
  } catch (error) {
    logger.info("Error", error);
  }
}
run();
