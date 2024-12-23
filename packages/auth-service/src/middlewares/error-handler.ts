import { Request, Response, NextFunction } from "express";
import { BaseCustomError } from "../errors/base-custom-error";
import { StatusCode } from "../utils/consts/status-code";
import { logger } from "../utils/logger";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Auth Service - errorHandler():  ${err}`);

  if (err instanceof AggregateError) {
    err.errors.forEach((individualError) => {
      logger.error(`AggregateError contains: ${individualError}`);
    });
  }

  // If the error is an instance of our own throw ERROR
  if (err instanceof BaseCustomError) {
    res.status(err.getStatusCode()).json({ errors: err.serializeErrors() });
    return;
  }

  res.status(StatusCode.InternalServerError).json({
    message: err.message || "An unexpected error occurred",
  });
};

export { errorHandler };
