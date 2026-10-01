import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  BERTRAND_ANSWERS,
  BERTRAND_METHODS,
  bertrandChord,
  chordIsLong,
  type BertrandMethod,
  type Chord,
} from '../../../lib/probability/geometric.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './BertrandParadox.module.css';
import type { BertrandParadoxConfig } from './schema.ts';

const CHORDS_PER_SECOND = 15;
const FULL_RUN_SECONDS = 60;
const DEFAULT_CHORDS = 3000;
const SHOWN_CHORDS = 160;
const SHOWN_MIDPOINTS = 1500;

const METHOD_LABELS: Record<BertrandMethod, string> = {
  extremos: 'Dos extremos uniformes en la circunferencia',
  radio: 'Punto uniforme sobre un radio al azar',
  'punto-medio': 'Punto medio uniforme en el disco',
};

const METHOD_SHORT: Record<BertrandMethod, string> = {
  extremos: 'Extremos',
  radio: 'Radio',
  'punto-medio': 'Punto medio',
};

const METHOD_HEADERS: Record<BertrandMethod, string> = {
  extremos: `P = \\frac{\\text{arco de } 120^\\circ}{360^\\circ} = \\frac{1}{3}`,
  radio: `P = P\\left(d < \\tfrac{1}{2}\\right) = \\frac{1/2}{1} = \\frac{1}{2}`,
  'punto-medio': `P = \\frac{\\pi (1/2)^2}{\\pi \\cdot 1^2} = \\frac{1}{4}`,
};

interface Simulation {
  total: number;
  long: Record<BertrandMethod, number>;
  recent: Record<BertrandMethod, Chord[]>;
}

const emptyRecord = <T,>(make: () => T) =>
  Object.fromEntries(BERTRAND_METHODS.map((method) => [method, make()])) as Record<
    BertrandMethod,
    T
  >;

/**
 * Bertrand's paradox: "the probability that a random chord is longer than the
 * side of the inscribed equilateral triangle" has three different answers
 * depending on how the chord is chosen. The three methods run side by side;
 * the circle shows the chords or the midpoints of the selected method, and
 * the bars compare the three estimates with 1/3, 1/2 and 1/4.
 */
export default function BertrandParadox({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as BertrandParadoxConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'metodo',
        label: 'Método que se dibuja',
        options: BERTRAND_METHODS.map((method) => ({
          value: method,
          label: METHOD_LABELS[method],
        })),
        default: config.metodo ?? 'extremos',
      },
      {
        type: 'select' as const,
        key: 'vista',
        label: 'Qué se dibuja',
        options: [
          { value: 'cuerdas', label: 'Las cuerdas' },
          { value: 'puntos-medios', label: 'Los puntos medios' },
        ],
        default: config.vista ?? 'cuerdas',
      },
    ],
    [config.metodo, config.vista],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const method = (values.metodo ?? 'extremos') as BertrandMethod;
  const midpoints = values.vista === 'puntos-medios';
  const maxChords = config.cuerdas ?? DEFAULT_CHORDS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, `${run}`);
  const [sim, update] = useResettableState<Simulation>(`${run}|${seed.seed}`, () => ({
    total: 0,
    long: emptyRecord(() => 0),
    recent: emptyRecord<Chord[]>(() => []),
  }));
  const draw = (count: number) => {
    const generator = random();
    const steps = Math.min(count, maxChords - sim.total);
    // One chord per method in each step, so the three estimates use the same number of chords.
    const batch = Array.from({ length: Math.max(0, steps) }, () =>
      emptyRecord<Chord>(() => ({ x1: 0, y1: 0, x2: 0, y2: 0, distance: 0 })),
    );
    for (const chords of batch) {
      for (const m of BERTRAND_METHODS) chords[m] = bertrandChord(generator, m);
    }
    update((previous) => {
      const long = { ...previous.long };
      const recent = { ...previous.recent };
      for (const chords of batch) {
        for (const m of BERTRAND_METHODS) if (chordIsLong(chords[m])) long[m] += 1;
      }
      for (const m of BERTRAND_METHODS) {
        recent[m] = [...previous.recent[m], ...batch.map((chords) => chords[m])].slice(
          -SHOWN_MIDPOINTS,
        );
      }
      return { total: previous.total + batch.length, long, recent };
    });
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(CHORDS_PER_SECOND, maxChords / FULL_RUN_SECONDS),
    done: sim.total >= maxChords,
  });

  const estimate = (m: BertrandMethod) => (sim.total > 0 ? sim.long[m] / sim.total : 0);
  const header = `${METHOD_HEADERS[method]} \\qquad \\hat{P} = \\frac{${sim.long[method]}}{${sim.total}} = ${formatNumber(estimate(method), 3)}`;
  const description =
    `Cuerdas al azar en un círculo de radio 1; una cuerda es larga si mide más que el lado √3 del triángulo inscrito. ` +
    BERTRAND_METHODS.map(
      (m) =>
        `${METHOD_LABELS[m]}: ${formatNumber(estimate(m), 3)} (teórico ${formatNumber(BERTRAND_ANSWERS[m], 3)})`,
    ).join('. ') +
    '.';
  const shown = midpoints ? sim.recent[method] : sim.recent[method].slice(-SHOWN_CHORDS);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Cuerdas por método', value: String(sim.total) },
        ...BERTRAND_METHODS.map((m, i) => ({
          label: `${METHOD_SHORT[m]} (teórico ${formatNumber(BERTRAND_ANSWERS[m], 3)})`,
          value: formatNumber(estimate(m), 3),
          color: seriesColor(i),
        })),
      ]}
      legend={[
        { label: 'Cuerda más larga que el lado', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Cuerda más corta', color: DATA_COLORS.neutral, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.panels}>
        <ChartSvg
          label={description}
          aspect={1}
          minHeight={240}
          maxHeight={340}
          margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          {(box) => {
            const radius = Math.min(box.inner.width, box.inner.height) / 2;
            const cx = box.inner.left + box.inner.width / 2;
            const cy = box.inner.top + box.inner.height / 2;
            const px = (x: number) => cx + x * radius;
            const py = (y: number) => cy - y * radius;
            const triangle = [90, 210, 330]
              .map(
                (deg) =>
                  `${px(Math.cos((deg * Math.PI) / 180))},${py(Math.sin((deg * Math.PI) / 180))}`,
              )
              .join(' ');
            return (
              <g aria-hidden="true">
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="var(--color-surface-2)"
                  stroke="var(--color-border-strong)"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius / 2}
                  fill="none"
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 3"
                />
                <polygon
                  points={triangle}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={1.5}
                />
                {shown.map((chord, index) =>
                  midpoints ? (
                    <circle
                      key={index}
                      cx={px((chord.x1 + chord.x2) / 2)}
                      cy={py((chord.y1 + chord.y2) / 2)}
                      r={1.8}
                      fill={chordIsLong(chord) ? DATA_COLORS.primary : DATA_COLORS.neutral}
                      fillOpacity={0.7}
                    />
                  ) : (
                    <line
                      key={index}
                      x1={px(chord.x1)}
                      y1={py(chord.y1)}
                      x2={px(chord.x2)}
                      y2={py(chord.y2)}
                      stroke={chordIsLong(chord) ? DATA_COLORS.primary : DATA_COLORS.neutral}
                      strokeOpacity={0.5}
                      strokeWidth={1}
                    />
                  ),
                )}
              </g>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.9} minHeight={240} maxHeight={340}>
          {(box) => {
            const slot = box.inner.width / BERTRAND_METHODS.length;
            const y = scaleLinear()
              .domain([0, 0.7])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const short = ['extremos', 'radio', 'punto medio'];
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={7}
                  label="proporción de cuerdas largas"
                />
                <g aria-hidden="true">
                  {BERTRAND_METHODS.map((m, i) => {
                    const x = box.inner.left + i * slot + slot * 0.2;
                    const value = estimate(m);
                    return (
                      <g key={m} opacity={m === method ? 1 : 0.55}>
                        <rect
                          x={x}
                          y={y(value)}
                          width={slot * 0.6}
                          height={y(0) - y(value)}
                          fill={seriesColor(i)}
                          fillOpacity={0.75}
                        />
                        <line
                          x1={x - 4}
                          x2={x + slot * 0.6 + 4}
                          y1={y(BERTRAND_ANSWERS[m])}
                          y2={y(BERTRAND_ANSWERS[m])}
                          stroke={DATA_COLORS.text}
                          strokeWidth={2}
                        />
                        <text
                          x={x + slot * 0.3}
                          y={y(0) + 16}
                          textAnchor="middle"
                          className={svgStyles.label}
                        >
                          {short[i]}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        Una cuerda supera al lado del triángulo inscrito exactamente cuando su punto medio cae
        dentro del círculo punteado de radio 1/2. Cada método reparte los puntos medios de forma
        distinta; las líneas horizontales de la derecha marcan 1/3, 1/2 y 1/4.
      </p>
    </VizFrame>
  );
}
