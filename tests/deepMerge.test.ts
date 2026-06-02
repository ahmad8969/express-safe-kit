import { describe, expect, it } from "vitest";
import { deepMerge } from "../src/utils/deepMerge";

describe("deepMerge", () => {
  it("merges nested objects without mutating base", () => {
    const base = { a: 1, nested: { x: 1, y: 2 } };
    const merged = deepMerge(base, { nested: { x: 1, y: 9 } });

    expect(merged).toEqual({ a: 1, nested: { x: 1, y: 9 } });
    expect(base.nested.y).toBe(2);
  });

  it("skips undefined override values", () => {
    const base = { a: 1, b: 2 };
    const merged = deepMerge(base, { a: undefined, b: 3 });
    expect(merged).toEqual({ a: 1, b: 3 });
  });
});
