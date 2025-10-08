# Indicador Agregado FX (RSI + TSI)

Aplicación web construida con Vite + React + TypeScript que calcula un índice agregado de sobrecompra/sobreventa combinando los indicadores RSI (14) y TSI (25, 13) para múltiples pares de divisas. No requiere backend ni almacena datos localmente.

## Características principales

- Entrada editable con los 28 pares FX más negociados.
- Selección de `Daily`, `60m`, `30m` o `15m` como timeframe.
- Modo **Demo** con datos sintéticos y modo **Alpha Vantage** (requiere API key gratuita).
- Cálculo en memoria de RSI y TSI normalizados a \[-1, +1\], score medio por par y agregados globales.
- Métricas de índice global, breadth de sobrecompra/sobreventa y señal final.
- Tabla responsive y accesible con detalles por par.
- Sin cookies, localStorage ni persistencia de ningún tipo.

## Requisitos previos

- Node.js 18+
- npm 9+
- Clave gratuita de [Alpha Vantage](https://www.alphavantage.co/support/#api-key) si se desea usar el modo en vivo.

## Instalación

```bash
npm install
```

> **Nota:** si el registro público de npm no está accesible, instala las dependencias manualmente desde un mirror o consulta la documentación corporativa.

## Scripts disponibles

- `npm run dev` – Inicia el servidor de desarrollo en `http://localhost:5173`.
- `npm run build` – Genera la versión de producción en la carpeta `dist/`.
- `npm run preview` – Sirve la build generada localmente.
- `npm test` – Ejecuta la suite de Vitest.

## Variables de entorno

Crea un archivo `.env` (no se versiona) basado en `.env.example`.

```bash
cp .env.example .env
```

Completa `ALPHA_VANTAGE_KEY` con tu clave cuando uses el modo Alpha Vantage.

## Uso

1. Inicia la app (`npm run dev`).
2. Revisa o ajusta la lista de pares en el textarea.
3. Selecciona el timeframe y la fuente de datos.
4. Si eliges Alpha Vantage, introduce tu API key.
5. Pulsa **Calcular**. La app descargará cada serie de precios de forma secuencial (1.4 s entre peticiones para respetar el rate limit) y mostrará resultados.

Los cálculos del modo Demo se generan con una caminata aleatoria suave para probar la UI sin depender de la API.

## Fórmulas implementadas

- **RSI (14):** media móvil exponencial de ganancias/pérdidas y normalización `(RSI - 50) / 50`.
- **TSI (25, 13):** doble EMA del momentum y normalización `clamp(-100, 100) / 100`.
- **Score por par:** media de los scores normalizados.
- **Índice global:** media de scores válidos.
- **Breadth:** porcentaje de pares con score > 0.7 (sobrecompra) y score < -0.7 (sobreventa).
- **Señal:**
  - `SOBRECOMPRA` si índice > 0.6 y ≥ 60 % de pares en sobrecompra.
  - `SOBREVENTA` si índice < -0.6 y ≥ 60 % de pares en sobreventa.
  - `NEUTRAL` en cualquier otro caso.

## Pares por defecto

```
EURUSD
GBPUSD
AUDUSD
NZDUSD
USDJPY
USDCHF
USDCAD
EURGBP
EURAUD
EURNZD
EURCAD
EURCHF
EURJPY
GBPAUD
GBPNZD
GBPCAD
GBPCHF
GBPJPY
AUDNZD
AUDCAD
AUDCHF
AUDJPY
NZDCAD
NZDCHF
NZDJPY
CADCHF
CADJPY
CHFJPY
```

## Arquitectura del código

```
src/
├─ App.tsx                # Contenedor principal y lógica de orquestación
├─ main.tsx               # Punto de entrada React
├─ components/
│  ├─ DataTable.tsx       # Tabla accesible con los resultados por par
│  └─ Metrics.tsx         # Tarjetas con métricas globales
├─ config/
│  └─ pairs.ts            # Lista de pares por defecto
├─ services/
│  ├─ dataProviders.ts    # Fetch Alpha Vantage + generador sintético
│  └─ indicators.ts       # RSI, TSI y helpers de score
├─ utils/
│  └─ math.ts             # clamp, ema, diff, mean (puras)
└─ styles/
   └─ app.css             # Estilos globales y layout
```

Las pruebas unitarias se ubican junto a los módulos (`*.test.ts`).

## Troubleshooting

- **Rate limit de Alpha Vantage:** aparecerá un mensaje de error. Espera unos segundos y vuelve a intentar o usa el modo Demo.
- **Series insuficientes:** si un par devuelve pocos datos, se mostrará "—" en sus métricas.
- **Fallo de dependencias:** asegúrate de tener acceso al registro de npm o usa un mirror autorizado.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Revisa `LICENSE` para más detalles.
