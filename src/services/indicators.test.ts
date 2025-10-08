import { describe, expect, it } from "vitest";
import { pairScore, rsi, scaleRSIToMinus1Plus1, scaleTSIToMinus1Plus1, tsi } from "./indicators";

const SAMPLE_CLOSES = [
  44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08,
  45.89, 46.03, 45.61, 46.28, 46.28, 46, 46.03, 46.41, 46.22, 45.64,
  46.21, 46.25, 45.71, 46.45, 45.78, 45.35, 44.03, 44.18, 44.22, 44.57,
  43.42, 42.66, 43.13,
];

describe("indicators", () => {
  it("rsi returns expected length and values", () => {
    const result = rsi(SAMPLE_CLOSES, 14);
    expect(result).toHaveLength(SAMPLE_CLOSES.length);
    const last = result[result.length - 1];
    expect(last).toBeGreaterThan(0);
    expect(last).toBeLessThanOrEqual(100);
  });

  it("tsi returns nulls for small samples", () => {
    const result = tsi(SAMPLE_CLOSES.slice(0, 10));
    expect(result).toEqual(Array(10).fill(null));
  });

  it("scalers convert values correctly", () => {
    expect(scaleRSIToMinus1Plus1(100)).toBe(1);
    expect(scaleRSIToMinus1Plus1(0)).toBe(-1);
    expect(scaleRSIToMinus1Plus1(null)).toBeNull();
    expect(scaleTSIToMinus1Plus1(150)).toBe(1);
    expect(scaleTSIToMinus1Plus1(-120)).toBe(-1);
  });

  it("pairScore produces consistent values", () => {
    const closes = Array.from({ length: 200 }, (_, index) => 1 + index * 0.001);
    const { rsi: rsiValue, tsi: tsiValue, score } = pairScore(closes);
    expect(rsiValue).not.toBeNull();
    expect(tsiValue).not.toBeNull();
    expect(score).not.toBeNull();
    expect(score).toBeLessThanOrEqual(1);
    expect(score).toBeGreaterThanOrEqual(-1);
  });
});
