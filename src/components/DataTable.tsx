import type { PairRow } from "../types";

type TableStatus = "Sobrecompra" | "Sobreventa" | "Neutral" | "Sin datos";

function formatValue(value: number | null, decimals = 2): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(decimals);
}

function rowStatus(score: number | null): TableStatus {
  if (score == null) {
    return "Sin datos";
  }
  if (score > 0.7) {
    return "Sobrecompra";
  }
  if (score < -0.7) {
    return "Sobreventa";
  }
  return "Neutral";
}

interface DataTableProps {
  rows: PairRow[];
}

export function DataTable({ rows }: DataTableProps) {
  if (rows.length === 0) {
    return (
      <p role="status" className="empty-table">
        No hay resultados todavía. Configura los parámetros y pulsa “Calcular”.
      </p>
    );
  }

  return (
    <div className="table-wrapper" role="region" aria-label="Resultados por par">
      <table>
        <caption className="sr-only">Scores de indicadores por par de divisas</caption>
        <thead>
          <tr>
            <th scope="col">Par</th>
            <th scope="col">RSI (14)</th>
            <th scope="col">TSI (25,13)</th>
            <th scope="col">Score [-1, +1]</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.pair}>
              <th scope="row">{row.pair}</th>
              <td>{formatValue(row.rsi)}</td>
              <td>{formatValue(row.tsi)}</td>
              <td>{formatValue(row.score, 3)}</td>
              <td>{rowStatus(row.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
