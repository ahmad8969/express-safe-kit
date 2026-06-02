import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevelopment, isProduction, resetWarningsForTests, warnOnce } from "../src/utils/env";

describe("env utils", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    resetWarningsForTests();
  });

  it("detects production and development", () => {
    process.env.NODE_ENV = "production";
    expect(isProduction()).toBe(true);
    expect(isDevelopment()).toBe(false);

    process.env.NODE_ENV = "development";
    expect(isProduction()).toBe(false);
    expect(isDevelopment()).toBe(true);
  });

  it("warns only once per key", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    warnOnce("test-key", "first");
    warnOnce("test-key", "second");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("first");
  });
});
