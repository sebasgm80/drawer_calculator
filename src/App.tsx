import { useMemo, useState } from "react";
import Metrics from "./components/Metrics";
import DataTable from "./components/DataTable";
import { DEFAULT_PAIRS } from "./config/pairs";
import { getCloses, sleep } from "./services/dataProviders";
import { pairScore } from "./services/indicators";
import { mean } from "./utils/math";
import type { GlobalSignal, Mode, PairRow, Timeframe } from "./types";
import "./styles/app.css";

const TIMEFRAMES: Timeframe[] = ["Daily", "60m", "30m", "15m"];

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "demo", label: "Demo (sintético)" },
  { value: "alphavantage", label: "Alpha Vantage" },
];

const DEFAULT_PAIRS_TEXT = DEFAULT_PAIRS.join("\n");

function computeSignal(globalScore: number | null, overPct: number, underPct: number): GlobalSignal {
  if (globalScore == null) {
    return "NEUTRAL";
  }
  if (globalScore > 0.6 && overPct >= 0.6) {
    return "SOBRECOMPRA";
  }
  if (globalScore < -0.6 && underPct >= 0.6) {
    return "SOBREVENTA";
  }
  return "NEUTRAL";
}

function sanitizePairs(input: string): string[] {
  return input
    .split(/\s+/)
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
}

function App() {
  const [pairsInput, setPairsInput] = useState<string>(DEFAULT_PAIRS_TEXT);
  const [timeframe, setTimeframe] = useState<Timeframe>("Daily");
  const [mode, setMode] = useState<Mode>("demo");
  const [apiKey, setApiKey] = useState<string>("");
  const [rows, setRows] = useState<PairRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalPairs = rows.length;

  const { globalScore, overPct, underPct, signal } = useMemo(() => {
    const validScores = rows
      .map((row) => row.score)
      .filter((value): value is number => value != null);
    const average = validScores.length ? mean(validScores) : null;
    const overCount = rows.filter((row) => (row.score ?? Number.NEGATIVE_INFINITY) > 0.7).length;
    const underCount = rows.filter((row) => (row.score ?? Number.POSITIVE_INFINITY) < -0.7).length;
    const over = rows.length ? overCount / rows.length : 0;
    const under = rows.length ? underCount / rows.length : 0;
    return {
      globalScore: average,
      overPct: over,
      underPct: under,
      signal: computeSignal(average, over, under),
    };
  }, [rows]);

  async function handleRun() {
    const pairs = sanitizePairs(pairsInput);
    if (pairs.length === 0) {
      setError("Introduce al menos un par.");
      return;
    }
    if (mode === "alphavantage" && apiKey.trim() === "") {
      setError("Necesitas una API key para Alpha Vantage.");
      return;
    }
    setLoading(true);
    setError(null);
    const nextRows: PairRow[] = [];
    const errors: string[] = [];

    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      try {
        const closes = await getCloses(pair, timeframe, mode, apiKey.trim());
        if (closes.length === 0) {
          throw new Error("Sin datos para el par");
        }
        const { rsi, tsi, score } = pairScore(closes);
        nextRows.push({ pair, rsi, tsi, score });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        errors.push(`${pair}: ${message}`);
        nextRows.push({ pair, rsi: null, tsi: null, score: null });
      }
      if (mode === "alphavantage" && i < pairs.length - 1) {
        await sleep(1400);
      }
    }

    setRows(nextRows);
    setError(errors.length ? errors.join("\n") : null);
    setLoading(false);
  }

  return (
    <main className="app">
      <header>
        <h1>Indicador Agregado FX (RSI + TSI)</h1>
        <p className="intro">
          Calcula un índice global de sobrecompra/sobreventa combinando 28 pares FX mediante RSI y TSI.
          Todo se ejecuta en el navegador sin guardar datos.
        </p>
      </header>
      <section className="controls" aria-label="Controles de cálculo">
        <div className="field-group">
          <label htmlFor="pairs">Pares (uno por línea)</label>
          <textarea
            id="pairs"
            value={pairsInput}
            onChange={(event) => setPairsInput(event.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>
        <div className="field-row">
          <label htmlFor="timeframe">Timeframe</label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(event) => setTimeframe(event.target.value as Timeframe)}
          >
            {TIMEFRAMES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="mode">Fuente de datos</label>
          <select
            id="mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
          >
            {MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {mode === "alphavantage" && (
          <div className="field-row">
            <label htmlFor="apikey">API key de Alpha Vantage</label>
            <input
              id="apikey"
              type="text"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Introduce tu clave"
            />
          </div>
        )}
        <button type="button" onClick={handleRun} disabled={loading} className="primary">
          {loading ? "Calculando…" : "Calcular"}
        </button>
        {error && (
          <div role="alert" className="error-message">
            {error.split("\n").map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
        )}
      </section>

      <Metrics
        globalScore={globalScore}
        overPct={overPct}
        underPct={underPct}
        signal={signal}
        totalPairs={totalPairs}
      />

      <DataTable rows={rows} />
    </main>
  );
}

export default App;
