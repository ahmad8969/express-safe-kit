import { describe, expect, it } from "vitest";
import * as publicApi from "../src";

const stableExports = [
  "expressSafeKit",
  "responseHelpers",
  "rateLimiter",
  "requestLogger",
  "errorHandler",
  "notFoundHandler",
  "securityHeaders",
  "corsMiddleware"
] as const;

const removedRoadmapExports = [
  "requestIdMiddleware",
  "apiKeyMiddleware",
  "validate",
  "mongoSanitize",
  "hppProtection",
  "redisRateLimiter"
] as const;

describe("public API surface", () => {
  it("exports only stable middleware", () => {
    for (const name of stableExports) {
      expect(publicApi).toHaveProperty(name);
      expect(typeof publicApi[name]).toBe("function");
    }
  });

  it("does not export roadmap placeholders", () => {
    for (const name of removedRoadmapExports) {
      expect(publicApi).not.toHaveProperty(name);
    }
  });
});
