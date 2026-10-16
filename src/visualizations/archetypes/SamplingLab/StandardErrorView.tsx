import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { standardError } from '../../../lib/inference/sampling.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { makePopulation, POPULATION_NAMES } from './populations.ts';
import { POPULATIONS, type PopulationId } from './schema.ts';

const MU = 50;
const SIGMA = 10;
const REPETITIONS = 400;
const POINTS_PER_SECOND = 3;
const CURVE_POINTS = 120;

/** Sample sizes of the sweep: dense for small n, spaced out for large n. */
function sizes(nMax: number): number[] {
  const out: number[] = [];
  for (let n = 1; n <= nMax; n = n < 10 ? n + 1 : n < 40 ? n + 5 : n + 20) out.push(n);
  if (out[out.length - 1] !== nMax) out.push(nMax);
  return out;
}

interface StandardErrorViewProps {
  title: string;
  population: PopulationId;
  nMax: number;
  seed: SeedState;
}

/**
 * For a growing list of sample sizes, many samples are drawn and the spread
 * of their means is measured. The points fall on the curve sigma / sqrt(n):
 * quadrupling the sample size halves the standard error.
 */
export function StandardErrorView({ title, population: p0, nMax, seed }: StandardErrorViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'poblacion',
        label: 'Forma de la población',
        options: POPULATIONS.map((value) => ({ value, label: POPULATION_NAMES[value] })),
        default: p0,
      },
    ],
    [p0],
  );
  const parameters = useParameters(definitions);
  const id = String(parameters.values.poblacion) as PopulationId;
  const population = useMemo(() => makePopulation(id, MU, SIGMA), [id]);
  const ns = useMemo(() => sizes(nMax), [nMax]);
  const points = useMemo(() => {
    const random = new Random(seed.seed);
    return ns.map((n) => {
      const means = Array.from({ length: REPETITIONS }, () =>
        mean(Array.from({ length: n }, () => population.sample(random))),
      );
      return { n, se: standardDeviation(means), center: mean(means) };
    });
  }, [ns, population, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${id}|${seed.seed}|${run}`, () =>
    reducedMotion ? ns.length : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(ns.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= ns.length,
  });
  const last = points[shown - 1];
  const theory = last ? standardError(SIGMA, last.n) : SIGMA;
  const header = last
    ? `n = ${last.n}:\\quad \\widehat{\\text{EE}} = ${formatNumber(last.se, 3)},\\quad \\frac{\\sigma}{\\sqrt{n}} = \\frac{${SIGMA}}{\\sqrt{${last.n}}} = ${formatNumber(theory, 3)}`
    : '';
  const description =
    `Población ${POPULATION_NAMES[id].toLowerCase()} con media ${MU} y desviación ${SIGMA}. Para ${shown} tamaños de muestra se extrajeron ${REPETITIONS} muestras cada uno. ` +
    (last
      ? `Con n = ${last.n}, la desviación estándar de las medias es ${formatNumber(last.se, 3)} y sigma entre raíz de n vale ${formatNumber(theory, 3)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Tamaño de muestra n', value: last ? String(last.n) : '' },
        {
          label: 'Error estándar observado',
          value: last ? formatNumber(last.se, 3) : '',
          color: DATA_COLORS.secondary,
        },
        { label: 'σ / √n', value: formatNumber(theory, 3), color: DATA_COLORS.primary },
        { label: 'Media de las medias', value: last ? formatNumber(last.center, 3) : '' },
      ]}
      legend={[
        {
          label: 'Desviación estándar de 400 medias',
          color: DATA_COLORS.secondary,
          shape: 'circle',
        },
        { label: 'σ / √n', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 12, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, nMax])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, SIGMA * 1.15])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
            const n = 1 + ((nMax - 1) * i) / CURVE_POINTS;
            return `${x(n)},${y(standardError(SIGMA, n))}`;
          });
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={6}
                label="Error estándar de la media"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label="Tamaño de muestra n"
              />
              <g aria-hidden="true">
                <polyline
                  points={curve.join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                {points.slice(0, shown).map((p) => (
                  <circle key={p.n} cx={x(p.n)} cy={y(p.se)} r={4} fill={DATA_COLORS.secondary} />
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
