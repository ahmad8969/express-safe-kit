import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { requestLogger } from "../src/middleware/requestLogger";
import { responseHelpers } from "../src/middleware/responseHelpers";

describe("requestLogger", () => {
  it("uses console.log when logFn is omitted", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const app = express();
    app.use(requestLogger());
    app.get("/ping", (_req, res) => {
      res.send("ok");
    });

    await request(app).get("/ping");
    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });

  it("logs method, url, status, and duration", async () => {
    const logFn = vi.fn<(line: string) => void>();
    const app = express();
    app.use(requestLogger({ logFn }));
    app.use(responseHelpers());
    app.get("/ping", (_req, res) => {
      res.success("pong");
    });

    await request(app).get("/ping");
    expect(logFn).toHaveBeenCalledTimes(1);
    const line = logFn.mock.calls[0][0];
    expect(line).toContain("GET");
    expect(line).toContain("/ping");
    expect(line).toContain("200");
    expect(line).toMatch(/ms$/);
  });
});
