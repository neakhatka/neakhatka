import jwt, { JwtPayload } from "jsonwebtoken";
import { logger } from "./logger";
import APIError from "../controller/error/api-error";
export const decodedToken = async (token: string) => {
  try {
    const data = (await jwt.decode(token)) as JwtPayload;
    return data.payload;
  } catch (error: unknown) {
    logger.error("Unable to decode in decodeToken() method !", error);
    throw new APIError("Can't Decode token!");
  }
};
