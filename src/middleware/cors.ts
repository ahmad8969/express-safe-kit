import type { RequestHandler } from "express";
import type { CorsOptions, CorsOrigin } from "../types";
import {
  resolveDefaultCorsOrigin,
  warnWildcardCorsInProduction
} from "../utils/corsDefaults";

type ResolvedOrigin =
  | { kind: "wildcard" }
  | { kind: "string"; value: string }
  | { kind: "set"; value: Set<string> }
  | { kind: "regex"; value: RegExp }
  | { kind: "function"; value: (origin: string | undefined) => boolean };

const resolveOrigin = (configuredOrigin: CorsOrigin): ResolvedOrigin => {
  if (configuredOrigin === "*") {
    return { kind: "wildcard" };
  }
  if (typeof configuredOrigin === "string") {
    return { kind: "string", value: configuredOrigin };
  }
  if (configuredOrigin instanceof RegExp) {
    return { kind: "regex", value: configuredOrigin };
  }
  if (Array.isArray(configuredOrigin)) {
    return { kind: "set", value: new Set(configuredOrigin) };
  }
  return { kind: "function", value: configuredOrigin };
};

const matchOrigin = (
  resolved: ResolvedOrigin,
  requestOrigin: string | undefined
): string | null => {
  switch (resolved.kind) {
    case "wildcard":
      return "*";
    case "string":
      return resolved.value === requestOrigin ? requestOrigin ?? null : null;
    case "set":
      return typeof requestOrigin === "string" && resolved.value.has(requestOrigin)
        ? requestOrigin
        : null;
    case "regex":
      return typeof requestOrigin === "string" && resolved.value.test(requestOrigin)
        ? requestOrigin
        : null;
    case "function":
      return resolved.value(requestOrigin) ? (requestOrigin ?? null) : null;
  }
};

export const corsMiddleware = (options: CorsOptions): RequestHandler => {
  const configuredOrigin =
    options.origin ?? resolveDefaultCorsOrigin(options).origin;

  if (options.origin !== undefined) {
    warnWildcardCorsInProduction(options.origin);
  }

  const resolvedOrigin = resolveOrigin(configuredOrigin);

  const allowMethods = options.methods.join(", ");
  const allowHeaders = options.allowedHeaders.join(", ");
  const maxAge = String(options.maxAge);
  const exposeHeaders =
    options.exposedHeaders.length > 0
      ? options.exposedHeaders.join(", ")
      : null;

  return (req, res, next) => {
    const allowOrigin = matchOrigin(resolvedOrigin, req.headers.origin);

    if (allowOrigin) {
      res.setHeader("Access-Control-Allow-Origin", allowOrigin);
      res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", allowMethods);
    res.setHeader("Access-Control-Allow-Headers", allowHeaders);
    res.setHeader("Access-Control-Max-Age", maxAge);

    if (exposeHeaders) {
      res.setHeader("Access-Control-Expose-Headers", exposeHeaders);
    }

    if (options.credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  };
};
