import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
import BaseCustomError from "../database/error/base-custom-error";
import { StatusCode } from "../util/consts/status.code";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(`Company Service errorHandler() method error: ${err}`);
  // If the error is an instance of our own throw ERROR
  // if (err instanceof BaseCustomError) {
  //   return res.status(err.getStatusCode()).json({errors:err.serializeErrorOutput()});
  // }
  if (err instanceof BaseCustomError) {
    return res
      .status(err.getStatusCode())
      .json({ errors: err.serializeErrorOutput() });
  }

  return res
    .status(StatusCode.InternalServerError)
    .json({ errors: [{ message: "An unexpected error occurred" }] });
};

export { errorHandler };
