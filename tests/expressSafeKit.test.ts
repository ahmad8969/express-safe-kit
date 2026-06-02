import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { expressSafeKit } from "../src";

describe("expressSafeKit", () => {
  it("applies middleware and supports typed res.success usage", async () => {
    const app = express();
    app.use(expressSafeKit());

    app.get("/", (_req, res) => {
      res.success("API is running");
    });

    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Success",
      data: "API is running"
    });
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
  });

  it("uses default request logger implementation when logFn omitted", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const app = express();
    app.use(
      expressSafeKit({
        requestLogger: { enabled: true }
      })
    );
    app.get("/ping", (_req, res) => {
      res.success("ok");
    });

    await request(app).get("/ping");
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("enables requestLogger only when configured", async () => {
    const logFn = vi.fn<(line: string) => void>();
    const app = express();
    app.use(
      expressSafeKit({
        requestLogger: {
          enabled: true,
          logFn
        }
      })
    );
    app.get("/health", (_req, res) => {
      res.success({ ok: true });
    });

    await request(app).get("/health");
    expect(logFn).toHaveBeenCalledTimes(1);
  });
});
