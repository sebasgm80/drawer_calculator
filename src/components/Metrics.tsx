import type { GlobalSignal } from "../types";

interface MetricsProps {
  globalScore: number | null;
  overPct: number;
  underPct: number;
  signal: GlobalSignal;
  totalPairs: number;
}

const signalLabels: Record<GlobalSignal, string> = {
  SOBRECOMPRA: "SOBRECOMPRA",
  SOBREVENTA: "SOBREVENTA",
  NEUTRAL: "NEUTRAL",
};

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

function formatScore(value: number | null): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(2);
}

export function Metrics({ globalScore, overPct, underPct, signal, totalPairs }: MetricsProps) {
  return (
    <section className="metrics" aria-label="Métricas globales">
      <article className="metric-card">
        <h3>Índice global</h3>
        <p>{formatScore(globalScore)}</p>
        <span className="metric-subtitle">Media de scores (n={totalPairs})</span>
      </article>
      <article className="metric-card">
        <h3>% Sobrecompra</h3>
        <p>{formatPercentage(overPct)}</p>
        <span className="metric-subtitle">Score &gt; 0.7</span>
      </article>
      <article className="metric-card">
        <h3>% Sobreventa</h3>
        <p>{formatPercentage(underPct)}</p>
        <span className="metric-subtitle">Score &lt; -0.7</span>
      </article>
      <article className="metric-card">
        <h3>Señal</h3>
        <p className={`signal signal-${signal.toLowerCase()}`}>{signalLabels[signal]}</p>
        <span className="metric-subtitle">Según umbrales configurados</span>
      </article>
    </section>
  );
}

export default Metrics;
