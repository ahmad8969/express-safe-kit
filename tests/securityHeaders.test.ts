import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { securityHeaders } from "../src/middleware/securityHeaders";

const securityOptions = {
  enabled: true,
  contentSecurityPolicy: "default-src 'self'",
  hsts: {
    enabled: true,
    maxAge: 3600,
    includeSubDomains: false,
    preload: false
  }
};

describe("securityHeaders", () => {
  it("sets baseline security headers", async () => {
    const app = express();
    app.use(securityHeaders(securityOptions));
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app).get("/");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["content-security-policy"]).toBe("default-src 'self'");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  it("sets HSTS only on secure requests", async () => {
    const app = express();
    app.use(securityHeaders(securityOptions));
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const insecure = await request(app).get("/");
    expect(insecure.headers["strict-transport-security"]).toBeUndefined();

    const secure = await request(app)
      .get("/")
      .set("X-Forwarded-Proto", "https");
    expect(secure.headers["strict-transport-security"]).toContain("max-age=3600");
  });

  it("omits CSP when policy string is empty", async () => {
    const app = express();
    app.use(
      securityHeaders({
        ...securityOptions,
        contentSecurityPolicy: "   "
      })
    );
    app.get("/", (_req, res) => {
      res.send("ok");
    });

    const response = await request(app).get("/");
    expect(response.headers["content-security-policy"]).toBeUndefined();
  });
});
