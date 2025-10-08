import { clamp, diff, ema, mean } from "../utils/math";

/**
 * Compute the Relative Strength Index (RSI) for a closing price series.
 */
export function rsi(closes: number[], period = 14): (number | null)[] {
  if (period <= 0) {
    throw new Error("period must be greater than 0");
  }
  if (closes.length <= period) {
    return Array(closes.length).fill(null);
  }
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < closes.length; i += 1) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  let avgGain = gains.slice(0, period).reduce((acc, value) => acc + value, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((acc, value) => acc + value, 0) / period;

  const result: (number | null)[] = Array(period).fill(null);

  const firstRs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
  result.push(100 - 100 / (1 + firstRs));

  for (let i = period; i < gains.length; i += 1) {
    const gain = gains[i];
    const loss = losses[i];
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }

  return result.slice(0, closes.length);
}

/**
 * Compute the True Strength Index (TSI) for a closing price series.
 */
export function tsi(closes: number[], r1 = 25, r2 = 13): (number | null)[] {
  if (r1 <= 0 || r2 <= 0) {
    throw new Error("r1 and r2 must be greater than 0");
  }
  const minLength = r1 + r2 + 5;
  if (closes.length < minLength) {
    return Array(closes.length).fill(null);
  }

  const momentum = diff(closes);
  const pc = ema(ema(momentum, r1), r2);
  const apc = ema(ema(momentum.map((value) => Math.abs(value)), r1), r2);
  const tsiValues = pc.map((value, index) => {
    const denom = apc[index];
    if (denom === 0) {
      return 0;
    }
    return (value / denom) * 100;
  });

  const pad = closes.length - tsiValues.length;
  return Array(pad).fill(null).concat(tsiValues);
}

export function scaleRSIToMinus1Plus1(value: number | null): number | null {
  if (value == null) {
    return null;
  }
  return (value - 50) / 50;
}

export function scaleTSIToMinus1Plus1(value: number | null): number | null {
  if (value == null) {
    return null;
  }
  return clamp(value, -100, 100) / 100;
}

export function pairScore(closes: number[]): {
  rsi: number | null;
  tsi: number | null;
  score: number | null;
} {
  const rsiSeries = rsi(closes, 14);
  const tsiSeries = tsi(closes, 25, 13);
  const lastRsi = rsiSeries.length ? rsiSeries[rsiSeries.length - 1] ?? null : null;
  const lastTsi = tsiSeries.length ? tsiSeries[tsiSeries.length - 1] ?? null : null;
  const scaledRsi = scaleRSIToMinus1Plus1(lastRsi);
  const scaledTsi = scaleTSIToMinus1Plus1(lastTsi);
  const values = [scaledRsi, scaledTsi].filter((value): value is number => value != null);
  return {
    rsi: lastRsi,
    tsi: lastTsi,
    score: values.length ? mean(values) : null,
  };
}
