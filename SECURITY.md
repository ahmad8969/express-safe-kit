# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Email or open a **private security advisory** on GitHub:

https://github.com/ahmad8969/express-safe-kit/security/advisories/new

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

We aim to acknowledge reports within **72 hours** and provide a fix or mitigation plan within **14 days** for confirmed issues.

## Security design notes

- **No Helmet dependency** — headers are set manually with conservative defaults.
- **CORS** — Wildcard origin is allowed in development only; production requires explicit `cors.origin` configuration.
- **Rate limiting** — Default store is in-memory (per-process). Not suitable alone for multi-instance production without Redis (roadmap).
- **Zero runtime dependencies** — Reduces supply-chain attack surface.

## Best practices for consumers

1. Set `NODE_ENV=production` in production.
2. Configure explicit CORS origins.
3. Place `errorHandler()` after routes.
4. Terminate TLS at your reverse proxy and forward `X-Forwarded-Proto` correctly for HSTS.
5. Use a shared rate-limit store when running multiple instances.

See [README.md](./README.md#security-recommendations) for details.
