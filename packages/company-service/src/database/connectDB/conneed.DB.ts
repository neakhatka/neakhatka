import mongoose from "mongoose";
import { logger } from "../../util/logger";

class ConnectToMongoDB {
  private static instance: ConnectToMongoDB;
  private monogourl: string = "";
  // private db= mongoose.connection;

  public static getInstance(): ConnectToMongoDB {
    if (!ConnectToMongoDB.instance) {
      ConnectToMongoDB.instance = new ConnectToMongoDB();
    }

    return ConnectToMongoDB.instance;
  }

  public async connectMongoDB({ url }: { url: string }): Promise<void> {
    this.monogourl = url;
    try {
      await mongoose.connect(this.monogourl);
      logger.info("Successfully connected to MongoDB");
    } catch (err) {
      logger.error(`Initial MongoDB connection error ${err}`);
    }
  }
}

export { ConnectToMongoDB };
