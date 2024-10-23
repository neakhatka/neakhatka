import bcrypt from "bcrypt";
// import { privatekey } from "../server";
import jwt from "jsonwebtoken";
import getConfig from "./config";
import path from "path";
import fs from "fs";
import { StatusCode } from "./consts";
import { BaseCustomError } from "../errors/base-custom-error";
const privateKeyPath = path.join(__dirname, "../../private_key.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
export const generatePassword = async (password: string) => {
  try {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }
};
export const ValidatePassword = async ({
  enterPassword,
  savedPassword,
}: {
  enterPassword: string;
  savedPassword: string;
}) => {
  // return (await generatePassword(enterPassword)) === savedPassword;
  const vaidatePassword = await bcrypt.compare(enterPassword, savedPassword);

  return vaidatePassword;
};

export const generateSignature = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}): Promise<string> => {
  try {
    const payload = {
      id: id,
      role: role,
    };
    return await jwt.sign({ payload: payload }, privateKey, {
      expiresIn: getConfig().jwtExpiresIn!,
      algorithm: "RS256",
    });
  } catch (error: unknown) {
    console.log(error);
    throw new BaseCustomError(
      error instanceof Error ? error.message : "Unknown error occurred",
      StatusCode.NotAcceptable
    );
  }
};
