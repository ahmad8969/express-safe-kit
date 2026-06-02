import type { RequestHandler } from "express";
import type { HppProtectionOptions } from "./types";

/**
 * HTTP Parameter Pollution protection (roadmap).
 *
 * Planned behavior:
 * - Normalize duplicate query/body parameters
 * - Prefer last or first value based on configuration
 *
 * @see docs/ROADMAP.md
 */
export const hppProtection = (
  _options: HppProtectionOptions = {}
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
