import { scaleLinear, scaleLog } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  adjustForPopulation,
  criticalValue,
  initialSampleSize,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PrecisionPlanner.module.css';
import { CONFIDENCE_OPTIONS, type SizeConfig } from './schema.ts';

const SWEEP_STEPS = 40;

/** Ticks at 1, 2 and 5 times each power of ten inside the domain, thinned when there are many. */
function logTicks(lo: number, hi: number): number[] {
  const ticks: number[] = [];
  for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e += 1) {
    for (const m of [1, 2, 5]) {
      const v = m * 10 ** e;
      if (v >= lo && v <= hi) ticks.push(v);
    }
  }
  return ticks.length > 8 ? ticks.filter((v) => Math.abs(Math.log10(v) % 1) < 1e-9) : ticks;
}
const STEPS_PER_SECOND = 12;
const CURVE_POINTS = 120;

/** Required sample size as a function of the margin of error, swept from loose to tight. */
export function SizeView({ config, title }: { config: SizeConfig; title: string }) {
  const proportion = config.tipo === 'proporcion';
  const maxMargin = config.margenMaximo ?? config.margen * 4;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'E',
        label: 'Margen de error deseado',
        symbol: 'E',
        min: maxMargin / 40,
        max: maxMargin,
        step: maxMargin / 400,
        default: config.margen,
        digits: proportion ? 3 : 2,
        ...(config.unidad ? { unit: config.unidad } : {}),
      },
      {
        type: 'select',
        key: 'confianza',
        label: 'Nivel de confianza',
        options: CONFIDENCE_OPTIONS,
        default: String(config.confianza),
      },
      proportion
        ? {
            type: 'number',
            key: 'p',
            label: 'Proporción anticipada',
            symbol: 'p',
            min: 0.05,
            max: 0.95,
            step: 0.01,
            default: config.p ?? 0.5,
            digits: 2,
          }
        : {
            type: 'number',
            key: 'S',
            label: 'Desviación estándar anticipada',
            symbol: 'S',
            min: (config.S ?? 1) / 4,
            max: (config.S ?? 1) * 3,
            step: (config.S ?? 1) / 40,
            default: config.S ?? 1,
            digits: 2,
          },
      ...(config.deff !== undefined
        ? [
            {
              type: 'number' as const,
              key: 'deff',
              label: 'Efecto de diseño',
              symbol: 'deff',
              min: 1,
              max: 5,
              step: 0.1,
              default: config.deff,
              digits: 1,
            },
          ]
        : []),
    ],
    // Static frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const E = Number(values.E);
  const conf = Number(values.confianza);
  const variance = proportion ? Number(values.p) * (1 - Number(values.p)) : Number(values.S) ** 2;
  const deff = Number(values.deff ?? 1);
  const N = config.N ?? null;
  const z = criticalValue(conf);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [sweep, update] = useResettableState<number>(`${run}`, () =>
    reducedMotion ? SWEEP_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(SWEEP_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: sweep >= SWEEP_STEPS,
  });
  // The marker slides from the loosest margin to the chosen one.
  const shownE = maxMargin + ((E - maxMargin) * sweep) / SWEEP_STEPS;
  const n0 = initialSampleSize(variance, shownE, conf) * deff;
  const n = adjustForPopulation(n0, N);
  const varTex = proportion
    ? `${formatNumber(Number(values.p), 2)}\\,(1 - ${formatNumber(Number(values.p), 2)})`
    : `${formatNumber(Number(values.S), 2)}^2`;
  const header =
    `n_0 = \\frac{z^2\\,${proportion ? 'p(1-p)' : 'S^2'}}{E^2}${deff !== 1 ? '\\,\\text{deff}' : ''} = \\frac{${formatNumber(z, 3)}^2 \\cdot ${varTex}}{${formatNumber(shownE, proportion ? 3 : 2)}^2}${deff !== 1 ? ` \\cdot ${formatNumber(deff, 1)}` : ''} = ${formatNumber(n0, 1)}` +
    (N !== null
      ? `,\\quad n = \\frac{n_0}{1 + n_0/N} = \\frac{${formatNumber(n0, 1)}}{1 + ${formatNumber(n0, 1)}/${N}} \\to ${n}`
      : `\\to n = ${n}`);
  const unit = config.unidad ? ` ${config.unidad}` : '';
  const curve = (finite: boolean) =>
    Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
      const e = maxMargin / 40 + ((maxMargin - maxMargin / 40) * i) / CURVE_POINTS;
      const raw = initialSampleSize(variance, e, conf) * deff;
      return { x: e, y: finite && N !== null ? raw / (1 + raw / N) : raw };
    });
  const infinite = curve(false);
  const finite = N !== null ? curve(true) : null;
  const description =
    `Para un margen de ${formatNumber(shownE, 3)}${unit} con ${formatNumber(conf * 100, 0)} % de confianza se necesitan ${n} ${proportion ? 'personas' : 'unidades'}` +
    (N !== null ? ` en una población de ${N}.` : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Valor crítico z', value: formatNumber(z, 3) },
        { label: 'Margen de error', value: `${formatNumber(shownE, proportion ? 3 : 2)}${unit}` },
        {
          label: 'Tamaño sin corrección n₀',
          value: formatNumber(n0, 1),
          color: DATA_COLORS.secondary,
        },
        ...(N !== null ? [{ label: 'Tamaño de la población N', value: String(N) }] : []),
        { label: 'Tamaño de muestra necesario', value: String(n), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Población infinita', color: DATA_COLORS.secondary, shape: 'line' },
        ...(N !== null
          ? [{ label: `Población de ${N}`, color: DATA_COLORS.primary, shape: 'line' as const }]
          : []),
        { label: 'Margen elegido', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {sweep < SWEEP_STEPS
          ? 'El margen se reduce: el tamaño necesario crece como 1/E²'
          : `Reducir el margen a la mitad cuadruplica el tamaño de muestra`}
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={380}
        margins={{ left: 60, bottom: 44, top: 20 }}
      >
        {(box) => {
          const yMax = Math.max(...infinite.map((p) => p.y));
          const yMin = Math.max(
            1,
            Math.min(...infinite.map((p) => p.y), ...(finite ?? []).map((p) => p.y)),
          );
          const x = scaleLinear()
            .domain([0, maxMargin])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLog()
            .domain([yMin * 0.8, yMax * 1.2])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const px = x(shownE);
          const py = y(Math.max(yMin * 0.8, n));
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                tickValues={logTicks(yMin * 0.8, yMax * 1.2)}
                format={(v) => formatNumber(v, 0)}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label={`Margen de error E${unit ? ` (${config.unidad})` : ''}`}
              />
              <CurvePath
                points={infinite}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                width={2.5}
              />
              {finite && (
                <CurvePath
                  points={finite}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={2.5}
                />
              )}
              <line
                x1={px}
                x2={px}
                y1={py}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.highlight}
                strokeDasharray="4 3"
              />
              <line
                x1={box.inner.left}
                x2={px}
                y1={py}
                y2={py}
                stroke={DATA_COLORS.highlight}
                strokeDasharray="4 3"
              />
              <circle
                cx={px}
                cy={py}
                r={7}
                fill={DATA_COLORS.highlight}
                stroke={DATA_COLORS.text}
              />
              <text x={px + 10} y={py - 10} className={styles.label}>{`n = ${n}`}</text>
              <text x={box.inner.left + 4} y={box.inner.top + 12} className={styles.labelMuted}>
                Tamaño de muestra (escala logarítmica)
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
