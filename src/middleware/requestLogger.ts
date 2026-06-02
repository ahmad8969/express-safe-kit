import type { RequestHandler } from "express";
import type { RequestLoggerOptions } from "../types";

export const requestLogger = (
  options: Partial<RequestLoggerOptions> = {}
): RequestHandler => {
  const logFn = options.logFn ?? console.log;

  return (req, res, next) => {
    const start = performance.now();

    res.on("finish", () => {
      const durationMs = performance.now() - start;
      logFn(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(2)}ms`
      );
    });

    next();
  };
};
