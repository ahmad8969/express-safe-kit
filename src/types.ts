import type { RequestHandler } from "express";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown[];
  stack?: string;
}

export type CorsOrigin =
  | "*"
  | string
  | string[]
  | RegExp
  | ((origin: string | undefined) => boolean);

export interface SecurityHeadersOptions {
  enabled: boolean;
  contentSecurityPolicy: string;
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
}

export interface CorsOptions {
  enabled: boolean;
  /**
   * Allowed origins. Omit to use environment-aware defaults:
   * - development: `"*"`
   * - production: must be set explicitly (see README)
   */
  origin?: CorsOrigin;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
  /** Set internally when defaults are resolved. */
  originExplicitlyConfigured?: boolean;
}

export interface RateLimiterOptions {
  enabled: boolean;
  windowMs: number;
  max: number;
  message: string;
  statusCode: number;
}

export interface JsonBodyOptions {
  enabled: boolean;
  limit: string;
}

export interface UrlencodedBodyOptions {
  enabled: boolean;
  extended: boolean;
}

export interface RequestLoggerOptions {
  enabled: boolean;
  logFn: (line: string) => void;
}

export interface ExpressSafeKitOptions {
  security?: false | Partial<SecurityHeadersOptions>;
  cors?: false | Partial<CorsOptions>;
  rateLimit?: false | Partial<RateLimiterOptions>;
  jsonBody?: false | Partial<JsonBodyOptions>;
  urlencodedBody?: false | Partial<UrlencodedBodyOptions>;
  requestLogger?: false | Partial<RequestLoggerOptions>;
}

export interface ExpressSafeKitResolvedOptions {
  security: SecurityHeadersOptions;
  cors: CorsOptions;
  rateLimit: RateLimiterOptions;
  jsonBody: JsonBodyOptions;
  urlencodedBody: UrlencodedBodyOptions;
  requestLogger: RequestLoggerOptions;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  errors?: unknown[];
}

declare global {
  namespace Express {
    interface Response {
      // These helper methods are globally typed for consumers because this file
      // ships in dist/index.d.ts and is loaded whenever "express-safe-kit" is imported.
      success<T = unknown>(
        data: T,
        message?: string,
        statusCode?: number
      ): this;
      error(message: string, statusCode?: number, errors?: unknown[]): this;
      created<T = unknown>(data: T, message?: string): this;
      noContent(): this;
    }
  }
}

export type MiddlewareFactory<TOptions> = (options?: TOptions) => RequestHandler;

export {};
