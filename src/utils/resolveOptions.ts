import {
  DEFAULT_CORS_BASE,
  DEFAULT_JSON_BODY,
  DEFAULT_RATE_LIMIT,
  DEFAULT_REQUEST_LOGGER,
  DEFAULT_SECURITY,
  DEFAULT_URLENCODED_BODY
} from "../defaults";
import type {
  CorsOptions,
  ExpressSafeKitOptions,
  ExpressSafeKitResolvedOptions
} from "../types";
import { resolveDefaultCorsOrigin } from "./corsDefaults";
import { deepMerge } from "./deepMerge";

const withEnabled = <T extends { enabled: boolean }>(
  defaults: T,
  enabled: boolean
): T => ({ ...defaults, enabled });

const resolveToggleable = <T extends { enabled: boolean }>(
  option: false | Partial<T> | undefined,
  defaults: T
): T => {
  if (option === false) {
    return withEnabled(defaults, false);
  }
  return deepMerge(defaults, option);
};

export const resolveCorsOptions = (
  corsOption: ExpressSafeKitOptions["cors"]
): CorsOptions => {
  if (corsOption === false) {
    const resolved = resolveDefaultCorsOrigin();
    return {
      ...DEFAULT_CORS_BASE,
      enabled: false,
      origin: resolved.origin,
      originExplicitlyConfigured: resolved.originExplicitlyConfigured
    };
  }

  const partial = corsOption ?? {};
  const resolvedOrigin = resolveDefaultCorsOrigin(partial);

  return deepMerge(
    {
      ...DEFAULT_CORS_BASE,
      origin: resolvedOrigin.origin,
      originExplicitlyConfigured: resolvedOrigin.originExplicitlyConfigured
    },
    partial
  );
};

export const resolveOptions = (
  options: ExpressSafeKitOptions = {}
): ExpressSafeKitResolvedOptions => ({
  security: resolveToggleable(options.security, DEFAULT_SECURITY),
  cors: resolveCorsOptions(options.cors),
  rateLimit: resolveToggleable(options.rateLimit, DEFAULT_RATE_LIMIT),
  jsonBody: resolveToggleable(options.jsonBody, DEFAULT_JSON_BODY),
  urlencodedBody: resolveToggleable(options.urlencodedBody, DEFAULT_URLENCODED_BODY),
  requestLogger: resolveToggleable(options.requestLogger, DEFAULT_REQUEST_LOGGER)
});
