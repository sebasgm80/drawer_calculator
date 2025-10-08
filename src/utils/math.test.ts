import { describe, expect, it } from "vitest";
import { clamp, diff, ema, mean } from "./math";

describe("math utils", () => {
  it("clamp limits values", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("ema computes smoothing", () => {
    const result = ema([1, 2, 3, 4], 2);
    expect(result).toHaveLength(4);
    expect(result[0]).toBeCloseTo(1);
    expect(result[3]).toBeCloseTo(3.5, 1);
  });

  it("diff returns first differences", () => {
    expect(diff([1, 3, 4, 6])).toEqual([2, 1, 2]);
    expect(diff([1])).toEqual([]);
  });

  it("mean returns null for empty arrays", () => {
    expect(mean([])).toBeNull();
    expect(mean([2, 4, 6])).toBe(4);
  });
});
