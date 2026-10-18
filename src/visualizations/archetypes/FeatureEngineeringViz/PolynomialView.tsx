import { line } from 'd3-shape';
import { useMemo, useState } from 'react';
import { polynomialFeatureCount, polynomialRow } from '../../../lib/dataprep/features.ts';
import { leastSquares } from '../../../lib/dataprep/lifecycle.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ScatterFrame } from '../../shared/ScatterCharts.tsx';

const T_MIN = 5;
const T_MAX = 40;
const TEST = 60;
const DEGREES_PER_SECOND = 1.2;
const CURVE_POINTS = 120;
/**
 * Tiny ridge penalty: with fewer points than coefficients the normal equations
 * are singular, and this keeps the solve defined (close to the minimum norm
 * interpolant) without visibly changing well-posed fits.
 */
const RIDGE = 1e-12;

/** Daily electricity use against temperature: high when it is cold or hot. */
function consumption(t: number): number {
  return 50 + 0.15 * (t - 22) ** 2;
}

function sample(n: number, random: Random): [number, number][] {
  return Array.from({ length: n }, () => {
    const t = random.uniform(T_MIN, T_MAX);
    return [t, consumption(t) + random.normal(0, 6)];
  });
}

/** Maps temperature onto [-1, 1] so high powers stay numerically manageable. */
function unit(t: number): number {
  return (2 * (t - T_MIN)) / (T_MAX - T_MIN) - 1;
}

function rmse(points: readonly [number, number][], predict: (t: number) => number): number {
  return Math.sqrt(points.reduce((a, [t, y]) => a + (y - predict(t)) ** 2, 0) / points.length);
}

/**
 * A straight line cannot follow a U-shaped relation, but a linear model on
 * the features 1, x, x^2, ..., x^d can. The degree rises step by step:
 * training error keeps falling while test error eventually grows.
 */
export function PolynomialView({
  title,
  degree,
  n,
  seed: seed0,
}: {
  title: string;
  degree: number;
  n: number;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'grado',
      label: 'Grado máximo',
      min: 1,
      max: 12,
      step: 1,
      default: degree,
      symbol: 'd',
    },
    {
      type: 'number',
      key: 'n',
      label: 'Datos de entrenamiento',
      min: 8,
      max: 80,
      step: 1,
      default: n,
      symbol: 'n',
    },
  ];
  const parameters = useParameters(definitions);
  const maxDegree = Number(parameters.values.grado);
  const size = Number(parameters.values.n);
  const seed = useSeed(seed0);
  const { train, test } = useMemo(() => {
    const random = new Random(seed.seed);
    return { train: sample(size, random), test: sample(TEST, random) };
  }, [size, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [d, update] = useResettableState<number>(`${seed.seed}|${size}|${maxDegree}|${run}`, () =>
    reducedMotion ? maxDegree : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(maxDegree, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: DEGREES_PER_SECOND,
    done: d >= maxDegree,
  });
  const penalty = Array.from({ length: d + 1 }, (_, k) =>
    Array.from({ length: d + 1 }, (_, j) => (j === k ? Math.sqrt(RIDGE) : 0)),
  );
  const fit = leastSquares(
    [...train.map(([t]) => polynomialRow(unit(t), d)), ...penalty],
    [...train.map(([, y]) => y), ...penalty.map(() => 0)],
  );
  const predict = (t: number) =>
    polynomialRow(unit(t), d).reduce((a, v, k) => a + v * (fit?.coefficients[k] ?? 0), 0);
  const trainError = fit ? rmse(train, predict) : Number.NaN;
  const testError = fit ? rmse(test, predict) : Number.NaN;
  const g = (v: number) => formatNumber(v, 2);
  const features = Array.from({ length: d + 1 }, (_, k) =>
    k === 0 ? '1' : k === 1 ? 'x' : `x^{${k}}`,
  ).join(',\\ ');
  const header = `\\boldsymbol{\\phi}(x) = (${features}),\\quad \\binom{p + d}{d} = \\binom{1 + ${d}}{${d}} = ${polynomialFeatureCount(1, d)}`;
  const description = `Ajuste polinomial de grado ${d} con ${size} días de entrenamiento. Error cuadrático medio (raíz): ${g(trainError)} en entrenamiento y ${g(testError)} en prueba.`;
  const ys = [...train, ...test].map(([, y]) => y);
  const yDomain: [number, number] = [Math.min(...ys) - 10, Math.max(...ys) + 10];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Grado actual', value: String(d) },
        { label: 'Columnas del modelo', value: String(d + 1) },
        { label: 'Error en entrenamiento', value: g(trainError), color: DATA_COLORS.primary },
        { label: 'Error en prueba', value: g(testError), color: DATA_COLORS.highlight },
        {
          label: 'Columnas con 5 variables y este grado',
          value: String(polynomialFeatureCount(5, d)),
        },
      ]}
      legend={[
        { label: 'Días de entrenamiento', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Días de prueba', color: DATA_COLORS.neutral, shape: 'circle' },
        { label: 'Curva ajustada', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ScatterFrame
        xDomain={[T_MIN, T_MAX]}
        yDomain={yDomain}
        xLabel="Temperatura máxima (°C)"
        yLabel="Consumo eléctrico (kWh)"
        label={description}
      >
        {({ x, y }) => {
          const curve = Array.from(
            { length: CURVE_POINTS },
            (_, i) => T_MIN + ((T_MAX - T_MIN) * i) / (CURVE_POINTS - 1),
          );
          const path =
            line<number>()
              .x((t) => x(t))
              .y((t) => y(Math.max(yDomain[0], Math.min(yDomain[1], predict(t)))))(curve) ?? '';
          return (
            <g aria-hidden="true">
              {test.map(([t, v], i) => (
                <circle
                  key={`t${i}`}
                  cx={x(t)}
                  cy={y(v)}
                  r={3}
                  fill={DATA_COLORS.neutral}
                  fillOpacity={0.45}
                />
              ))}
              {train.map(([t, v], i) => (
                <circle key={`e${i}`} cx={x(t)} cy={y(v)} r={4.5} fill={DATA_COLORS.primary} />
              ))}
              <path d={path} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2.5} />
            </g>
          );
        }}
      </ScatterFrame>
    </VizFrame>
  );
}
