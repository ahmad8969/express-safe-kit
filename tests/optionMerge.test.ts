import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { expressSafeKit } from "../src";
import { resetWarningsForTests } from "../src/utils/env";

describe("expressSafeKit option merging", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    resetWarningsForTests();
  });

  it("merges partial jsonBody and urlencodedBody options", async () => {
    const app = express();
    app.use(
      expressSafeKit({
        jsonBody: { limit: "2mb" },
        urlencodedBody: { extended: false }
      })
    );
    app.post("/echo", (req, res) => {
      res.success(req.body);
    });

    const response = await request(app)
      .post("/echo")
      .type("form")
      .send("name=ada");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ name: "ada" });
  });

  it("deep-merges nested security hsts options", async () => {
    const app = express();
    app.use(
      expressSafeKit({
        security: {
          hsts: {
            enabled: true,
            maxAge: 15552000,
            includeSubDomains: true,
            preload: true
          }
        }
      })
    );
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const response = await request(app)
      .get("/")
      .set("X-Forwarded-Proto", "https");
    expect(response.headers["strict-transport-security"]).toContain("preload");
    expect(response.headers["strict-transport-security"]).toContain(
      "includeSubDomains"
    );
  });

  it("disables cors when cors is false", async () => {
    const app = express();
    app.use(expressSafeKit({ cors: false }));
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const response = await request(app)
      .get("/")
      .set("Origin", "https://any.example.com");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("disables middleware when set to false", async () => {
    const app = express();
    app.use(
      expressSafeKit({
        security: false,
        rateLimit: false
      })
    );
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const response = await request(app).get("/");
    expect(response.headers["x-content-type-options"]).toBeUndefined();
    expect(response.status).toBe(200);
  });

  it("merges explicit cors origin in production", async () => {
    process.env.NODE_ENV = "production";
    const app = express();
    app.use(
      expressSafeKit({
        cors: {
          origin: "https://app.example.com"
        }
      })
    );
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const response = await request(app)
      .get("/")
      .set("Origin", "https://app.example.com");
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://app.example.com"
    );
  });

  it("uses production-safe cors default when origin is omitted", async () => {
    process.env.NODE_ENV = "production";
    const app = express();
    app.use(expressSafeKit());
    app.get("/", (_req, res) => {
      res.success("ok");
    });

    const response = await request(app)
      .get("/")
      .set("Origin", "https://unknown.example.com");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
