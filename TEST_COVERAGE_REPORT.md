# Test Coverage Report — express-safe-kit

**Date:** 2026-06-02  
**Runner:** Vitest 4 + @vitest/coverage-v8

## Thresholds (enforced)

| Metric | Target | Actual |
|--------|--------|--------|
| Lines | ≥ 95% | **99.06%** ✅ |
| Functions | ≥ 95% | **100%** ✅ |
| Branches | ≥ 90% | **91.91%** ✅ |
| Statements | ≥ 95% | **99.06%** ✅ |

## Test suite

| File | Focus |
|------|-------|
| `expressSafeKit.test.ts` | Integration + logger |
| `cors.test.ts` | CORS basics, OPTIONS, no Origin |
| `corsAdvanced.test.ts` | RegExp, function, credentials |
| `corsDefaults.test.ts` | Env-aware origin + warnings |
| `rateLimiter.test.ts` | Block, reset, reuse, cleanup, IP |
| `responseHelpers.test.ts` | success, created, error, noContent |
| `errorHandler.test.ts` | status, stack hide/show, non-Error |
| `requestLogger.test.ts` | Custom + default logFn |
| `securityHeaders.test.ts` | Headers, HSTS, empty CSP |
| `notFoundHandler.test.ts` | 404 shape |
| `optionMerge.test.ts` | deep merge, disable flags, production CORS |
| `deepMerge.test.ts` | Utility |
| `env.test.ts` | warnOnce |
| `publicApi.test.ts` | Export surface |

**Total:** 44 tests, 14 files — all passing.

## Coverage by area

| Module | Lines | Notes |
|--------|-------|-------|
| `index.ts` | 100% | Router wiring |
| `cors.ts` | 100% | All origin strategies |
| `rateLimiter.ts` | 92.85% | Entry reuse branch partially covered |
| `securityHeaders.ts` | 100% | |
| `errorHandler.ts` | 100% | |
| `requestLogger.ts` | 100% | |
| `responseHelpers.ts` | 100% | |
| `utils/*` | ~99% | |

## Excluded from coverage

- `src/types.ts` — types only
- `src/middleware/roadmap/**` — internal, not public

## Edge cases covered

- Production vs development `NODE_ENV`
- CORS wildcard warning in production
- CORS not configured warning in production
- Rate limit window reset (fake timers)
- Non-error thrown values in error handler
- Empty CSP string
- Disabled middleware via `false` option

## Commands

```bash
npm test
npm run test:coverage
```

## Verdict

**Coverage targets met for v0.1.0 release.**
