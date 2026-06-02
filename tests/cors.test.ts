import express from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { corsMiddleware } from "../src/middleware/cors";
import { resetWarningsForTests } from "../src/utils/env";

const baseCorsOptions = {
  enabled: true,
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: [],
  credentials: false,
  maxAge: 600
};

describe("corsMiddleware", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    resetWarningsForTests();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    resetWarningsForTests();
  });

  it("allows wildcard origin in development", async () => {
    process.env.NODE_ENV = "development";
    const app = express();
    app.use(corsMiddleware({ ...baseCorsOptions, origin: "*" }));
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app)
      .get("/")
      .set("Origin", "http://localhost:3000");

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  it("reflects allowed origin from explicit list", async () => {
    const app = express();
    app.use(
      corsMiddleware({
        ...baseCorsOptions,
        origin: ["https://app.example.com"]
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const allowed = await request(app)
      .get("/")
      .set("Origin", "https://app.example.com");
    expect(allowed.headers["access-control-allow-origin"]).toBe(
      "https://app.example.com"
    );

    const blocked = await request(app)
      .get("/")
      .set("Origin", "https://evil.example.com");
    expect(blocked.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("does not set allow-origin when request has no Origin header", async () => {
    const app = express();
    app.use(
      corsMiddleware({
        ...baseCorsOptions,
        origin: "https://app.example.com"
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app).get("/");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("handles OPTIONS preflight", async () => {
    const app = express();
    app.use(corsMiddleware({ ...baseCorsOptions, origin: "*" }));
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app).options("/").set("Origin", "*");
    expect(response.status).toBe(204);
  });
});
