import type { CorsOptions, CorsOrigin } from "../types";
import { isProduction, warnOnce } from "./env";

export const CORS_NOT_CONFIGURED_WARNING = `[express-safe-kit]
CORS origin not configured.
Configure a specific origin for improved security.`;

export const CORS_WILDCARD_WARNING = `[express-safe-kit]
Wildcard CORS origin detected in production.
Configure a specific origin for improved security.`;

export interface ResolvedCorsOrigin {
  origin: CorsOrigin;
  originExplicitlyConfigured: boolean;
}

export const warnWildcardCorsInProduction = (origin: CorsOrigin): void => {
  if (isProduction() && origin === "*") {
    warnOnce("cors-production-wildcard", CORS_WILDCARD_WARNING);
  }
};

export const resolveDefaultCorsOrigin = (
  partial?: Partial<CorsOptions>
): ResolvedCorsOrigin => {
  if (partial?.origin !== undefined) {
    warnWildcardCorsInProduction(partial.origin);
    return {
      origin: partial.origin,
      originExplicitlyConfigured: true
    };
  }

  if (isProduction()) {
    warnOnce("cors-production-origin", CORS_NOT_CONFIGURED_WARNING);
    return {
      origin: [],
      originExplicitlyConfigured: false
    };
  }

  return {
    origin: "*",
    originExplicitlyConfigured: false
  };
};
