import type { RequestHandler } from "express";

/** @roadmap Planned for a future release. */
export interface RequestIdMiddlewareOptions {
  headerName?: string;
  generator?: () => string;
  setResponseHeader?: boolean;
}

/** @roadmap Planned for a future release. */
export interface ApiKeyMiddlewareOptions {
  headerName?: string;
  queryParam?: string;
  keys: string[] | (() => string[] | Promise<string[]>);
  unauthorizedMessage?: string;
}

/** @roadmap Planned for a future release — requires optional `zod` peer dependency. */
export interface ValidateMiddlewareOptions {
  target?: "body" | "query" | "params" | "headers";
}

/** Minimal schema contract so Zod is not required at build time. */
export interface ValidationSchema {
  safeParse: (input: unknown) => {
    success: boolean;
    data?: unknown;
    error?: { flatten: () => unknown };
  };
}

/** @roadmap Planned for a future release. */
export interface MongoSanitizeOptions {
  replaceWith?: string;
  onSanitize?: (params: { key: string; value: unknown }) => void;
}

/** @roadmap Planned for a future release. */
export interface HppProtectionOptions {
  checkQuery?: boolean;
  checkBody?: boolean;
  whitelist?: string[];
}

/** @roadmap Planned for a future release — requires Redis client. */
export interface RedisRateLimiterOptions {
  redisClient: unknown;
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
  keyPrefix?: string;
}

export type RoadmapMiddlewareFactory<TOptions> = (
  options?: TOptions
) => RequestHandler;
