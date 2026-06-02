import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { notFoundHandler } from "../src/middleware/notFoundHandler";
import { responseHelpers } from "../src/middleware/responseHelpers";

describe("notFoundHandler", () => {
  it("returns standardized 404 payload", async () => {
    const app = express();
    app.use(responseHelpers());
    app.use(notFoundHandler());

    const response = await request(app).get("/missing");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Route not found",
      errors: []
    });
  });
});
