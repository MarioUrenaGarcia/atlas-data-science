import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import {
  criticalValue,
  marginOfErrorProportion,
  simulatePolls,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PrecisionPlanner.module.css';
import { CONFIDENCE_OPTIONS, type MarginConfig } from './schema.ts';

const POLLS_PER_SECOND = 3;
const DEFAULT_POLLS = 40;

/** Repeated polls, each reported with its margin of error, against the true proportion. */
export function MarginView({
  config,
  title,
  conceptId,
}: {
  config: MarginConfig;
  title: string;
  conceptId: string;
}) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Personas por encuesta',
        symbol: 'n',
        min: 20,
        max: Math.max(3000, config.n),
        step: 10,
        default: config.n,
      },
      {
        type: 'select',
        key: 'confianza',
        label: 'Nivel de confianza',
        options: CONFIDENCE_OPTIONS,
        default: String(config.confianza),
      },
      {
        type: 'number',
        key: 'p',
        label: 'Proporción real en la población',
        symbol: 'p',
        min: 0.05,
        max: 0.95,
        step: 0.01,
        default: config.p,
        digits: 2,
      },
    ],
    // Static frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const conf = Number(parameters.values.confianza);
  const p = Number(parameters.values.p);
  const count = config.encuestas ?? DEFAULT_POLLS;
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const polls = useMemo(
    () => simulatePolls(p, n, conf, count, new Random(seed.seed + run * 7919)),
    [p, n, conf, count, seed.seed, run],
  );
  const [shown, update] = useResettableState(`${p}|${n}|${conf}|${seed.seed}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((v) => Math.min(count, v + 1)),
    stepMany: (k) => update((v) => Math.min(count, v + k)),
    reset: () => setRun((v) => v + 1),
    rate: POLLS_PER_SECOND,
    done: shown >= count,
  });
  const visible = polls.slice(0, shown);
  const last = visible[visible.length - 1];
  const covered = visible.filter((poll) => poll.covers).length;
  const z = criticalValue(conf);
  const theoretical = marginOfErrorProportion(p, n, conf);
  const header = last
    ? `E = z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}} = ${formatNumber(z, 3)}\\sqrt{\\frac{${formatNumber(last.estimate, 3)}\\,(1 - ${formatNumber(last.estimate, 3)})}{${n}}} = ${formatNumber(last.margin, 4)}`
    : `E = z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}`;
  const pct = (v: number) => `${formatNumber(v * 100, 1)} %`;
  const description =
    `${visible.length} encuestas de ${n} personas sobre ${config.variable.toLowerCase()}; proporción real ${pct(p)}. ` +
    (last ? `La última estima ${pct(last.estimate)} más o menos ${pct(last.margin)}. ` : '') +
    `${covered} de ${visible.length} intervalos contienen el valor real.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Proporción real', value: pct(p), color: DATA_COLORS.primary },
        {
          label: 'Última estimación',
          value: last ? `${pct(last.estimate)} ± ${pct(last.margin)}` : 'sin datos',
          color: DATA_COLORS.highlight,
        },
        { label: 'Margen de error teórico', value: pct(theoretical) },
        {
          label: 'Encuestas que contienen el valor real',
          value: `${covered} de ${visible.length}`,
        },
        {
          label: 'Porcentaje de cobertura',
          value: visible.length ? pct(covered / visible.length) : 'sin datos',
          color: DATA_COLORS.positive,
        },
      ]}
      legend={[
        { label: 'Proporción real', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Contiene el valor real', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'No lo contiene', color: DATA_COLORS.negative, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Encuestas simuladas',
        columns: ['Encuesta', 'Estimación', 'Margen', 'Contiene el valor real'],
        rows: visible.map((poll, i) => [
          String(i + 1),
          pct(poll.estimate),
          pct(poll.margin),
          poll.covers ? 'sí' : 'no',
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {`Cada barra es una encuesta: estimación más o menos su margen de error (${formatNumber(conf * 100, 0)} % de confianza)`}
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={280}
        maxHeight={460}
        margins={{ left: 40, bottom: 44, top: 12, right: 16 }}
      >
        {(box) => {
          const spread = 4.5 * Math.sqrt((p * (1 - p)) / n);
          const x = scaleLinear()
            .domain([Math.max(0, p - spread), Math.min(1, p + spread)])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const row = box.inner.height / count;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                format={(v) => `${Math.round(v * 1000) / 10} %`}
                label={config.variable}
              />
              <line
                x1={x(p)}
                x2={x(p)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.primary}
                strokeWidth={2.5}
              />
              {visible.map((poll, i) => {
                const yy = box.inner.top + row * (i + 0.5);
                const color = poll.covers ? DATA_COLORS.tertiary : DATA_COLORS.negative;
                return (
                  <g key={i} aria-hidden="true">
                    <line
                      x1={x(poll.estimate - poll.margin)}
                      x2={x(poll.estimate + poll.margin)}
                      y1={yy}
                      y2={yy}
                      stroke={color}
                      strokeWidth={Math.max(1.5, Math.min(4, row * 0.5))}
                    />
                    <circle
                      cx={x(poll.estimate)}
                      cy={yy}
                      r={Math.max(2, Math.min(4, row * 0.4))}
                      fill={color}
                    />
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
