import app from "../src/app";
import { Channel } from "amqplib";
import { connectMongoDB } from "./utils/connectDB";
// import { connectToDatabasesignup } from "./utils/connectToDB";
import fs from "fs";
import path from "path";
// import getConfig from "./utils/config";
import { createQueueConnection } from "./queues/connection";
import { logInit } from "./utils/logger";
const port = 4001;
export let authChannel: Channel;
export const privatekey = fs.readFileSync(
  path.join(__dirname, "../private_key.pem")
);

async function run() {
  try {
    // Activate Logger
    logInit({ env: process.env.NODE_ENV, logLevel: process.env.logLevel });

    // const congig = getConfig(process.env.NODE_ENV)
    authChannel = (await createQueueConnection()) as Channel;
    connectMongoDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
run();
export { app }; // Export the app for calling and running it in app.js
