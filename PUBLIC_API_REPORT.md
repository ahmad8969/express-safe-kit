# Public API Report — express-safe-kit v0.1.0

**Date:** 2026-06-02

## Policy

Only fully implemented, stable middleware is exported from `express-safe-kit`.

## Stable exports (8 functions)

| Export | Signature | Purpose |
|--------|-----------|---------|
| `expressSafeKit` | `(options?) => Router` | All-in-one middleware stack |
| `securityHeaders` | `(options) => RequestHandler` | Security headers |
| `corsMiddleware` | `(options) => RequestHandler` | CORS |
| `rateLimiter` | `(options) => RequestHandler` | In-memory rate limit |
| `responseHelpers` | `() => RequestHandler` | `res.success` / `res.error` / … |
| `requestLogger` | `(options?) => RequestHandler` | HTTP request logging |
| `errorHandler` | `() => ErrorRequestHandler` | Global error JSON |
| `notFoundHandler` | `() => RequestHandler` | 404 JSON |

## Stable type exports

`ApiSuccessResponse`, `ApiErrorResponse`, `CorsOptions`, `CorsOrigin`, `ErrorWithStatusCode`, `ExpressSafeKitOptions`, `ExpressSafeKitResolvedOptions`, `JsonBodyOptions`, `RateLimiterOptions`, `RequestLoggerOptions`, `SecurityHeadersOptions`, `UrlencodedBodyOptions`

## Global TypeScript augmentation

Shipped in `dist/index.d.ts`:

- `Express.Response.success`
- `Express.Response.error`
- `Express.Response.created`
- `Express.Response.noContent`

## Removed / not exported (v0.1.0)

| Symbol | Status |
|--------|--------|
| `requestIdMiddleware` | Internal roadmap only |
| `apiKeyMiddleware` | Internal roadmap only |
| `validate` | Internal roadmap only |
| `mongoSanitize` | Internal roadmap only |
| `hppProtection` | Internal roadmap only |
| `redisRateLimiter` | Internal roadmap only |

Location: `src/middleware/roadmap/` — **not bundled** in `dist/` (entry is `src/index.ts` only).

## Enforcement

- `tests/publicApi.test.ts` — automated export surface test
- `tsup` single entry — roadmap code excluded from publish bundle

## Breaking change note (pre-1.0)

If early adopters imported roadmap placeholders, they must remove those imports. Core `expressSafeKit()` API is unchanged.

## Verdict

**Public API is clean and stable for v0.1.0.**
