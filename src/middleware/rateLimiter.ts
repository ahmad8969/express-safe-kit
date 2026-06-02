import type { RequestHandler } from "express";
import type { RateLimiterOptions } from "../types";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const UNKNOWN_IP = "unknown";

export const rateLimiter = (options: RateLimiterOptions): RequestHandler => {
  const entries = new Map<string, RateLimitEntry>();
  const { windowMs, max, message, statusCode } = options;
  const rateLimitBody = Object.freeze({
    success: false as const,
    message,
    errors: Object.freeze([] as unknown[])
  });

  const cleanupIntervalMs = Math.max(1000, windowMs >> 1);
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) {
        entries.delete(key);
      }
    }
  }, cleanupIntervalMs);

  cleanupTimer.unref?.();

  return (req, res, next) => {
    const key = req.ip || UNKNOWN_IP;
    const now = Date.now();
    let entry = entries.get(key);

    if (!entry || entry.resetAt <= now) {
      if (entry) {
        entry.count = 1;
        entry.resetAt = now + windowMs;
      } else {
        entries.set(key, { count: 1, resetAt: now + windowMs });
      }
      next();
      return;
    }

    entry.count += 1;

    if (entry.count > max) {
      res.status(statusCode).json(rateLimitBody);
      return;
    }

    next();
  };
};
