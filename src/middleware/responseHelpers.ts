import type { RequestHandler, Response } from "express";
import type { ApiErrorResponse, ApiSuccessResponse } from "../types";

function success<T>(
  this: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    message,
    data
  };
  return this.status(statusCode).json(payload);
}

function error(
  this: Response,
  message: string,
  statusCode = 500,
  errors: unknown[] = []
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    errors
  };
  return this.status(statusCode).json(payload);
}

function created<T>(this: Response, data: T, message = "Created"): Response {
  return success.call(this, data, message, 201);
}

function noContent(this: Response): Response {
  return this.status(204).end();
}

export const responseHelpers = (): RequestHandler => {
  return (_req, res, next) => {
    res.success = success;
    res.error = error;
    res.created = created;
    res.noContent = noContent;
    next();
  };
};
