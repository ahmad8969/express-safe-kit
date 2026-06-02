import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveDefaultCorsOrigin } from "../src/utils/corsDefaults";
import { resetWarningsForTests } from "../src/utils/env";

describe("resolveDefaultCorsOrigin", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    resetWarningsForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    resetWarningsForTests();
  });

  it("uses wildcard in development when origin is omitted", () => {
    process.env.NODE_ENV = "development";
    const resolved = resolveDefaultCorsOrigin();
    expect(resolved.origin).toBe("*");
    expect(resolved.originExplicitlyConfigured).toBe(false);
  });

  it("denies cross-origin by default in production when origin is omitted", () => {
    process.env.NODE_ENV = "production";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const resolved = resolveDefaultCorsOrigin();
    expect(resolved.origin).toEqual([]);
    expect(resolved.originExplicitlyConfigured).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("CORS origin not configured")
    );
  });

  it("warns when wildcard origin is explicit in production", () => {
    process.env.NODE_ENV = "production";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    resolveDefaultCorsOrigin({ origin: "*" });
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Wildcard CORS origin detected in production")
    );
  });

  it("respects explicitly configured origin in production", () => {
    process.env.NODE_ENV = "production";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const resolved = resolveDefaultCorsOrigin({
      origin: ["https://app.example.com"]
    });
    expect(resolved.origin).toEqual(["https://app.example.com"]);
    expect(resolved.originExplicitlyConfigured).toBe(true);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
