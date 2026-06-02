# express-safe-kit

**Secure your Express app in one line.**

[![npm version](https://img.shields.io/npm/v/express-safe-kit.svg)](https://www.npmjs.com/package/express-safe-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/node/v/express-safe-kit.svg)](https://nodejs.org)

---

## Why express-safe-kit exists

Building secure Express APIs usually means wiring together Helmet, CORS, rate limiting, body parsers, and consistent JSON responses — often with inconsistent types and heavy dependencies.

**express-safe-kit** gives you:

- Sensible security defaults out of the box
- **Zero runtime dependencies**
- Express 4 and 5 support
- Fully typed response helpers (`res.success`, `res.error`, …)
- Standalone middleware exports when you need fine-grained control

---

## Features

| Feature | Description |
|---------|-------------|
| Security headers | Manual safe defaults (no Helmet) |
| CORS | Environment-aware defaults |
| Rate limiting | In-memory, per-IP, auto cleanup |
| Body parsers | `express.json` + `express.urlencoded` |
| Response helpers | Consistent JSON success/error shapes |
| Error handler | Production-safe stack hiding |
| Request logger | Optional, off by default |
| TypeScript | Strict types + global `Response` augmentation |

---

## Installation

```bash
npm install express-safe-kit express
```

**Requirements:** Node.js 18+, Express `^4.18` or `^5.0`

---

## Quick Start

```ts
import express from "express";
import { expressSafeKit } from "express-safe-kit";

const app = express();
app.use(expressSafeKit());

app.get("/", (_req, res) => {
  res.success("API is running");
});

app.listen(3000);
```

---

## Production Setup

```ts
import express from "express";
import {
  errorHandler,
  expressSafeKit,
  notFoundHandler
} from "express-safe-kit";

const app = express();

app.use(
  expressSafeKit({
    cors: {
      origin: ["https://your-frontend.com"],
      credentials: true
    },
    rateLimit: {
      max: 100,
      windowMs: 15 * 60 * 1000
    },
    requestLogger: { enabled: true }
  })
);

// ... routes

app.use(notFoundHandler());
app.use(errorHandler());

app.listen(process.env.PORT ?? 3000);
```

**Always set** `NODE_ENV=production` in production.

---

## Security Recommendations

1. **Configure CORS explicitly** in production (see [CORS Best Practices](#cors-best-practices)).
2. **Use HTTPS** behind a reverse proxy; HSTS is applied when the request is secure or `X-Forwarded-Proto` includes `https`.
3. **Add `errorHandler()` last** among error middleware.
4. **Do not rely on in-memory rate limits** across multiple instances — see [Memory Rate Limiter Limitations](#memory-rate-limiter-limitations).
5. **Keep Express updated** — this package does not patch Express itself.

Headers set by default include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (sensible default)
- `Strict-Transport-Security` (HTTPS only)
- Removes `X-Powered-By`

---

## CORS Best Practices

### Development

When `NODE_ENV` is not `production` and you omit `cors.origin`, the default is:

```ts
origin: "*"
```

### Production

When `NODE_ENV` is `production` and `cors.origin` is **not** set:

```text
[express-safe-kit]
CORS origin not configured.
Configure a specific origin for improved security.
```

Cross-origin requests are **denied by default** until you configure an explicit origin.

If you explicitly set `origin: "*"` in production:

```text
[express-safe-kit]
Wildcard CORS origin detected in production.
Configure a specific origin for improved security.
```

Recommended production configuration:

```ts
expressSafeKit({
  cors: {
    origin: ["https://app.example.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
})
```

Supported `origin` types: `string`, `string[]`, `RegExp`, or `(origin) => boolean`.

---

## Memory Rate Limiter Limitations

The built-in rate limiter stores counters **in process memory**.

### Why this is limited

| Scenario | Issue |
|----------|-------|
| Multiple server instances | Each instance has its own counter |
| Load balancers | Clients may hit different limits per instance |
| Serverless / cold starts | State is not shared between invocations |
| Process restarts | Counters reset |

### When to use Redis (roadmap)

Use a shared store when you need consistent limits across instances:

```ts
// Planned for v0.2 — see docs/ROADMAP_V0.2.md
app.use(
  redisRateLimiter({
    redisClient,
    max: 100,
    windowMs: 900_000
  })
);
```

See [docs/ROADMAP_V0.2.md](./docs/ROADMAP_V0.2.md).

### MVP / single-instance

The default in-memory limiter is fine for:

- Local development
- Single-node deployments
- Low-traffic internal APIs

Default: **100 requests / 15 minutes / IP** with periodic expiry cleanup.

---

## Rate Limiting Best Practices

```ts
expressSafeKit({
  rateLimit: {
    max: 50,
    windowMs: 60_000,
    message: "Slow down",
    statusCode: 429
  }
})
```

- Set `app.set("trust proxy", 1)` when behind a reverse proxy so `req.ip` is accurate.
- Disable with `rateLimit: false` if you use an external gateway rate limiter.
- For distributed systems, use an external store or wait for the v0.2 Redis rate limiter (see roadmap).

---

## Response Helpers

| Method | Status | Body |
|--------|--------|------|
| `res.success(data, message?, status?)` | 200 (default) | `{ success: true, message, data }` |
| `res.created(data, message?)` | 201 | `{ success: true, message, data }` |
| `res.error(message, status?, errors?)` | 500 (default) | `{ success: false, message, errors }` |
| `res.noContent()` | 204 | empty |

```ts
app.get("/users/:id", (_req, res) => {
  res.success({ id: 1 }, "User found");
});

app.post("/users", (_req, res) => {
  res.created({ id: 2 }, "User created");
});

app.get("/fail", (_req, res) => {
  res.error("Not allowed", 403, ["forbidden"]);
});

app.delete("/users/:id", (_req, res) => {
  res.noContent();
});
```

---

## Error Handling

```ts
import { errorHandler, notFoundHandler } from "express-safe-kit";

app.get("/boom", () => {
  const err = Object.assign(new Error("Bad input"), {
    statusCode: 400,
    errors: ["field required"]
  });
  throw err;
});

app.use(notFoundHandler());
app.use(errorHandler());
```

- **Development:** stack traces included in JSON.
- **Production:** stack traces hidden (`NODE_ENV=production`).

Works with Express 5 async error propagation when errors are thrown from async route handlers.

---

## Logger

Request logging is **off by default**.

```ts
expressSafeKit({
  requestLogger: {
    enabled: true,
    logFn: (line) => console.log(line)
  }
})
```

Output format: `GET /path 200 12.34ms`

---

## TypeScript

Response helpers are typed globally — import the package once:

```ts
import { expressSafeKit } from "express-safe-kit";
// res.success, res.error, res.created, res.noContent are typed automatically
```

Module augmentation ships in `dist/index.d.ts`.

---

## CommonJS

```js
const express = require("express");
const { expressSafeKit } = require("express-safe-kit");

const app = express();
app.use(expressSafeKit());
```

---

## ESM

```ts
import express from "express";
import { expressSafeKit } from "express-safe-kit";
```

`package.json` exports:

```json
{
  "import": "./dist/index.js",
  "require": "./dist/index.cjs",
  "types": "./dist/index.d.ts"
}
```

---

## Public API (v0.1.0)

| Export | Description |
|--------|-------------|
| `expressSafeKit` | All-in-one middleware router |
| `securityHeaders` | Manual security headers |
| `corsMiddleware` | CORS handling |
| `rateLimiter` | In-memory rate limit |
| `responseHelpers` | `res.success` / `res.error` / … |
| `requestLogger` | Optional HTTP logger |
| `errorHandler` | Global error JSON handler |
| `notFoundHandler` | Standard 404 handler |

All exports work standalone:

```ts
import {
  corsMiddleware,
  errorHandler,
  notFoundHandler,
  rateLimiter,
  requestLogger,
  responseHelpers,
  securityHeaders
} from "express-safe-kit";
```

---

## Full options

```ts
expressSafeKit({
  security: false | {
    contentSecurityPolicy?: string,
    hsts?: { enabled?, maxAge?, includeSubDomains?, preload? }
  },
  cors: false | {
    origin?: string | string[] | RegExp | ((origin?: string) => boolean),
    methods?: string[],
    allowedHeaders?: string[],
    exposedHeaders?: string[],
    credentials?: boolean,
    maxAge?: number
  },
  rateLimit: false | {
    windowMs?: number,
    max?: number,
    message?: string,
    statusCode?: number
  },
  jsonBody: false | { limit?: string },
  urlencodedBody: false | { extended?: boolean },
  requestLogger: false | { enabled?: boolean, logFn?: (line: string) => void }
})
```

---

## FAQ

### Does this replace Helmet?

It provides overlapping header protection without adding Helmet as a dependency. For advanced Helmet-specific policies, use Helmet alongside or instead of `security: false`.

### Why zero runtime dependencies?

Smaller install, fewer supply-chain risks, and faster CI — Express is the only required peer.

### Does CORS `origin: "*"` still work in production?

Yes, if you **explicitly** set `cors: { origin: "*" }`. The change is only for the *default* when origin is omitted.

### Express 4 vs 5?

Both are supported via the `express` peer dependency. Async errors in Express 5 are handled when thrown from route handlers with `errorHandler()` registered.

---

## Roadmap

See [docs/ROADMAP_V0.2.md](./docs/ROADMAP_V0.2.md).

| Item | Target version |
|------|----------------|
| Redis rate limiter | v0.2 |
| Request ID middleware | v0.2 |
| API key middleware | v0.3 |
| Zod validation | v0.3 |
| Mongo sanitize / HPP | v0.4 |
| Pino / Morgan adapters | v0.4 |
| OpenTelemetry hooks | Future |

> v0.1.0 exports **stable middleware only**. Roadmap features are not in the public API until fully implemented.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

**GitHub Discussions (recommended):**

- Enable Discussions for Q&A and ideas
- Use Issues for bugs and features
- Use Security Advisories for vulnerabilities

---

## Security Policy

See [SECURITY.md](./SECURITY.md).

---

## License

MIT © Ahmad — see [LICENSE](./LICENSE).
