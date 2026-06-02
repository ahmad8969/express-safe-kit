import type { RequestHandler } from "express";
import type { RedisRateLimiterOptions } from "./types";

/**
 * Redis-backed rate limiter (roadmap).
 *
 * Planned usage:
 * ```ts
 * app.use(
 *   redisRateLimiter({
 *     redisClient,
 *     max: 100,
 *     windowMs: 900_000
 *   })
 * );
 * ```
 *
 * @see docs/ROADMAP.md
 */
export const redisRateLimiter = (
  _options: RedisRateLimiterOptions
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
