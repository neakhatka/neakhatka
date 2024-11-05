import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { Request } from "express";
import getConfig from "../util/config";

const config = getConfig();

// Ensure credentials are defined before initializing the S3 client
if (!config.awsAccessKeyId || !config.awsSecretAccessKey || !config.awsRegion) {
  throw new Error("AWS credentials and region must be defined.");
}
const s3 = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});
// Define file filter to restrict upload types
const fileFilter: multer.Options["fileFilter"] = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."));
  }
};
// Configure multer and multer-s3 for image uploads
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, key?: string) => void
    ): void => {
      const filename = `${Date.now()}_${path.basename(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter,
});

export default upload ;
