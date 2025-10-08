export type Timeframe = "Daily" | "60m" | "30m" | "15m";
export type Mode = "demo" | "alphavantage";

export interface PairRow {
  pair: string;
  rsi: number | null;
  tsi: number | null;
  score: number | null;
}

export type GlobalSignal = "SOBRECOMPRA" | "SOBREVENTA" | "NEUTRAL";
