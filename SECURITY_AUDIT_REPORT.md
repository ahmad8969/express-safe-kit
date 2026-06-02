# Security Audit Report — express-safe-kit

**Date:** 2026-06-02  
**Version:** 0.1.0  
**Status:** PASS

## Summary

| Check | Result |
|-------|--------|
| `npm audit` | **0 vulnerabilities** |
| Runtime dependencies | **0** |
| Peer dependencies | `express` only |
| Middleware review | PASS with recommendations |
| Build pipeline | PASS |

## Dependencies reviewed

### Production / runtime

None. Package ships only compiled `dist/` + docs.

### Peer

| Package | Range | Notes |
|---------|-------|-------|
| `express` | `^4.18.0 \|\| ^5.0.0` | Required consumer dependency |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.8.3 | Strict compile |
| `tsup` | ^8.2.4 | ESM/CJS + d.ts build |
| `vitest` | ^4.1.8 | Tests (upgraded from 2.x) |
| `@vitest/coverage-v8` | ^4.1.8 | Coverage |
| `express` | ^5.1.0 | Test runtime |
| `supertest` | ^7.1.1 | HTTP assertions |
| `@types/*` | latest | Type definitions |

## Vulnerabilities found & fixes

| Before | After |
|--------|-------|
| 5 vulnerabilities (esbuild/vite via vitest 2) | **0** |

**Fix applied:** Upgrade `vitest` to `4.1.8` (transitive `esbuild` advisory resolved).

## Middleware security review

| Component | Assessment |
|-----------|------------|
| **Security headers** | Manual safe defaults; HSTS only on secure requests; CSP configurable |
| **CORS** | Production denies by default if origin omitted; wildcard warns in production |
| **Rate limiter** | In-memory only — document distributed limitation |
| **Body parsers** | Uses Express built-in with size limit default `1mb` |
| **Error handler** | Hides stack in production (`NODE_ENV`) |
| **Response helpers** | No user input reflection in helpers themselves |

### Recommendations (non-blocking)

1. Always set `NODE_ENV=production` in production.
2. Configure explicit `cors.origin` in production.
3. Use reverse-proxy `trust proxy` for accurate IP rate limiting.
4. Place `errorHandler()` after all routes.

## Build & exports review

- Dual ESM/CJS + `exports` map — correct
- `sideEffects: false` — safe (types in `index.d.ts` only)
- `files` field limits publish to `dist`, `README.md`, `LICENSE`
- Roadmap code **not exported** (internal only)

## Dependency reduction opportunities

- None recommended for v0.1.0 — already minimal
- Future optional peers: `zod`, `ioredis` (v0.2, optional only)

## Verification commands

```bash
npm install
npm audit          # 0 vulnerabilities
npm run lint
npm test
npm run test:coverage
npm run build
```

All verified on 2026-06-02.
