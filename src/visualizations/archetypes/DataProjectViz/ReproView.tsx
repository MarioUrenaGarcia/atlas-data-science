import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { distinctCount, reproRunConfig, runAnalysis } from '../../../lib/dataprep/lifecycle.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';
import type { ReproFactor } from './schema.ts';

const RUNS_PER_SECOND = 1.5;
const FACTOR_NAMES: Record<ReproFactor, string> = {
  semilla: 'semilla',
  datos: 'versión de datos',
  codigo: 'versión de código',
};

/**
 * The same analysis executed repeatedly. Every factor left free (random
 * seed, a dataset that keeps changing, edited code) spreads the reported
 * slope; pinning all three makes every run return the same number.
 */
export function ReproView({
  title,
  fixed,
  runs,
}: {
  title: string;
  fixed: readonly ReproFactor[];
  runs: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'toggle',
      key: 'semilla',
      label: 'Fijar la semilla aleatoria',
      default: fixed.includes('semilla'),
    },
    {
      type: 'toggle',
      key: 'datos',
      label: 'Fijar la versión de los datos',
      default: fixed.includes('datos'),
    },
    {
      type: 'toggle',
      key: 'codigo',
      label: 'Fijar la versión del código',
      default: fixed.includes('codigo'),
    },
  ];
  const parameters = useParameters(definitions);
  const pinned = useMemo(() => {
    const set = new Set<ReproFactor>();
    if (parameters.values.semilla) set.add('semilla');
    if (parameters.values.datos) set.add('datos');
    if (parameters.values.codigo) set.add('codigo');
    return set;
  }, [parameters.values.semilla, parameters.values.datos, parameters.values.codigo]);
  const results = useMemo(
    () =>
      Array.from({ length: runs }, (_, i) => {
        const config = reproRunConfig(i, runs, {
          seed: pinned.has('semilla'),
          data: pinned.has('datos'),
          code: pinned.has('codigo'),
        });
        return { config, result: runAnalysis(config) };
      }),
    [runs, pinned],
  );
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState(`${[...pinned].join()}|${runs}|${run}`, () =>
    reducedMotion ? runs : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(runs, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: RUNS_PER_SECOND,
    done: shown >= runs,
  });
  const visible = results.slice(0, shown);
  const slopes = visible.map((r) => r.result.slope);
  const distinct = distinctCount(slopes, 4);
  const low = Math.min(...slopes);
  const high = Math.max(...slopes);
  const current = visible[visible.length - 1];
  const g = (v: number) => formatNumber(v, 3);
  const header = current
    ? `\\hat{\\beta}_1^{(${shown})} = ${g(current.result.slope)}\\quad(\\text{semilla } ${current.config.seed},\\ \\text{datos v}${current.config.dataVersion + 1},\\ \\text{código v}${current.config.codeVersion})`
    : '';
  const description =
    `Corridas mostradas: ${shown} de ${runs}. Resultados distintos: ${distinct}. ` +
    `Pendiente reportada entre ${g(low)} y ${g(high)} puntos por hora. ` +
    `Factores fijados: ${pinned.size === 0 ? 'ninguno' : [...pinned].map((f) => FACTOR_NAMES[f]).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Corridas', value: `${shown} de ${runs}` },
        { label: 'Resultados distintos', value: String(distinct), color: DATA_COLORS.highlight },
        { label: 'Pendiente mínima', value: g(low) },
        { label: 'Pendiente máxima', value: g(high) },
      ]}
      legend={[
        {
          label: 'Pendiente reportada en cada corrida',
          color: DATA_COLORS.primary,
          shape: 'circle',
        },
        { label: 'Corrida actual', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Configuración y resultado de cada corrida',
        columns: [
          'Corrida',
          'Semilla',
          'Versión de datos',
          'Versión de código',
          'Filas de entrenamiento',
          'Pendiente',
        ],
        rows: results.map((r, i) => [
          i + 1,
          r.config.seed,
          r.config.dataVersion + 1,
          r.config.codeVersion,
          r.result.rows,
          g(r.result.slope),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        Análisis: horas de estudio contra calificación, con partición aleatoria de 70 % para
        entrenamiento y pendiente por mínimos cuadrados.
      </p>
      <ChartSvg
        label={description}
        aspect={0.42}
        minHeight={220}
        maxHeight={320}
        margins={{ top: 12, right: 16, bottom: 44, left: 60 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleLinear()
            .domain([0.5, runs + 0.5])
            .range([left, left + width]);
          const allSlopes = results.map((r) => r.result.slope);
          const lo = Math.min(...allSlopes);
          const hi = Math.max(...allSlopes);
          const pad = Math.max(0.05, (hi - lo) * 0.2);
          const y = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([top + height, top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={5}
                label="Pendiente"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                ticks={Math.min(runs, 10)}
                format={(v) => (Number.isInteger(v) ? String(v) : '')}
                label="Corrida"
              />
              <g aria-hidden="true">
                {visible.map((r, i) => (
                  <circle
                    key={i}
                    cx={x(i + 1)}
                    cy={y(r.result.slope)}
                    r={i === shown - 1 ? 7 : 5}
                    fill={i === shown - 1 ? DATA_COLORS.highlight : DATA_COLORS.primary}
                    fillOpacity={0.85}
                  />
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
