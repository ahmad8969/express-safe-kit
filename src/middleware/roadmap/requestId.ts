import type { RequestHandler } from "express";
import type { RequestIdMiddlewareOptions } from "./types";

/**
 * Request ID middleware (roadmap).
 *
 * Planned behavior:
 * - Generate or propagate `X-Request-Id`
 * - Attach `req.id` for logging and tracing
 * - Echo ID on the response for client correlation
 *
 * @see docs/ROADMAP.md
 */
export const requestIdMiddleware = (
  _options: RequestIdMiddlewareOptions = {}
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
