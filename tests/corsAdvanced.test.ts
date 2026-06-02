import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { corsMiddleware } from "../src/middleware/cors";

const base = {
  enabled: true,
  methods: ["GET"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: [] as string[],
  credentials: false,
  maxAge: 100
};

describe("corsMiddleware advanced", () => {
  it("supports RegExp and function origins", async () => {
    const regexApp = express();
    regexApp.use(
      corsMiddleware({
        ...base,
        origin: /^https:\/\/.*\.example\.com$/
      })
    );
    regexApp.get("/", (_req, res) => {
      res.send("ok");
    });

    const regexMatch = await request(regexApp)
      .get("/")
      .set("Origin", "https://api.example.com");
    expect(regexMatch.headers["access-control-allow-origin"]).toBe(
      "https://api.example.com"
    );

    const fnApp = express();
    fnApp.use(
      corsMiddleware({
        ...base,
        origin: (origin) => origin === "https://trusted.dev"
      })
    );
    fnApp.get("/", (_req, res) => {
      res.send("ok");
    });

    const fnMatch = await request(fnApp)
      .get("/")
      .set("Origin", "https://trusted.dev");
    expect(fnMatch.headers["access-control-allow-origin"]).toBe(
      "https://trusted.dev"
    );

    const fnReject = await request(fnApp)
      .get("/")
      .set("Origin", "https://untrusted.dev");
    expect(fnReject.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("sets credentials and exposed headers", async () => {
    const app = express();
    app.use(
      corsMiddleware({
        ...base,
        origin: "*",
        credentials: true,
        exposedHeaders: ["X-Request-Id"]
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app).get("/").set("Origin", "*");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    expect(response.headers["access-control-expose-headers"]).toBe(
      "X-Request-Id"
    );
  });

  it("matches exact string origin", async () => {
    const app = express();
    app.use(
      corsMiddleware({
        ...base,
        origin: "https://only.example.com"
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const match = await request(app)
      .get("/")
      .set("Origin", "https://only.example.com");
    expect(match.headers["access-control-allow-origin"]).toBe(
      "https://only.example.com"
    );
  });
});
