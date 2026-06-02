# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-02

### Added

- `expressSafeKit()` all-in-one middleware bundle
- Manual security headers (no Helmet dependency)
- Environment-aware CORS defaults with production warnings
- In-memory rate limiter with periodic cleanup
- JSON / URL-encoded body parsers
- Typed response helpers (`res.success`, `res.error`, `res.created`, `res.noContent`)
- `errorHandler()` and `notFoundHandler()`
- Optional `requestLogger()`
- Dual ESM/CJS build via tsup (`sideEffects: false`)
- Strict prepublish gate (`lint`, `test`, `coverage`, `audit`, `build`)
- Open-source docs and GitHub templates
- Enterprise review documents (market, security, package, DX, final review)

### Security

- Production CORS denies cross-origin when `origin` is omitted
- Warns on wildcard `origin: "*"` in production
- `npm audit`: 0 vulnerabilities
- Public API excludes unfinished roadmap middleware

### Changed

- Vitest upgraded to v4 (dev dependency security)
- Codebase optimized: shared utils, precomputed CORS headers, frozen rate-limit payload

[0.1.0]: https://github.com/ahmad8969/express-safe-kit/releases/tag/v0.1.0
