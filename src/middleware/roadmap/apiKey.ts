import type { RequestHandler } from "express";
import type { ApiKeyMiddlewareOptions } from "./types";

/**
 * API key middleware (roadmap).
 *
 * Planned behavior:
 * - Validate API keys from header or query
 * - Protect internal/admin routes
 *
 * @see docs/ROADMAP.md
 */
export const apiKeyMiddleware = (
  _options: ApiKeyMiddlewareOptions
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
