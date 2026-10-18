import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  effectiveSampleSize,
  postStratificationWeights,
  weightedCellMean,
  weightingDesignEffect,
} from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { PostStratConfig } from './schema.ts';
import styles from './SamplingWeights.module.css';

const STAGES = 4;
const STAGES_PER_SECOND = 0.5;

const STAGE_TEXT = [
  'La muestra tiene una composición distinta de la población',
  'Cada grupo recibe un peso: su participación en la población entre su participación en la muestra',
  'Con los pesos, la muestra reproduce la composición de la población',
  'La estimación ponderada combina las medias de los grupos con las participaciones reales',
];

/** Post-stratification: sample shares corrected to population shares by group weights. */
export function PostStratView({ config, title }: { config: PostStratConfig; title: string }) {
  const groups = config.grupos;
  const decimals = config.decimales ?? 1;
  const totalPopulation = groups.reduce((a, g) => a + g.poblacion, 0);
  const W = groups.map((g) => g.poblacion / totalPopulation);
  const counts = groups.map((g) => g.muestra);
  const n = counts.reduce((a, b) => a + b, 0);
  const sampleShares = counts.map((c) => c / n);
  const weights = postStratificationWeights(counts, W);
  const means = groups.map((g) => g.media);
  const naive = weightedCellMean(
    counts,
    means,
    counts.map(() => 1),
  );
  const post = weightedCellMean(counts, means, weights);
  const perUnit = counts.flatMap((c, h) => Array.from({ length: c }, () => weights[h] ?? 0));
  const deff = weightingDesignEffect(perUnit);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${run}`, () => (reducedMotion ? STAGES - 1 : 0));
  const playback = usePlayback({
    step: () => update((value) => Math.min(STAGES - 1, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES - 1,
  });
  const f = (v: number) => formatNumber(v, 2);
  const unit = config.unidad ? ` ${config.unidad}` : '';
  const headers = [
    `\\frac{n_h}{n}:\\ ${groups.map((_, h) => f(sampleShares[h] ?? 0)).join(',\\ ')} \\qquad W_h:\\ ${W.map(f).join(',\\ ')}`,
    groups
      .slice(0, 4)
      .map(
        (_, h) =>
          `w_{${h + 1}} = \\frac{${f(W[h] ?? 0)}}{${f(sampleShares[h] ?? 0)}} = ${f(weights[h] ?? 0)}`,
      )
      .join(',\\quad '),
    `\\sum_h w_h \\frac{n_h}{n} = ${groups.map((_, h) => `${f(weights[h] ?? 0)} \\cdot ${f(sampleShares[h] ?? 0)}`).join(' + ')} = 1`,
    `\\bar{y}_{\\text{post}} = \\sum_h W_h\\,\\bar{y}_h = ${groups
      .map((_, h) => `${f(W[h] ?? 0)}\\,(${formatNumber(means[h] ?? 0, decimals)})`)
      .join(' + ')} = ${formatNumber(post, decimals + 1)}`,
  ];
  const description =
    `Muestra de ${n} personas en ${groups.length} grupos según ${config.criterio.toLowerCase()}. ` +
    `Sin ponderar, la media de ${config.variable} es ${formatNumber(naive, decimals + 1)}; ` +
    `con post-estratificación es ${formatNumber(post, decimals + 1)}.`;
  const shownShares = stage >= 2 ? W : sampleShares;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        ...groups.map((g, h) => ({
          label: `${g.nombre}: ${g.muestra} en la muestra, ${formatNumber((W[h] ?? 0) * 100, 1)} % de la población`,
          value: `peso ${f(weights[h] ?? 0)}`,
        })),
        {
          label: 'Media sin ponderar',
          value: `${formatNumber(naive, decimals + 1)}${unit}`,
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Media post-estratificada',
          value: `${formatNumber(post, decimals + 1)}${unit}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Efecto de diseño por ponderación', value: formatNumber(deff, 3) },
        {
          label: 'Tamaño efectivo de muestra',
          value: formatNumber(effectiveSampleSize(n, deff), 1),
        },
      ]}
      legend={[
        { label: 'Participación en la muestra', color: DATA_COLORS.secondary },
        { label: 'Participación en la población', color: DATA_COLORS.primary, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Grupos de post-estratificación',
        columns: ['Grupo', 'n_h', 'n_h/n', 'W_h', 'Peso', `Media de ${config.variable}`],
        rows: groups.map((g, h) => [
          g.nombre,
          String(g.muestra),
          f(sampleShares[h] ?? 0),
          f(W[h] ?? 0),
          f(weights[h] ?? 0),
          formatNumber(g.media, decimals),
        ]),
      }}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      <p className={styles.caption}>{STAGE_TEXT[stage]}</p>
      <ChartSvg
        label={description}
        aspect={0.42}
        minHeight={220}
        maxHeight={320}
        margins={{ top: 24, bottom: 36, left: 48 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, groups.length])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const yMax = Math.max(...W, ...sampleShares) * 1.25;
          const y = scaleLinear()
            .domain([0, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                format={(v) => `${Math.round(v * 100)} %`}
              />
              <Bars
                bars={shownShares.map((share, h) => ({ x0: h + 0.2, x1: h + 0.8, value: share }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                opacity={0.75}
              />
              {W.map((share, h) => (
                <line
                  key={h}
                  x1={x(h + 0.12)}
                  x2={x(h + 0.88)}
                  y1={y(share)}
                  y2={y(share)}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  aria-hidden="true"
                />
              ))}
              {groups.map((g, h) => (
                <g key={h}>
                  <text
                    x={x(h + 0.5)}
                    y={box.inner.top + box.inner.height + 18}
                    textAnchor="middle"
                    className={styles.label}
                  >
                    {g.nombre}
                  </text>
                  {stage >= 1 && (
                    <text
                      x={x(h + 0.5)}
                      y={y(Math.max(shownShares[h] ?? 0, W[h] ?? 0)) - 8}
                      textAnchor="middle"
                      className={styles.weight}
                    >
                      {`× ${f(weights[h] ?? 0)}`}
                    </text>
                  )}
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
      {stage >= 3 && (
        <ChartSvg
          label="Medias de los grupos y estimaciones"
          aspect={0.16}
          minHeight={110}
          maxHeight={140}
          margins={{ top: 30, bottom: 30, left: 24, right: 24 }}
        >
          {(box) => {
            const lo = Math.min(...means);
            const hi = Math.max(...means);
            const pad = (hi - lo) * 0.15 || 1;
            const x = scaleLinear()
              .domain([lo - pad, hi + pad])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const mid = box.inner.top + box.inner.height / 2;
            return (
              <g>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={6}
                  label={`${config.variable}${unit ? ` (${config.unidad})` : ''}`}
                />
                {means.map((m, h) => (
                  <g key={h}>
                    <circle
                      cx={x(m)}
                      cy={mid}
                      r={4 + 10 * Math.sqrt(W[h] ?? 0)}
                      fill={DATA_COLORS.neutral}
                      fillOpacity={0.35}
                      stroke={DATA_COLORS.muted}
                    />
                    <text
                      x={x(m)}
                      y={mid - 8 - 10 * Math.sqrt(W[h] ?? 0)}
                      textAnchor="middle"
                      className={styles.labelMuted}
                    >
                      {groups[h]?.nombre}
                    </text>
                  </g>
                ))}
                <line
                  x1={x(naive)}
                  x2={x(naive)}
                  y1={box.inner.top - 6}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                />
                <text
                  x={x(naive)}
                  y={box.inner.top - 10}
                  textAnchor="middle"
                  className={styles.label}
                >
                  sin ponderar
                </text>
                <line
                  x1={x(post)}
                  x2={x(post)}
                  y1={box.inner.top - 6}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                <text
                  x={x(post)}
                  y={box.inner.top + box.inner.height - 4}
                  textAnchor="middle"
                  className={styles.label}
                >
                  ponderada
                </text>
              </g>
            );
          }}
        </ChartSvg>
      )}
    </VizFrame>
  );
}
