import { Request, Response, NextFunction } from "express";
// import jwt from 'jsonwebtoken';
// import User from '../models/userModel';
// import { CompanyModel } from '../database/model/company.repository.model';
import { decodedToken } from "../util/jwt";
import { logger } from "../util/logger";
import { StatusCode } from "../util/consts/status.code";
import APIError from "../database/error/api-error";
import BaseCustomError from "../database/error/base-custom-error";

export interface AuthRequest extends Request {
  employer?: any;
}

export const authorize = (requireRole: string[]) => {
  return async (req: Request, _res: Response, _next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;
      const decoded = await decodedToken(token);

      const { role } = decoded;
      if (!requireRole.includes(role)) {
        // throw new BaseCustomError(StatusCode.Forbidden, "User does not have the required role");
        return { message: "Role did not have" };
      }
      (req as AuthRequest).employer = decoded;

      logger.info(
        `User with role '${role}' authorized for '${requireRole}' role`
      );
      _next();
    } catch (error: unknown) {
      logger.error("Authorization error:", error);
      if (error instanceof BaseCustomError) {
        _next(error);
      }
      _next(
        new APIError("Unauthorized - Invalid token", StatusCode.Unauthorized)
      );
    }
  };
};
