import type { ErrorRequestHandler } from "express";
import type { ErrorWithStatusCode } from "../types";
import { isProduction } from "../utils/env";

const isErrorLike = (value: unknown): value is ErrorWithStatusCode =>
  typeof value === "object" && value !== null && "message" in value;

export const errorHandler = (): ErrorRequestHandler => {
  const hideStack = isProduction();

  return (err, _req, res, _next) => {
    let normalizedError: ErrorWithStatusCode;
    if (isErrorLike(err)) {
      normalizedError = err;
    } else {
      normalizedError = new Error("Internal Server Error");
    }

    const statusCodeCandidate = normalizedError.statusCode;
    const statusCode =
      typeof statusCodeCandidate === "number" && statusCodeCandidate >= 400
        ? statusCodeCandidate
        : 500;

    const payload: {
      success: false;
      message: string;
      errors: unknown[];
      stack?: string;
    } = {
      success: false,
      message: normalizedError.message || "Internal Server Error",
      errors: Array.isArray(normalizedError.errors) ? normalizedError.errors : []
    };

    if (!hideStack) {
      payload.stack = normalizedError.stack;
    }

    res.status(statusCode).json(payload);
  };
};
