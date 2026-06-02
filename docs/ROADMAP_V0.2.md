# Roadmap v0.2 — express-safe-kit

**Status:** Planning — not implemented in v0.1.0  
**Policy:** Features export only when complete, tested, and documented.

## Design principles

- Optional peer dependencies (e.g. `zod`, Redis client)
- No breaking changes to v0.1 stable exports without semver major
- Keep zero runtime deps for core package where possible

---

## 1. Redis Rate Limiter

**Problem:** In-memory limiter fails across instances, serverless, and load balancers.

**Planned API:**

```ts
import { redisRateLimiter } from "express-safe-kit";

app.use(
  redisRateLimiter({
    redisClient,        // ioredis or node-redis instance
    max: 100,
    windowMs: 900_000,
    keyPrefix: "rl:",
    message: "Too many requests",
    statusCode: 429
  })
);
```

**Architecture:**

```
Request → key = prefix + IP/userId
        → Redis INCR + EXPIRE (sliding or fixed window)
        → allow | 429 JSON
```

**Peer dependency:** `ioredis` or `redis` (optional)

---

## 2. Request ID Middleware

```ts
import { requestIdMiddleware } from "express-safe-kit";

app.use(requestIdMiddleware({
  headerName: "X-Request-Id",
  setResponseHeader: true
}));
// req.id available in routes and logs
```

---

## 3. API Key Middleware

```ts
app.use("/internal", apiKeyMiddleware({
  headerName: "X-API-Key",
  keys: () => process.env.API_KEYS.split(",")
}));
```

---

## 4. Zod Validation Middleware

```ts
import { z } from "zod";
import { validate } from "express-safe-kit";

const schema = z.object({ email: z.string().email() });

app.post("/users", validate(schema), (req, res) => {
  res.created(req.body);
});
```

**Peer dependency:** `zod` (optional)

---

## 5. Mongo Sanitize Middleware

```ts
app.use(mongoSanitize()); // strips $ and . from body/query/params
```

---

## 6. HPP Protection

```ts
app.use(hppProtection({ whitelist: ["sort"] }));
```

---

## 7. Logger Adapters

```ts
import { pinoRequestLogger } from "express-safe-kit/adapters/pino";
```

Subpath export or separate package `@express-safe-kit/pino`.

---

## 8. Request Metrics / OpenTelemetry

- Hook points for span creation per request
- Optional `@express-safe-kit/otel` package

---

## Version timeline (proposed)

| Version | Focus |
|---------|-------|
| 0.1.0 | Core kit (current) |
| 0.2.0 | Redis rate limit + request ID |
| 0.3.0 | Validation + API key |
| 0.4.0 | Sanitize + HPP + adapters |

---

## Internal code location

Draft implementations live in `src/middleware/roadmap/` (not exported until ready).
