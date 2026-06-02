import type { RequestHandler } from "express";
import type { MongoSanitizeOptions } from "./types";

/**
 * MongoDB query sanitization middleware (roadmap).
 *
 * Planned behavior:
 * - Strip `$` and `.` keys from `req.body`, `req.query`, and `req.params`
 * - Reduce NoSQL injection risk
 *
 * @see docs/ROADMAP.md
 */
export const mongoSanitize = (
  _options: MongoSanitizeOptions = {}
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
