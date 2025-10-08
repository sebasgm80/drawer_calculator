import type { Mode, Timeframe } from "../types";

const INTRADAY_MAP: Record<Exclude<Timeframe, "Daily">, string> = {
  "15m": "15min",
  "30m": "30min",
  "60m": "60min",
};

type AlphaVantageResponse = {
  [key: string]: unknown;
};

function buildAlphaVantageUrl(pair: string, tf: Timeframe, apiKey: string): string {
  const symbolFrom = pair.slice(0, 3).toUpperCase();
  const symbolTo = pair.slice(3).toUpperCase();
  if (tf === "Daily") {
    const params = new URLSearchParams({
      function: "FX_DAILY",
      from_symbol: symbolFrom,
      to_symbol: symbolTo,
      apikey: apiKey,
      outputsize: "compact",
    });
    return `https://www.alphavantage.co/query?${params.toString()}`;
  }
  const params = new URLSearchParams({
    function: "FX_INTRADAY",
    from_symbol: symbolFrom,
    to_symbol: symbolTo,
    interval: INTRADAY_MAP[tf],
    apikey: apiKey,
    outputsize: "compact",
  });
  return `https://www.alphavantage.co/query?${params.toString()}`;
}

function extractSeriesKey(tf: Timeframe): string {
  if (tf === "Daily") {
    return "Time Series FX (Daily)";
  }
  return `Time Series FX (${INTRADAY_MAP[tf]})`;
}

export async function fetchClosesAlphaVantage(
  pair: string,
  tf: Timeframe,
  apiKey: string,
): Promise<number[]> {
  if (!pair || pair.length < 6) {
    throw new Error("Par inválido");
  }
  const url = buildAlphaVantageUrl(pair, tf, apiKey);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = (await response.json()) as AlphaVantageResponse;
  const seriesKey = extractSeriesKey(tf);
  const series = data[seriesKey] as Record<string, { "4. close": string }> | undefined;
  if (!series) {
    const info = (data as { Information?: unknown }).Information;
    const message =
      (typeof data.Note === "string" && data.Note) ||
      (typeof data["Error Message"] === "string" && data["Error Message"]) ||
      (typeof info === "string" && info) ||
      "Alpha Vantage no devolvió datos. Suele ocurrir al superar el límite gratuito (5 peticiones por minuto y 500 al día) o cuando el par no está disponible.";
    throw new Error(message);
  }
  const entries = Object.entries(series).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );
  return entries.map(([, value]) => Number.parseFloat(value["4. close"]));
}

export function syntheticCloses(n = 400, start = 1): number[] {
  if (n <= 0) {
    return [];
  }
  const values: number[] = [start];
  for (let i = 1; i < n; i += 1) {
    const drift = (Math.random() - 0.5) * 0.004;
    values.push(values[i - 1] * (1 + drift));
  }
  return values;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getCloses(
  pair: string,
  tf: Timeframe,
  mode: Mode,
  apiKey: string,
): Promise<number[]> {
  if (mode === "demo") {
    return syntheticCloses();
  }
  return fetchClosesAlphaVantage(pair, tf, apiKey);
}
