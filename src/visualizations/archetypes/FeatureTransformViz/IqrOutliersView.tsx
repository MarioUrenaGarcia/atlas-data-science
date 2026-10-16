import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { tukeyFences } from '../../../lib/stats/eda.ts';
import { median } from '../../../lib/stats/index.ts';
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
import { DotStrip } from './marks.tsx';

/** Data, quartiles, box, fences, flagged points. */
const STAGES = 4;
const STAGES_PER_SECOND = 0.8;
const BOX_HEIGHT = 46;

const STAGE_NAMES = [
  'Datos ordenados sobre el eje',
  'Cuartiles y mediana',
  'Rango intercuartílico',
  'Vallas de Tukey',
  'Valores fuera de las vallas',
];

interface IqrOutliersViewProps {
  title: string;
  values: number[];
  label: string;
  k: number;
}

/**
 * Tukey's rule built step by step: quartiles, the box of width IQR, fences
 * k IQR beyond the box and, finally, the points outside them. The factor k
 * can be changed to see how many points each convention flags.
 */
export function IqrOutliersView({ title, values, label, k: k0 }: IqrOutliersViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'k',
        label: 'Factor de las vallas',
        symbol: 'k',
        min: 0.5,
        max: 3,
        step: 0.5,
        default: k0,
        digits: 1,
      },
    ],
    [k0],
  );
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, setStage] = useResettableState<number>(String(run), () =>
    reducedMotion ? STAGES : 0,
  );
  const playback = usePlayback({
    step: () => setStage((v) => Math.min(STAGES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES,
  });
  const f = tukeyFences(values, k);
  const med = median(values);
  const flagged = values.map((v) => v < f.lower || v > f.upper);
  const count = flagged.filter(Boolean).length;
  const q = (v: number) => formatNumber(v, 2);
  const headers = [
    `n = ${values.length}`,
    `Q_1 = ${q(f.q1)},\\quad \\tilde{x} = ${q(med)},\\quad Q_3 = ${q(f.q3)}`,
    `\\text{RIQ} = Q_3 - Q_1 = ${q(f.q3)} - ${q(f.q1)} = ${q(f.iqr)}`,
    `Q_1 - ${formatNumber(k, 1)}\\,\\text{RIQ} = ${q(f.lower)},\\quad Q_3 + ${formatNumber(k, 1)}\\,\\text{RIQ} = ${q(f.upper)}`,
    `\\text{${count} valor${count === 1 ? '' : 'es'} fuera de } [${q(f.lower)},\\ ${q(f.upper)}]`,
  ];
  const description =
    `${STAGE_NAMES[stage]}. ${values.length} valores de ${label}; Q1 ${q(f.q1)}, Q3 ${q(f.q3)}, RIQ ${q(f.iqr)}. ` +
    `Con k = ${formatNumber(k, 1)} las vallas son ${q(f.lower)} y ${q(f.upper)} y quedan ${count} valores fuera.`;
  const lo = Math.min(...values, f.lower);
  const hi = Math.max(...values, f.upper);
  const pad = (hi - lo) * 0.05 || 1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Primer cuartil Q1', value: q(f.q1) },
        { label: 'Tercer cuartil Q3', value: q(f.q3) },
        { label: 'Rango intercuartílico', value: q(f.iqr) },
        { label: 'Valla inferior', value: q(f.lower) },
        { label: 'Valla superior', value: q(f.upper) },
        {
          label: 'Valores fuera de las vallas',
          value: String(count),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Dentro de las vallas', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Fuera de las vallas', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Vallas', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      <ChartSvg
        label={description}
        aspect={0.38}
        minHeight={200}
        maxHeight={300}
        margins={{ top: 16, right: 20, bottom: 44, left: 20 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([lo - pad, hi + pad])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const boxY = box.inner.top + 10;
          const stripY = boxY + BOX_HEIGHT + 34;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                gridLength={box.inner.height}
                ticks={8}
                label={label}
              />
              <g aria-hidden="true">
                {stage >= 1 &&
                  [f.q1, med, f.q3].map((v, i) => (
                    <line
                      key={i}
                      x1={x(v)}
                      x2={x(v)}
                      y1={boxY}
                      y2={boxY + BOX_HEIGHT}
                      stroke={DATA_COLORS.text}
                      strokeWidth={i === 1 ? 3 : 1.5}
                    />
                  ))}
                {stage >= 2 && (
                  <rect
                    x={x(f.q1)}
                    y={boxY}
                    width={x(f.q3) - x(f.q1)}
                    height={BOX_HEIGHT}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.15}
                    stroke={DATA_COLORS.text}
                    strokeWidth={1.5}
                  />
                )}
                {stage >= 3 &&
                  [f.lower, f.upper].map((v, i) => (
                    <g key={i}>
                      <line
                        x1={x(v)}
                        x2={x(v)}
                        y1={box.inner.top}
                        y2={box.inner.top + box.inner.height}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2}
                        strokeDasharray="6 3"
                      />
                      <line
                        x1={x(i === 0 ? f.q1 : f.q3)}
                        x2={x(v)}
                        y1={boxY + BOX_HEIGHT / 2}
                        y2={boxY + BOX_HEIGHT / 2}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={1.5}
                      />
                    </g>
                  ))}
              </g>
              {stage >= 1 && (
                <text x={x(med)} y={boxY - 4} textAnchor="middle" className={styles.chartLabel}>
                  mediana
                </text>
              )}
              <DotStrip
                values={values}
                x={x}
                y={stripY}
                spread={22}
                radius={3.5}
                color={(i) =>
                  stage >= 4 && flagged[i] ? DATA_COLORS.secondary : DATA_COLORS.primary
                }
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
