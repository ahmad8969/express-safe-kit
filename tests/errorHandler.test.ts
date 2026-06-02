import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { errorHandler } from "../src/middleware/errorHandler";
import { responseHelpers } from "../src/middleware/responseHelpers";

describe("errorHandler", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("returns custom statusCode and errors", async () => {
    const app = express();
    app.use(responseHelpers());
    app.get("/fail", () => {
      const error = Object.assign(new Error("Bad request"), {
        statusCode: 400,
        errors: ["invalid"]
      });
      throw error;
    });
    app.use(errorHandler());

    const response = await request(app).get("/fail");
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Bad request",
      errors: ["invalid"]
    });
  });

  it("includes stack outside production", async () => {
    process.env.NODE_ENV = "development";
    const app = express();
    app.get("/boom", () => {
      throw new Error("Dev error");
    });
    app.use(errorHandler());

    const response = await request(app).get("/boom");
    expect(response.status).toBe(500);
    expect(response.body.stack).toBeDefined();
  });

  it("uses fallback message when error message is empty", async () => {
    const app = express();
    app.get("/empty", () => {
      throw Object.assign(new Error(""), { statusCode: 400 });
    });
    app.use(errorHandler());

    const response = await request(app).get("/empty");
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("normalizes non-error throws", async () => {
    const app = express();
    app.get("/weird", () => {
      throw "not-an-error";
    });
    app.use(errorHandler());

    const response = await request(app).get("/weird");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("hides stack in production", async () => {
    process.env.NODE_ENV = "production";
    const app = express();
    app.get("/boom", () => {
      throw new Error("Prod error");
    });
    app.use(errorHandler());

    const response = await request(app).get("/boom");
    expect(response.status).toBe(500);
    expect(response.body.stack).toBeUndefined();
  });
});
