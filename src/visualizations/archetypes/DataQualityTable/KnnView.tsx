import { useMemo, useState } from 'react';
import { knnImpute } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, pearson, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ScatterFrame } from '../../shared/ScatterCharts.tsx';
import { MECHANISM_LABELS, padded, SCENARIO, scenarioPoints } from './missingData.ts';
import { MECHANISMS, type MechanismId } from './schema.ts';

const IMPUTATIONS_PER_SECOND = 2;

interface KnnViewProps {
  title: string;
  k: number;
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  seed: number;
}

function rmse(errors: readonly number[]): number {
  return errors.length === 0 ? Number.NaN : Math.sqrt(mean(errors.map((e) => e * e)));
}

/**
 * Each missing income is filled with the average income of the k people
 * whose age is closest. The current case shows its neighbors; imputed points
 * follow the trend instead of collapsing onto one value.
 */
export function KnnView(props: KnnViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'k',
      label: 'Número de vecinos',
      min: 1,
      max: 20,
      step: 1,
      default: props.k,
      symbol: 'k',
    },
    {
      type: 'select',
      key: 'mecanismo',
      label: 'Mecanismo de los faltantes',
      options: MECHANISMS.map((m) => ({ value: m, label: MECHANISM_LABELS[m] })),
      default: props.mechanism,
    },
    {
      type: 'number',
      key: 'tasa',
      label: 'Proporción de faltantes',
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: props.rate,
      digits: 2,
    },
  ];
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const mechanism = String(parameters.values.mecanismo) as MechanismId;
  const rate = Number(parameters.values.tasa);
  const seed = useSeed(props.seed);
  const points = useMemo(
    () =>
      scenarioPoints({ mechanism, rate, strength: props.strength, n: props.n, seed: seed.seed }),
    [mechanism, rate, props.strength, props.n, seed.seed],
  );
  const missingIdx = useMemo(() => points.flatMap((p, i) => (p.missing ? [i] : [])), [points]);
  const imputations = useMemo(
    () => missingIdx.map((i) => knnImpute(points, i, k)),
    [missingIdx, points, k],
  );
  const total = missingIdx.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${seed.seed}|${mechanism}|${rate}|${run}`,
    () => (reducedMotion ? total : 0),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: IMPUTATIONS_PER_SECOND,
    done: shown >= total,
  });
  const observed = points.filter((p) => !p.missing);
  const meanFill = mean(observed.map((p) => p.y));
  const done = imputations.slice(0, shown);
  const errorsKnn = done.map((imp, j) => imp.value - (points[missingIdx[j] ?? 0]?.y ?? 0));
  const errorsMean = done.map((_, j) => meanFill - (points[missingIdx[j] ?? 0]?.y ?? 0));
  const completed = points.map((p, i) => {
    const j = missingIdx.indexOf(i);
    return p.missing ? (j < shown ? (imputations[j]?.value ?? Number.NaN) : Number.NaN) : p.y;
  });
  const usable = points.flatMap((p, i) =>
    Number.isNaN(completed[i] ?? Number.NaN) ? [] : [[p.x, completed[i] ?? 0]],
  );
  const currentJ = shown - 1;
  const current = currentJ >= 0 ? imputations[currentJ] : undefined;
  const target = currentJ >= 0 ? points[missingIdx[currentJ] ?? 0] : undefined;
  const g = (v: number) => formatNumber(v, 2);
  const neighborValues = current ? current.neighbors.map((i) => g(points[i]?.y ?? 0)) : [];
  const header = current
    ? `\\hat{y}_{${(missingIdx[currentJ] ?? 0) + 1}} = \\frac{1}{${k}}\\left(${neighborValues.slice(0, 5).join(' + ')}${neighborValues.length > 5 ? ' + \\dots' : ''}\\right) = ${g(current.value)}`
    : `\\hat{y}_i = \\frac{1}{k}\\sum_{j \\in N_k(i)} y_j`;
  const description =
    `Imputación por los ${k} vecinos más cercanos en edad: ${shown} de ${total} faltantes imputados. ` +
    `Error cuadrático medio contra los valores ocultos: ${g(rmse(errorsKnn))} con vecinos y ${g(rmse(errorsMean))} con la media.`;

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Imputados', value: `${shown} de ${total}` },
        {
          label: 'Error con k vecinos (RECM)',
          value: g(rmse(errorsKnn)),
          color: DATA_COLORS.negative,
        },
        { label: 'Error con la media (RECM)', value: g(rmse(errorsMean)) },
        {
          label: 'Desviación estándar tras imputar',
          value: g(standardDeviation(usable.map((u) => u[1] ?? 0))),
        },
        {
          label: 'Correlación con la edad tras imputar',
          value: g(
            pearson(
              usable.map((u) => u[0] ?? 0),
              usable.map((u) => u[1] ?? 0),
            ),
          ),
        },
      ]}
      legend={[
        { label: 'Ingreso observado', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Ingreso imputado', color: DATA_COLORS.negative, shape: 'circle' },
        { label: 'Vecinos del caso actual', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Faltante por imputar (marca en la edad)', color: DATA_COLORS.negative },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ScatterFrame
        xDomain={padded(points.map((p) => p.x))}
        yDomain={padded(points.map((p) => p.y))}
        xLabel={`${SCENARIO.xName} (${SCENARIO.xUnit})`}
        yLabel={`${SCENARIO.yName} (${SCENARIO.yUnit})`}
        label={description}
      >
        {({ x, y, bottom }) => (
          <g aria-hidden="true">
            {observed.map((p, i) => (
              <circle
                key={`o${i}`}
                cx={x(p.x)}
                cy={y(p.y)}
                r={3.5}
                fill={DATA_COLORS.primary}
                fillOpacity={0.55}
              />
            ))}
            {missingIdx.map((idx, j) => {
              const p = points[idx];
              if (!p) return null;
              return j < shown ? (
                <circle
                  key={`m${idx}`}
                  cx={x(p.x)}
                  cy={y(imputations[j]?.value ?? 0)}
                  r={4.5}
                  fill={DATA_COLORS.negative}
                />
              ) : (
                <rect
                  key={`m${idx}`}
                  x={x(p.x) - 1.5}
                  y={bottom - 10}
                  width={3}
                  height={10}
                  fill={DATA_COLORS.negative}
                />
              );
            })}
            {current && target && (
              <g>
                {current.neighbors.map((i) => {
                  const nb = points[i];
                  return nb ? (
                    <g key={i}>
                      <line
                        x1={x(target.x)}
                        y1={y(current.value)}
                        x2={x(nb.x)}
                        y2={y(nb.y)}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={1.2}
                      />
                      <circle
                        cx={x(nb.x)}
                        cy={y(nb.y)}
                        r={5}
                        fill="none"
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2}
                      />
                    </g>
                  ) : null;
                })}
                <circle
                  cx={x(target.x)}
                  cy={y(current.value)}
                  r={7}
                  fill="none"
                  stroke={DATA_COLORS.negative}
                  strokeWidth={2.5}
                />
              </g>
            )}
          </g>
        )}
      </ScatterFrame>
    </VizFrame>
  );
}
