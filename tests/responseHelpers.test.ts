import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { responseHelpers } from "../src/middleware/responseHelpers";

describe("responseHelpers", () => {
  it("returns success payload with default status", async () => {
    const app = express();
    app.use(responseHelpers());
    app.get("/success", (_req, res) => {
      res.success({ ok: true }, "Done");
    });

    const response = await request(app).get("/success");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Done",
      data: { ok: true }
    });
  });

  it("returns created payload with 201", async () => {
    const app = express();
    app.use(responseHelpers());
    app.post("/created", (_req, res) => {
      res.created({ id: 1 }, "Created");
    });

    const response = await request(app).post("/created");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      message: "Created",
      data: { id: 1 }
    });
  });

  it("returns error payload and noContent status", async () => {
    const app = express();
    app.use(responseHelpers());
    app.get("/error", (_req, res) => {
      res.error("Failed", 422, ["bad_input"]);
    });
    app.delete("/empty", (_req, res) => {
      res.noContent();
    });

    const errorResponse = await request(app).get("/error");
    expect(errorResponse.status).toBe(422);
    expect(errorResponse.body).toEqual({
      success: false,
      message: "Failed",
      errors: ["bad_input"]
    });

    const noContentResponse = await request(app).delete("/empty");
    expect(noContentResponse.status).toBe(204);
    expect(noContentResponse.text).toBe("");
  });
});
