import type {
  CorsOptions,
  JsonBodyOptions,
  RateLimiterOptions,
  RequestLoggerOptions,
  SecurityHeadersOptions,
  UrlencodedBodyOptions
} from "./types";

export const DEFAULT_SECURITY: SecurityHeadersOptions = {
  enabled: true,
  contentSecurityPolicy:
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  hsts: {
    enabled: true,
    maxAge: 15552000,
    includeSubDomains: true,
    preload: false
  }
};

export const DEFAULT_CORS_BASE: Omit<
  CorsOptions,
  "origin" | "originExplicitlyConfigured"
> = {
  enabled: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [],
  credentials: false,
  maxAge: 86400
};

export const DEFAULT_RATE_LIMIT: RateLimiterOptions = {
  enabled: true,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  statusCode: 429
};

export const DEFAULT_JSON_BODY: JsonBodyOptions = {
  enabled: true,
  limit: "1mb"
};

export const DEFAULT_URLENCODED_BODY: UrlencodedBodyOptions = {
  enabled: true,
  extended: true
};

export const DEFAULT_REQUEST_LOGGER: RequestLoggerOptions = {
  enabled: false,
  logFn: (line: string) => {
    console.log(line);
  }
};
