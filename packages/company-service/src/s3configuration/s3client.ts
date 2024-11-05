// import getConfig from "../util/config";
// import { S3Client } from "@aws-sdk/client-s3";

// const config = getConfig();

// // Ensure credentials are defined before initializing the S3 client
// if (!config.awsAccessKeyId || !config.awsSecretAccessKey || !config.awsRegion) {
//   throw new Error("AWS credentials and region must be defined.");
// }
// export const s3 = new S3Client({
//   region: config.awsRegion,
//   credentials: {
//     accessKeyId: config.awsAccessKeyId,
//     secretAccessKey: config.awsSecretAccessKey,
//   },
// });
