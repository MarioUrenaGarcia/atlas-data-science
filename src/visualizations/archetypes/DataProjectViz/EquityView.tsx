import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { scoredPopulation } from '../../../lib/dataprep/decision.ts';
import { groupRates } from '../../../lib/dataprep/lifecycle.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';

const GROUP_SIZE = 300;
/** The model separates the classes worse in group B, which had fewer training examples. */
const SEPARATIONS = [2.4, 1.2];
const CASES_PER_SECOND = 120;
const DOT_RADIUS = 2.6;

interface EquityViewProps {
  title: string;
  threshold: number;
  rates: [number, number];
  perGroup: boolean;
  seed: number;
}

/**
 * A risk score applied to two groups. With one shared threshold the false
 * positive and false negative rates differ between groups; separate
 * thresholds can equalize one rate at the price of others.
 */
export function EquityView(props: EquityViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'umbral',
      label: 'Umbral (grupo A, o ambos)',
      min: 0.05,
      max: 0.95,
      step: 0.01,
      default: props.threshold,
      symbol: 'u',
      digits: 2,
    },
    {
      type: 'toggle',
      key: 'porGrupo',
      label: 'Usar un umbral distinto para el grupo B',
      default: props.perGroup,
    },
    {
      type: 'number',
      key: 'umbralB',
      label: 'Umbral del grupo B',
      min: 0.05,
      max: 0.95,
      step: 0.01,
      default: props.threshold,
      digits: 2,
      shownWhen: { key: 'porGrupo', values: ['true'] },
    },
  ];
  const parameters = useParameters(definitions);
  const uA = Number(parameters.values.umbral);
  const perGroup = Boolean(parameters.values.porGrupo);
  const uB = perGroup ? Number(parameters.values.umbralB) : uA;
  const seed = useSeed(props.seed);
  const groups = useMemo(() => {
    const random = new Random(seed.seed);
    return props.rates.map((rate, g) =>
      scoredPopulation(
        { n: GROUP_SIZE, prevalence: rate, separation: SEPARATIONS[g] ?? 1 },
        random,
      ),
    );
  }, [props.rates, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? GROUP_SIZE : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(GROUP_SIZE, v + 1)),
    stepMany: (count) => update((v) => Math.min(GROUP_SIZE, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: CASES_PER_SECOND,
    done: shown >= GROUP_SIZE,
  });
  const visible = groups.map((g) => g.slice(0, shown));
  const thresholds = [uA, uB];
  const rates = visible.map((g, i) => groupRates(g, thresholds[i] ?? 0.5));
  const [ra, rb] = rates;
  const p = (v: number | undefined) =>
    v === undefined || Number.isNaN(v) ? '...' : formatNumber(v, 3);
  const header = `TFP_A = ${p(ra?.falsePositiveRate)},\\ TFP_B = ${p(rb?.falsePositiveRate)};\\quad TFN_A = ${p(ra?.falseNegativeRate)},\\ TFN_B = ${p(rb?.falseNegativeRate)}`;
  const description =
    `Dos grupos de ${GROUP_SIZE} personas con tasas de positivos ${formatNumber(props.rates[0], 2)} y ${formatNumber(props.rates[1], 2)}. ` +
    `Umbrales ${formatNumber(uA, 2)} y ${formatNumber(uB, 2)}. ` +
    `Tasa de falsos positivos: A ${p(ra?.falsePositiveRate)}, B ${p(rb?.falsePositiveRate)}. ` +
    `Tasa de falsos negativos: A ${p(ra?.falseNegativeRate)}, B ${p(rb?.falseNegativeRate)}.`;

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        {
          label: 'Falsos positivos, grupo A',
          value: p(ra?.falsePositiveRate),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Falsos positivos, grupo B',
          value: p(rb?.falsePositiveRate),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Falsos negativos, grupo A',
          value: p(ra?.falseNegativeRate),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Falsos negativos, grupo B',
          value: p(rb?.falseNegativeRate),
          color: DATA_COLORS.secondary,
        },
        { label: 'Marcados en A y en B', value: `${p(ra?.flaggedRate)} y ${p(rb?.flaggedRate)}` },
      ]}
      legend={[
        { label: 'No pagaría (positivo real)', color: DATA_COLORS.negative, shape: 'circle' },
        { label: 'Pagaría (negativo real)', color: DATA_COLORS.neutral, shape: 'circle' },
        { label: 'Umbral', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        Cada punto es una persona colocada según su puntaje de riesgo. A la derecha del umbral se le
        niega el crédito.
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={340}
        margins={{ top: 12, right: 16, bottom: 44, left: 70 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleLinear()
            .domain([0, 1])
            .range([left, left + width]);
          const lane = height / 2;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                ticks={10}
                label="Puntaje de riesgo"
              />
              <g aria-hidden="true">
                {visible.map((g, gi) => {
                  const y0 = top + gi * lane;
                  const t = thresholds[gi] ?? 0.5;
                  return (
                    <g key={gi}>
                      <text
                        x={left - 8}
                        y={y0 + lane / 2}
                        dy="0.35em"
                        textAnchor="end"
                        className={styles.nodeText}
                      >
                        Grupo {gi === 0 ? 'A' : 'B'}
                      </text>
                      <line
                        x1={left}
                        x2={left + width}
                        y1={y0 + lane}
                        y2={y0 + lane}
                        stroke={DATA_COLORS.grid}
                      />
                      {g.map((c, i) => {
                        // Deterministic jitter spreads the dots vertically inside the lane.
                        const jitter = (((i * 7919) % 97) / 97) * (lane - 16) + 8;
                        return (
                          <circle
                            key={i}
                            cx={x(c.score)}
                            cy={y0 + jitter}
                            r={DOT_RADIUS}
                            fill={c.positive ? DATA_COLORS.negative : DATA_COLORS.neutral}
                            fillOpacity={c.positive ? 0.9 : 0.5}
                          />
                        );
                      })}
                      <line
                        x1={x(t)}
                        x2={x(t)}
                        y1={y0 + 2}
                        y2={y0 + lane - 2}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2.5}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
