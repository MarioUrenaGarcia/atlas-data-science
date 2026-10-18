import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { targetEncode, targetEncodeOutOfFold } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { pearson } from '../../../lib/stats/index.ts';
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
import { CATEGORY_CASES, categoryRows } from './categoryData.ts';
import { CategoryLabel, TILT_ABOVE } from './CategoryLabel.tsx';
import type { TargetCaseId } from './schema.ts';

const MORPH_STEPS = 20;
const STEPS_PER_SECOND = 10;
const FOLDS = 5;

/**
 * Each category is replaced by the mean of the target in that category,
 * shrunk toward the global mean by m pseudo-observations. The bars morph from
 * the raw means to the smoothed values: small categories move the most.
 */
export function TargetView({
  title,
  caseId,
  m,
  outOfFold,
  seed: seed0,
}: {
  title: string;
  caseId: TargetCaseId;
  m: number;
  outOfFold: boolean;
  seed: number;
}) {
  const item = CATEGORY_CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'm',
      label: 'Suavizamiento (observaciones ficticias)',
      min: 0,
      max: 50,
      step: 1,
      default: m,
      symbol: 'm',
    },
    {
      type: 'toggle',
      key: 'oof',
      label: 'Calcular fuera de pliegue (5 pliegues)',
      default: outOfFold,
    },
  ];
  const parameters = useParameters(definitions);
  const smoothing = Number(parameters.values.m);
  const oof = Boolean(parameters.values.oof);
  const seed = useSeed(seed0);
  const data = useMemo(() => categoryRows(item, seed.seed), [item, seed.seed]);
  const raw = targetEncode(data.categories, data.y, 0);
  const smooth = targetEncode(data.categories, data.y, smoothing);
  const inSample = data.categories.map((c) => smooth.byCategory.get(c) ?? smooth.globalMean);
  const outSample = useMemo(
    () => targetEncodeOutOfFold(data.categories, data.y, smoothing, FOLDS),
    [data, smoothing],
  );
  const feature = oof ? outSample : inSample;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stepIndex, update] = useResettableState<number>(`${seed.seed}|${smoothing}|${run}`, () =>
    reducedMotion ? MORPH_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(MORPH_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: stepIndex >= MORPH_STEPS,
  });
  const t = stepIndex / MORPH_STEPS;
  const names = item.categories.map((c) => c.name);
  const tilt = names.length > TILT_ABOVE;
  const sizes = names.map((n) => data.categories.filter((c) => c === n).length);
  const rawValues = names.map((n) => raw.byCategory.get(n) ?? raw.globalMean);
  const smoothValues = names.map((n) => smooth.byCategory.get(n) ?? smooth.globalMean);
  const shownValues = rawValues.map((v, i) => v + ((smoothValues[i] ?? v) - v) * t);
  const smallest = names.length - 1;
  const f = (v: number) => formatNumber(v, 2);
  const header = `\\tilde{x}_{\\text{${names[smallest]}}} = \\frac{n_c\\,\\bar{y}_c + m\\,\\bar{y}}{n_c + m} = \\frac{${sizes[smallest]} \\cdot ${f(rawValues[smallest] ?? 0)} + ${smoothing} \\cdot ${f(raw.globalMean)}}{${sizes[smallest]} + ${smoothing}} = ${f(smoothValues[smallest] ?? 0)}`;
  const corrIn = pearson(inSample, data.y);
  const corrOut = pearson(outSample, data.y);
  const description =
    `${item.column} codificada con la media de ${item.target.toLowerCase()} suavizada con m = ${smoothing}. Media global ${f(raw.globalMean)}. ` +
    names
      .map(
        (n, i) => `${n} (${sizes[i]} filas): ${f(rawValues[i] ?? 0)} a ${f(smoothValues[i] ?? 0)}`,
      )
      .join('; ') +
    `. Correlación de la variable codificada con el objetivo: ${f(corrIn)} dentro de la muestra y ${f(corrOut)} fuera de pliegue.`;
  const domain = [
    Math.min(...rawValues, ...smoothValues) * 0.9,
    Math.max(...rawValues, ...smoothValues) * 1.05,
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Media global', value: f(raw.globalMean), color: DATA_COLORS.muted },
        {
          label: `Correlación con el objetivo (${oof ? 'fuera de pliegue' : 'dentro de la muestra'})`,
          value: f(pearson(feature, data.y)),
          color: DATA_COLORS.highlight,
        },
        { label: 'Correlación dentro de la muestra', value: f(corrIn) },
        { label: 'Correlación fuera de pliegue', value: f(corrOut) },
      ]}
      legend={[
        { label: 'Media cruda de la categoría', color: DATA_COLORS.muted, shape: 'line' },
        { label: 'Valor codificado', color: DATA_COLORS.primary },
        { label: 'Media global', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Codificación por categoría',
        columns: [item.column, 'Filas', 'Media cruda', 'Valor codificado'],
        rows: names.map((n, i) => [
          n,
          sizes[i] ?? 0,
          f(rawValues[i] ?? 0),
          f(smoothValues[i] ?? 0),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={380}
        margins={{ top: 12, right: 16, bottom: tilt ? 96 : 60, left: 56 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleBand<number>()
            .domain(names.map((_, i) => i))
            .range([left, left + width])
            .padding(0.2);
          const y = scaleLinear()
            .domain(domain as [number, number])
            .nice()
            .range([top + height, top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={5}
                label={`${item.target} (${item.unit})`}
              />
              <g aria-hidden="true">
                <line
                  x1={left}
                  x2={left + width}
                  y1={y(raw.globalMean)}
                  y2={y(raw.globalMean)}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {names.map((n, i) => {
                  const xx = x(i) ?? 0;
                  return (
                    <g key={n}>
                      <rect
                        x={xx}
                        y={y(shownValues[i] ?? 0)}
                        width={x.bandwidth()}
                        height={top + height - y(shownValues[i] ?? 0)}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.55}
                      />
                      <line
                        x1={xx - 2}
                        x2={xx + x.bandwidth() + 2}
                        y1={y(rawValues[i] ?? 0)}
                        y2={y(rawValues[i] ?? 0)}
                        stroke={DATA_COLORS.muted}
                        strokeWidth={2.5}
                      />
                      <CategoryLabel
                        x={xx + x.bandwidth() / 2}
                        y={top + height + 14}
                        tilt={tilt}
                        text={n}
                        detail={`n = ${sizes[i] ?? 0}`}
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
