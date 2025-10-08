import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchClosesAlphaVantage, syntheticCloses } from "./dataProviders";

const SAMPLE_RESPONSE = {
  "Time Series FX (Daily)": {
    "2024-05-10": {
      "1. open": "1.0000",
      "2. high": "1.0100",
      "3. low": "0.9900",
      "4. close": "1.0050",
    },
    "2024-05-09": {
      "1. open": "1.0000",
      "2. high": "1.0100",
      "3. low": "0.9900",
      "4. close": "1.0020",
    },
  },
};

describe("data providers", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetchClosesAlphaVantage parses series", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => SAMPLE_RESPONSE,
    });
    const closes = await fetchClosesAlphaVantage("EURUSD", "Daily", "demo");
    expect(closes).toEqual([1.002, 1.005]);
  });

  it("fetchClosesAlphaVantage handles rate limit errors", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ Note: "Rate limit" }),
    });
    await expect(fetchClosesAlphaVantage("EURUSD", "Daily", "demo")).rejects.toThrow(
      /Rate limit/,
    );
  });

  it("syntheticCloses generates a walk", () => {
    const result = syntheticCloses(5, 1);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(1);
  });
});
