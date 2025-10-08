/**
 * Clamp a number between a minimum and maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("min must be less than or equal to max");
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Calculate the exponential moving average of a numeric array.
 */
export function ema(values: number[], period: number): number[] {
  if (period <= 0) {
    throw new Error("period must be greater than 0");
  }
  if (values.length === 0) {
    return [];
  }
  const k = 2 / (period + 1);
  let emaPrev = values[0];
  const result: number[] = [emaPrev];
  for (let i = 1; i < values.length; i += 1) {
    emaPrev = values[i] * k + emaPrev * (1 - k);
    result.push(emaPrev);
  }
  return result;
}

/**
 * Calculate the first difference of a numeric series.
 */
export function diff(values: number[]): number[] {
  if (values.length <= 1) {
    return [];
  }
  const result: number[] = [];
  for (let i = 1; i < values.length; i += 1) {
    result.push(values[i] - values[i - 1]);
  }
  return result;
}

/**
 * Compute the arithmetic mean of a numeric array.
 */
export function mean(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}
