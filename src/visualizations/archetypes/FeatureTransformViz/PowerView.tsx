import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  optimalLambda,
  type PowerFamily,
  powerTransform,
  profileLogLikelihood,
} from '../../../lib/stats/eda.ts';
import { histogram, mean, skewness, standardDeviation } from '../../../lib/stats/index.ts';
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
import styles from './FeatureTransformViz.module.css';
import { HistBars } from './marks.tsx';

const LAMBDA_LO = -2;
const LAMBDA_HI = 3;
const LAMBDA_STEP = 0.1;
const SWEEP_PER_SECOND = 10;
const BINS = 18;
const CURVE_POINTS = 120;

const FAMILY_NAMES: Record<PowerFamily, string> = {
  'box-cox': 'Box-Cox',
  'yeo-johnson': 'Yeo-Johnson',
};

function lambdaTex(family: PowerFamily, lambda: number): string {
  const l = formatNumber(lambda, 2);
  if (family === 'box-cox') {
    return Math.abs(lambda) < 0.005 ? 'y = \\log x' : `y = \\frac{x^{${l}} - 1}{${l}}`;
  }
  return `y = \\begin{cases} \\frac{(x + 1)^{${l}} - 1}{${l}} & x \\ge 0 \\\\ -\\frac{(1 - x)^{${formatNumber(2 - lambda, 2)}} - 1}{${formatNumber(2 - lambda, 2)}} & x < 0 \\end{cases}`;
}

interface PowerViewProps {
  title: string;
  family: PowerFamily;
  values: number[];
  label: string;
  lambda?: number;
}

/**
 * A sweep of lambda draws the profile log-likelihood curve while the
 * histogram of the transformed data changes shape; the sweep ends at the
 * lambda that makes the transformed data closest to normal. Afterwards the
 * slider sets lambda by hand.
 */
export function PowerView({ title, family, values, label, lambda: lambda0 }: PowerViewProps) {
  const data = useMemo(
    () => (family === 'box-cox' ? values.filter((x) => x > 0) : values),
    [family, values],
  );
  const best = useMemo(() => optimalLambda(family, data), [family, data]);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'lambda',
        label: 'Parámetro de la transformación',
        symbol: 'λ',
        min: LAMBDA_LO,
        max: LAMBDA_HI,
        step: 0.05,
        default: lambda0 ?? Math.round(best * 20) / 20,
        digits: 2,
      },
    ],
    [lambda0, best],
  );
  const parameters = useParameters(definitions);
  const manual = Number(parameters.values.lambda);
  const steps = Math.round((LAMBDA_HI - LAMBDA_LO) / LAMBDA_STEP);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [frame, setFrame] = useResettableState<number>(`${family}|${run}`, () =>
    reducedMotion ? steps : 0,
  );
  const playback = usePlayback({
    step: () => setFrame((v) => Math.min(steps, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: SWEEP_PER_SECOND,
    done: frame >= steps,
  });
  const sweeping = frame < steps;
  const lambda = sweeping ? LAMBDA_LO + frame * LAMBDA_STEP : manual;
  const transformed = data.map((x) => powerTransform(family, x, lambda));
  const m = mean(transformed);
  const s = standardDeviation(transformed);
  const curve = useMemo(
    () =>
      Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
        const l = LAMBDA_LO + ((LAMBDA_HI - LAMBDA_LO) * i) / CURVE_POINTS;
        return { l, ll: profileLogLikelihood(family, data, l) };
      }),
    [family, data],
  );
  const ll = profileLogLikelihood(family, data, lambda);
  const g1 = skewness(data);
  const g1t = skewness(transformed);
  const header = `${lambdaTex(family, lambda)},\\quad \\ell(\\lambda) = ${formatNumber(ll, 1)},\\quad \\hat{\\lambda} = ${formatNumber(best, 3)}`;
  const description =
    `Transformación de ${FAMILY_NAMES[family]} de ${data.length} valores de ${label} con lambda ${formatNumber(lambda, 2)}${sweeping ? ' (barrido en curso)' : ''}. ` +
    `Lambda óptimo ${formatNumber(best, 3)}. Asimetría original ${formatNumber(g1, 2)}, transformada ${formatNumber(g1t, 2)}.`;
  const lo = Math.min(...transformed);
  const hi = Math.max(...transformed);
  const padT = (hi - lo) * 0.05 || 1;
  const domain: [number, number] = [lo - padT, hi + padT];
  const bins = histogram(transformed, BINS, domain);
  const binWidth = (domain[1] - domain[0]) / BINS;
  const peak = Math.max(
    ...bins.map((b) => b.count),
    (transformed.length * binWidth) / (s * Math.sqrt(2 * Math.PI)),
  );
  const finite = curve.filter((p) => Number.isFinite(p.ll));
  const llLo = Math.min(...finite.map((p) => p.ll));
  const llHi = Math.max(...finite.map((p) => p.ll));

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, disabled: sweeping ? ['lambda'] : [] }}
      readouts={[
        { label: 'λ en uso', value: formatNumber(lambda, 2), color: DATA_COLORS.secondary },
        { label: 'λ óptimo', value: formatNumber(best, 3), color: DATA_COLORS.highlight },
        { label: 'Log-verosimilitud perfil', value: formatNumber(ll, 2) },
        { label: 'Asimetría original', value: formatNumber(g1, 3) },
        { label: 'Asimetría transformada', value: formatNumber(g1t, 3) },
      ]}
      legend={[
        { label: 'Datos transformados', color: DATA_COLORS.secondary },
        { label: 'Normal con la misma media y desviación', color: DATA_COLORS.text, shape: 'line' },
        { label: 'λ óptimo', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <ChartSvg
          label={`Histograma de los datos transformados. ${description}`}
          aspect={0.75}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 12, right: 12, bottom: 44, left: 16 }}
        >
          {(box) => {
            const x = scaleLinear()
              .domain(domain)
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const base = box.inner.top + box.inner.height;
            const scaleY = (count: number) => (box.inner.height * 0.95 * count) / peak;
            const pts = Array.from({ length: 80 }, (_, i) => {
              const v = domain[0] + ((domain[1] - domain[0]) * i) / 79;
              const density = Math.exp(-(((v - m) / s) ** 2) / 2) / (s * Math.sqrt(2 * Math.PI));
              return `${x(v)},${base - scaleY(density * transformed.length * binWidth)}`;
            });
            return (
              <g>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={base}
                  ticks={5}
                  label={`${label} transformada`}
                />
                <HistBars
                  values={transformed}
                  bins={BINS}
                  domain={domain}
                  x={x}
                  base={base}
                  height={box.inner.height * 0.95}
                  maxCount={peak}
                  color={DATA_COLORS.secondary}
                />
                <polyline
                  points={pts.join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </g>
            );
          }}
        </ChartSvg>
        <ChartSvg
          label={`Log-verosimilitud perfil en función de lambda, máxima en ${formatNumber(best, 2)}.`}
          aspect={0.75}
          minHeight={240}
          maxHeight={360}
          margins={{ top: 12, right: 16, bottom: 44, left: 56 }}
        >
          {(box) => {
            const x = scaleLinear()
              .domain([LAMBDA_LO, LAMBDA_HI])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([llLo - (llHi - llLo) * 0.05, llHi + (llHi - llLo) * 0.08])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const drawn = finite.filter((p) => p.l <= lambda + 1e-9 || !sweeping);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="ℓ(λ)"
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={6}
                  label="λ"
                />
                <g aria-hidden="true">
                  <polyline
                    points={drawn.map((p) => `${x(p.l)},${y(p.ll)}`).join(' ')}
                    fill="none"
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2.5}
                  />
                  {!sweeping && (
                    <line
                      x1={x(best)}
                      x2={x(best)}
                      y1={box.inner.top}
                      y2={box.inner.top + box.inner.height}
                      stroke={DATA_COLORS.highlight}
                      strokeDasharray="5 3"
                      strokeWidth={2}
                    />
                  )}
                  <circle cx={x(lambda)} cy={y(ll)} r={6} fill={DATA_COLORS.secondary} />
                </g>
              </g>
            );
          }}
        </ChartSvg>
      </div>
    </VizFrame>
  );
}
