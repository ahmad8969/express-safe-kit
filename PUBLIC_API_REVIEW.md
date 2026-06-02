# Public API Review — express-safe-kit

**Date:** 2026-06-02  
**Version:** 0.1.0

## Policy

Only **fully implemented, stable** APIs are exported from the package entry point. Roadmap / placeholder middleware is kept in `src/middleware/roadmap/` (internal, not published in bundle).

## Stable public exports

| Export | Type | Status |
|--------|------|--------|
| `expressSafeKit` | Function | ✅ Stable |
| `securityHeaders` | Function | ✅ Stable |
| `corsMiddleware` | Function | ✅ Stable |
| `rateLimiter` | Function | ✅ Stable |
| `responseHelpers` | Function | ✅ Stable |
| `requestLogger` | Function | ✅ Stable |
| `errorHandler` | Function | ✅ Stable |
| `notFoundHandler` | Function | ✅ Stable |

## Removed from public API (v0.1.0 hardening)

These were previously exported as no-op placeholders and have been **removed**:

| Removed export | Reason |
|----------------|--------|
| `requestIdMiddleware` | Not implemented |
| `apiKeyMiddleware` | Not implemented |
| `validate` | Not implemented |
| `mongoSanitize` | Not implemented |
| `hppProtection` | Not implemented |
| `redisRateLimiter` | Not implemented |

## Type exports

Stable types from `./types`:

- `ExpressSafeKitOptions`, `ExpressSafeKitResolvedOptions`
- `SecurityHeadersOptions`, `CorsOptions`, `CorsOrigin`
- `RateLimiterOptions`, `JsonBodyOptions`, `UrlencodedBodyOptions`
- `RequestLoggerOptions`
- `ApiSuccessResponse`, `ApiErrorResponse`, `ErrorWithStatusCode`

## Backward compatibility

- Removing roadmap exports is a **breaking change** if anyone relied on them — acceptable pre-1.0.0.
- Core `expressSafeKit()` API unchanged.

## Enforcement

- `tests/publicApi.test.ts` asserts stable exports exist and roadmap exports do not.
- `tsup` entry is only `src/index.ts` — roadmap code not in `dist/`.

## Future API (v0.2+)

Documented in [docs/ROADMAP_V0.2.md](./docs/ROADMAP_V0.2.md). Will be exported only when fully implemented and tested.
