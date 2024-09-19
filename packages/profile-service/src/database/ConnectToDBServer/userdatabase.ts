import mongoose from "mongoose";
import grid from 'gridfs-stream';
import { logger } from "../../utils/logger";

class ConnectToMongoDB {
  private static instance: ConnectToMongoDB;
  private monogourl: string = "";
  private gfs: grid.Grid | null =null
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
      const conn = mongoose.connection;
      conn.once('open', () => {
        this.gfs = grid(conn.db, mongoose.mongo);
        this.gfs.collection('uploads');
        logger.info('GridFS initialized');
      });
      logger.info("Successfully connected to MongoDB");
    } catch (err) {
      logger.error("Initial MongoDB connection error", { err });
    }
  }
}

export { ConnectToMongoDB };
