import { scaleBand, scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, median, pearson, skewness } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EdaWorkflow.module.css';
import { cleanRows, ENTRY_ERRORS, HOMES, ZONES } from './homes.ts';
import { HistogramPanel, ScatterPanel } from './marks.tsx';

const STEPS_PER_SECOND = 0.35;
const BINS = 24;

const prices = HOMES.map((h) => h.precio);
const logPrices = prices.map(Math.log);
const clean = cleanRows();
const zoneIndex = (z: string) => ZONES.indexOf(z as (typeof ZONES)[number]);

interface Step {
  title: string;
  finding: string;
  tex: string;
}

const STEPS: Step[] = [
  {
    title: 'Distribución del precio',
    finding: 'El precio tiene una cola larga a la derecha: la media supera a la mediana.',
    tex: `\\bar{x} = ${formatNumber(mean(prices), 2)},\\quad \\tilde{x} = ${formatNumber(median(prices), 2)},\\quad g_1 = ${formatNumber(skewness(prices), 2)}`,
  },
  {
    title: 'Precio en escala logarítmica',
    finding: 'Con el logaritmo la distribución se vuelve casi simétrica.',
    tex: `g_1(\\log \\text{precio}) = ${formatNumber(skewness(logPrices), 2)}`,
  },
  {
    title: 'Precio contra superficie',
    finding:
      'Dos viviendas con más de 700 m² y precio común: superficies capturadas con un cero de más.',
    tex: `r = ${formatNumber(
      pearson(
        HOMES.map((h) => h.superficie),
        prices,
      ),
      3,
    )}\\ \\text{con los errores}`,
  },
  {
    title: 'Sin los errores de captura, en escala logarítmica',
    finding: 'Sin los dos errores la relación es clara y casi lineal en escala logarítmica.',
    tex: `r = ${formatNumber(
      pearson(
        clean.map((h) => h.superficie),
        clean.map((h) => h.precio),
      ),
      3,
    )}\\ \\text{sin los errores}`,
  },
  {
    title: 'La zona separa la nube',
    finding:
      'Cada zona forma su propia banda: a igual superficie, el Centro cuesta más y el Sur menos.',
    tex: ZONES.map(
      (z) =>
        `\\tilde{x}_{\\text{${z}}} = ${formatNumber(median(HOMES.filter((h) => h.zona === z).map((h) => h.precio)), 2)}`,
    ).join(',\\ '),
  },
  {
    title: 'Faltantes de antigüedad por zona',
    finding: 'La antigüedad falta sobre todo en el Sur: los faltantes no son al azar.',
    tex: ZONES.map((z) => {
      const g = HOMES.filter((h) => h.zona === z);
      return `\\text{${z}}: ${formatNumber((100 * g.filter((h) => h.antiguedad === null).length) / g.length, 1)}\\,\\%`;
    }).join(',\\ '),
  },
];

/**
 * A guided exploratory analysis of home sales in the spirit of Tukey: each
 * step draws one chart, and each chart reveals something that changes what
 * the next step looks at.
 */
export function TourView({ title }: { title: string }) {
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState<number>(String(run), () =>
    reducedMotion ? STEPS.length - 1 : 0,
  );
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(STEPS.length - 1, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS.length - 1,
  });
  const current = STEPS[step] ?? STEPS[0];
  const description = `Paso ${step + 1} de ${STEPS.length}: ${current?.title}. ${current?.finding}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Paso', value: `${step + 1} de ${STEPS.length}` },
        { label: 'Viviendas', value: String(HOMES.length) },
        { label: 'Hallazgo', value: current?.title ?? '' },
      ]}
      legend={
        step >= 4
          ? ZONES.map((z, i) => ({ label: z, color: seriesColor(i), shape: 'circle' as const }))
          : step === 2
            ? [
                { label: 'Vivienda', color: DATA_COLORS.primary, shape: 'circle' },
                { label: 'Error de captura', color: DATA_COLORS.secondary, shape: 'circle' },
              ]
            : [{ label: 'Viviendas', color: DATA_COLORS.primary }]
      }
      description={description}
    >
      <FormulaLine tex={current?.tex ?? ''} />
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={280}
        maxHeight={440}
        margins={{ top: 14, right: 20, bottom: 46, left: 60 }}
      >
        {(box) => {
          if (step === 0) {
            return (
              <HistogramPanel
                box={box}
                values={prices}
                domain={[0, Math.max(...prices) * 1.03]}
                bins={BINS}
                label="Precio (millones de pesos)"
              />
            );
          }
          if (step === 1) {
            return (
              <HistogramPanel
                box={box}
                values={logPrices}
                domain={[Math.min(...logPrices) - 0.1, Math.max(...logPrices) + 0.1]}
                bins={BINS}
                label="Logaritmo del precio"
                color={DATA_COLORS.secondary}
              />
            );
          }
          if (step === 2) {
            const pts = HOMES.map((h, i) => ({
              x: h.superficie,
              y: h.precio,
              highlight: ENTRY_ERRORS.includes(i),
            }));
            return (
              <ScatterPanel
                box={box}
                points={pts}
                extentOf={pts}
                xLabel="Superficie (m²)"
                yLabel="Precio (millones)"
              />
            );
          }
          if (step === 3 || step === 4) {
            const pts = clean.map((h) => ({
              x: h.superficie,
              y: h.precio,
              ...(step === 4 ? { color: seriesColor(zoneIndex(h.zona)) } : {}),
            }));
            return (
              <ScatterPanel
                box={box}
                points={pts}
                extentOf={pts}
                xLabel="Superficie (m², escala log)"
                yLabel="Precio (millones, escala log)"
                log
              />
            );
          }
          const shares = ZONES.map((z) => {
            const g = HOMES.filter((h) => h.zona === z);
            return (100 * g.filter((h) => h.antiguedad === null).length) / g.length;
          });
          const x = scaleBand<string>()
            .domain([...ZONES])
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.35);
          const y = scaleLinear()
            .domain([0, 100])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Antigüedad faltante (%)"
              />
              {ZONES.map((z, i) => (
                <g key={z}>
                  <rect
                    x={x(z)}
                    y={y(shares[i] ?? 0)}
                    width={x.bandwidth()}
                    height={y(0) - y(shares[i] ?? 0)}
                    fill={seriesColor(i)}
                    aria-hidden="true"
                  />
                  <text
                    x={(x(z) ?? 0) + x.bandwidth() / 2}
                    y={box.inner.top + box.inner.height + 18}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {z}
                  </text>
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        {current?.title}. {current?.finding}
      </p>
    </VizFrame>
  );
}
