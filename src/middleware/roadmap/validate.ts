import type { RequestHandler } from "express";
import type { ValidateMiddlewareOptions, ValidationSchema } from "./types";

/**
 * Zod validation middleware (roadmap).
 *
 * Planned usage:
 * ```ts
 * app.post("/users", validate(createUserSchema), handler);
 * ```
 *
 * @see docs/ROADMAP.md
 */
export const validate = (
  _schema: ValidationSchema,
  _options: ValidateMiddlewareOptions = {}
): RequestHandler => {
  return (_req, _res, next) => {
    next();
  };
};
