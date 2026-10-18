import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { modifiedZScores, zScoresOf } from '../../../lib/stats/eda.ts';
import {
  mean,
  median,
  medianAbsoluteDeviation,
  standardDeviation,
} from '../../../lib/stats/index.ts';
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

const STEPS_PER_SECOND = 0.8;
const ROW_GAP = 70;
const Z_LIMIT = 12;

interface ZOutliersViewProps {
  title: string;
  base: number[];
  extremes: number[];
  label: string;
}

/**
 * Extreme values join the sample one at a time. Each one inflates the
 * standard deviation, so the z-scores of all the extremes shrink and some
 * stop crossing the threshold (masking); the modified z-scores, built on the
 * median and the MAD, barely move.
 */
export function ZOutliersView({ title, base, extremes, label }: ZOutliersViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'umbralZ',
        label: 'Umbral de z',
        symbol: '|z| >',
        min: 2,
        max: 4,
        step: 0.5,
        default: 3,
        digits: 1,
      },
      {
        type: 'number',
        key: 'umbralM',
        label: 'Umbral de z modificada',
        symbol: '|M| >',
        min: 2.5,
        max: 5,
        step: 0.5,
        default: 3.5,
        digits: 1,
      },
    ],
    [],
  );
  const parameters = useParameters(definitions);
  const tz = Number(parameters.values.umbralZ);
  const tm = Number(parameters.values.umbralM);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [added, setAdded] = useResettableState<number>(String(run), () =>
    reducedMotion ? extremes.length : 0,
  );
  const playback = usePlayback({
    step: () => setAdded((v) => Math.min(extremes.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: added >= extremes.length,
  });
  const values = [...base, ...extremes.slice(0, added)];
  const z = zScoresOf(values);
  const mz = modifiedZScores(values);
  const isExtreme = (i: number) => i >= base.length;
  const byZ = z.filter((v) => Math.abs(v) > tz).length;
  const byM = mz.filter((v) => Math.abs(v) > tm).length;
  const m = mean(values);
  const s = standardDeviation(values);
  const med = median(values);
  const mad = medianAbsoluteDeviation(values);
  const lastIndex = values.length - 1;
  const header =
    added === 0
      ? `\\bar{x} = ${formatNumber(m, 2)},\\ s = ${formatNumber(s, 2)},\\quad \\tilde{x} = ${formatNumber(med, 2)},\\ \\text{MAD} = ${formatNumber(mad, 2)}`
      : `x = ${formatNumber(values[lastIndex] ?? 0, 2)}:\\quad z = \\frac{x - ${formatNumber(m, 2)}}{${formatNumber(s, 2)}} = ${formatNumber(z[lastIndex] ?? 0, 2)},\\quad M = \\frac{0.6745\\,(x - ${formatNumber(med, 2)})}{${formatNumber(mad, 2)}} = ${formatNumber(mz[lastIndex] ?? 0, 2)}`;
  const description =
    `${values.length} valores de ${label}, ${added} de ${extremes.length} extremos agregados. ` +
    `Media ${formatNumber(m, 2)}, desviación ${formatNumber(s, 2)}, mediana ${formatNumber(med, 2)}, MAD ${formatNumber(mad, 2)}. ` +
    `Señalados por z: ${byZ}; por z modificada: ${byM}.`;
  const clamp = (v: number) => Math.max(-Z_LIMIT, Math.min(Z_LIMIT, v));
  const span = Math.min(Z_LIMIT, Math.max(5, ...z.map(Math.abs), ...mz.map(Math.abs)) + 0.5);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Media y desviación', value: `${formatNumber(m, 2)}; ${formatNumber(s, 2)}` },
        { label: 'Mediana y MAD', value: `${formatNumber(med, 2)}; ${formatNumber(mad, 2)}` },
        {
          label: 'Señalados por z',
          value: `${byZ} de ${added} extremos`,
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Señalados por z modificada',
          value: `${byM} de ${added} extremos`,
          color: DATA_COLORS.tertiary,
        },
      ]}
      legend={[
        { label: 'Datos', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Extremo agregado sin señalar', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Señalado como atípico', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Umbral', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.45}
        minHeight={240}
        maxHeight={340}
        margins={{ top: 26, right: 20, bottom: 30, left: 20 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([-span, span])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const rows = [
            { name: 'Puntuación z', scores: z, t: tz, y: box.inner.top + 30 },
            {
              name: 'Puntuación z modificada',
              scores: mz,
              t: tm,
              y: box.inner.top + 30 + ROW_GAP + 30,
            },
          ];
          return (
            <g>
              {rows.map((r) => (
                <g key={r.name}>
                  <text x={box.inner.left} y={r.y - 28} className={styles.chartLabel}>
                    {r.name}
                  </text>
                  <Axis scale={x} orientation="bottom" position={r.y + 22} ticks={9} label="" />
                  <g aria-hidden="true">
                    {[-r.t, r.t].map((v) => (
                      <line
                        key={v}
                        x1={x(v)}
                        x2={x(v)}
                        y1={r.y - 22}
                        y2={r.y + 22}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={2}
                        strokeDasharray="6 3"
                      />
                    ))}
                  </g>
                  <DotStrip
                    values={r.scores.map(clamp)}
                    x={x}
                    y={r.y}
                    spread={18}
                    radius={3.5}
                    color={(i) =>
                      Math.abs(r.scores[i] ?? 0) > r.t
                        ? DATA_COLORS.secondary
                        : isExtreme(i)
                          ? DATA_COLORS.highlight
                          : DATA_COLORS.primary
                    }
                  />
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
