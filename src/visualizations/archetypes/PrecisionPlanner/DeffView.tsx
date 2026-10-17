import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { clusterDesignEffect, effectiveSampleSize } from '../../../lib/sampling/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PrecisionPlanner.module.css';
import type { DeffConfig } from './schema.ts';

const STAGES = 30;
const STAGES_PER_SECOND = 10;
const REFERENCE_RHOS = [0.01, 0.05, 0.2];
const MAX_DOTS = 400;

/** Design effect of cluster sampling and the effective sample size it leaves. */
export function DeffView({ config, title }: { config: DeffConfig; title: string }) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'm',
        label: `${config.nombreUnidad}s por ${config.nombreConglomerado.toLowerCase()}`,
        symbol: 'm',
        min: 1,
        max: 60,
        step: 1,
        default: config.m,
      },
      {
        type: 'number',
        key: 'rho',
        label: 'Correlación intraclase',
        symbol: 'ρ',
        min: 0,
        max: 0.5,
        step: 0.01,
        default: config.rho,
        digits: 2,
      },
    ],
    // Static frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const m = Number(parameters.values.m);
  const rho = Number(parameters.values.rho);
  const n = config.n;
  const deff = clusterDesignEffect(m, rho);
  const nEff = effectiveSampleSize(n, deff);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState<number>(`${m}|${rho}|${run}`, () =>
    reducedMotion ? STAGES : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(STAGES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES,
  });
  const shownEffective = n + ((nEff - n) * stage) / STAGES;
  const header = `\\text{deff} = 1 + (m - 1)\\rho = 1 + (${m} - 1)\\cdot ${formatNumber(rho, 2)} = ${formatNumber(deff, 3)},\\qquad n_{\\text{ef}} = \\frac{n}{\\text{deff}} = \\frac{${n}}{${formatNumber(deff, 3)}} = ${formatNumber(nEff, 1)}`;
  const clusters = Math.ceil(n / m);
  const description =
    `${n} ${config.nombreUnidad.toLowerCase()}s en ${clusters} ${config.nombreConglomerado.toLowerCase()}s de ${m}; con correlación intraclase ${formatNumber(rho, 2)} ` +
    `el efecto de diseño es ${formatNumber(deff, 2)} y la muestra equivale a ${formatNumber(nEff, 0)} observaciones independientes.`;
  const dotScale = n > MAX_DOTS ? n / MAX_DOTS : 1;
  const totalDots = Math.round(n / dotScale);
  const effDots = Math.round(shownEffective / dotScale);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: `${config.nombreConglomerado}s en la muestra`, value: String(clusters) },
        { label: 'Efecto de diseño', value: formatNumber(deff, 3), color: DATA_COLORS.highlight },
        { label: 'Tamaño de muestra real', value: String(n) },
        { label: 'Tamaño efectivo', value: formatNumber(nEff, 1), color: DATA_COLORS.primary },
        {
          label: 'Aumento del error estándar',
          value: `${formatNumber((Math.sqrt(deff) - 1) * 100, 1)} %`,
        },
      ]}
      legend={[
        {
          label: 'Observación que aporta información independiente',
          color: DATA_COLORS.primary,
          shape: 'circle',
        },
        {
          label: 'Observación redundante por la correlación',
          color: DATA_COLORS.neutral,
          shape: 'circle',
        },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>
        {dotScale > 1
          ? `Cada punto representa ${formatNumber(dotScale, 1)} observaciones`
          : 'Cada punto es una observación'}
      </p>
      <ChartSvg
        label={description}
        aspect={0.3}
        minHeight={150}
        maxHeight={240}
        margins={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {(box) => {
          const per = Math.max(1, Math.round(m / dotScale));
          const groups = Math.ceil(totalDots / per);
          const columns = Math.ceil(Math.sqrt((groups * box.inner.width) / box.inner.height));
          const gw = box.inner.width / columns;
          const gh = box.inner.height / Math.ceil(groups / columns);
          const inner = Math.ceil(Math.sqrt(per));
          const r = Math.max(1.5, Math.min(gw, gh) / (inner * 2.6));
          return (
            <g aria-hidden="true">
              {Array.from({ length: totalDots }, (_, i) => {
                const g = Math.floor(i / per);
                const k = i % per;
                const gx = box.inner.left + (g % columns) * gw;
                const gy = box.inner.top + Math.floor(g / columns) * gh;
                const cx = gx + gw / 2 + ((k % inner) - (inner - 1) / 2) * r * 2.4;
                const cy = gy + gh / 2 + (Math.floor(k / inner) - (inner - 1) / 2) * r * 2.4;
                // Dots are switched off evenly across clusters so the loss reads as spread out.
                const rank = k * groups + g;
                const effective = rank < effDots;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={effective ? DATA_COLORS.primary : DATA_COLORS.neutral}
                    fillOpacity={effective ? 0.9 : 0.3}
                  />
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <ChartSvg
        label="Efecto de diseño según el tamaño del conglomerado"
        aspect={0.42}
        minHeight={200}
        maxHeight={300}
        margins={{ left: 50, bottom: 44, top: 14 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([1, 60])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const yMax = Math.max(4, clusterDesignEffect(60, Math.max(rho, 0.05)));
          const y = scaleLinear()
            .domain([1, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const rhos = [...REFERENCE_RHOS.filter((r) => Math.abs(r - rho) > 0.005), rho];
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="deff"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label={`${config.nombreUnidad}s por ${config.nombreConglomerado.toLowerCase()} (m)`}
              />
              {rhos.map((r, i) => {
                const current = r === rho;
                const end = Math.min(60, 1 + (yMax - 1) / Math.max(r, 1e-6));
                return (
                  <g key={i}>
                    <line
                      x1={x(1)}
                      x2={x(end)}
                      y1={y(1)}
                      y2={y(clusterDesignEffect(end, r))}
                      stroke={current ? DATA_COLORS.highlight : seriesColor(i)}
                      strokeWidth={current ? 3 : 1.5}
                      strokeOpacity={current ? 1 : 0.6}
                    />
                    <text
                      x={x(end) - 4}
                      y={y(clusterDesignEffect(end, r)) - 6}
                      textAnchor="end"
                      className={styles.labelMuted}
                    >
                      {`ρ = ${formatNumber(r, 2)}`}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={x(m)}
                cy={y(Math.min(yMax, deff))}
                r={7}
                fill={DATA_COLORS.highlight}
                stroke={DATA_COLORS.text}
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
