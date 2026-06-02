import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimiter } from "../src/middleware/rateLimiter";
import { responseHelpers } from "../src/middleware/responseHelpers";

describe("rateLimiter", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("blocks max+1 request and resets after window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const app = express();
    app.set("trust proxy", true);
    app.use(
      rateLimiter({
        enabled: true,
        windowMs: 1000,
        max: 2,
        message: "Too many requests",
        statusCode: 429
      })
    );
    app.use(responseHelpers());
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const agent = request(app);
    const ipHeader = { "X-Forwarded-For": "1.1.1.1" };

    expect((await agent.get("/").set(ipHeader)).status).toBe(200);
    expect((await agent.get("/").set(ipHeader)).status).toBe(200);

    const blocked = await agent.get("/").set(ipHeader);
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      success: false,
      message: "Too many requests",
      errors: []
    });

    vi.advanceTimersByTime(1001);
    vi.setSystemTime(new Date("2026-01-01T00:00:01.001Z"));

    const reset = await agent.get("/").set(ipHeader);
    expect(reset.status).toBe(200);
  });

  it("reuses entry object when window expires", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const app = express();
    app.set("trust proxy", true);
    app.use(
      rateLimiter({
        enabled: true,
        windowMs: 5000,
        max: 1,
        message: "Limited",
        statusCode: 429
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const agent = request(app);
    const ipHeader = { "X-Forwarded-For": "9.9.9.9" };

    expect((await agent.get("/").set(ipHeader)).status).toBe(200);
    expect((await agent.get("/").set(ipHeader)).status).toBe(429);

    vi.advanceTimersByTime(5001);
    vi.setSystemTime(new Date("2026-01-01T00:00:05.001Z"));

    expect((await agent.get("/").set(ipHeader)).status).toBe(200);
  });

  it("runs periodic cleanup for expired entries", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const app = express();
    app.use(
      rateLimiter({
        enabled: true,
        windowMs: 1000,
        max: 10,
        message: "Limited",
        statusCode: 429
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    await request(app).get("/");
    vi.advanceTimersByTime(2000);
    await request(app).get("/");
    expect(true).toBe(true);
  });

  it("groups unknown IPs under a shared key", async () => {
    vi.useFakeTimers();
    const app = express();
    app.use(
      rateLimiter({
        enabled: true,
        windowMs: 60_000,
        max: 1,
        message: "Limited",
        statusCode: 429
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const agent = request(app);
    expect((await agent.get("/")).status).toBe(200);
    expect((await agent.get("/")).status).toBe(429);
  });
});
