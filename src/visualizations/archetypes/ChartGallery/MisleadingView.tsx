import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { effectSize, lieFactor } from '../../../lib/stats/graphics.ts';
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
import styles from './ChartGallery.module.css';

export type Trick = 'eje-truncado' | 'pictograma' | 'ventana' | 'relacion-aspecto';

const FRAMES = 20;
const FRAMES_PER_SECOND = 8;

const TRICK_NAMES: Record<Trick, string> = {
  'eje-truncado': 'Eje vertical que no empieza en cero',
  pictograma: 'Figura escalada en dos dimensiones',
  ventana: 'Ventana de tiempo elegida a conveniencia',
  'relacion-aspecto': 'Proporción del gráfico estirada',
};

interface MisleadingViewProps {
  title: string;
  trick: Trick;
  labels: readonly string[];
  values: readonly number[];
  variable: string;
}

/**
 * An honest chart next to a distorted version of the same data. The animation
 * moves the distortion from none to its full amount, and the lie factor of
 * Tufte measures how much the drawing exaggerates the change in the data.
 */
export function MisleadingView({
  title,
  trick: trick0,
  labels,
  values,
  variable,
}: MisleadingViewProps) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'truco',
        label: 'Recurso engañoso',
        options: (Object.keys(TRICK_NAMES) as Trick[]).map((value) => ({
          value,
          label: TRICK_NAMES[value],
        })),
        default: trick0,
      },
    ],
    [trick0],
  );
  const parameters = useParameters(definitions);
  const trick = String(parameters.values.truco) as Trick;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [frame, setFrame] = useResettableState<number>(`${trick}|${run}`, () =>
    reducedMotion ? FRAMES : 0,
  );
  const playback = usePlayback({
    step: () => setFrame((v) => Math.min(FRAMES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  const t = frame / FRAMES;

  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  // Full amount of each distortion: baseline just under the minimum, a short
  // recent window, or a chart squeezed horizontally.
  const baseline = t * (lo - (hi - lo) * 0.5);
  const windowStart = Math.round(t * Math.max(0, values.length - 4));
  const stretch = 1 + 3 * t;

  let shownA = first;
  let shownB = last;
  const dataA = first;
  const dataB = last;
  if (trick === 'eje-truncado') {
    shownA = first - baseline;
    shownB = last - baseline;
  } else if (trick === 'pictograma') {
    // Height is proportional to the value; the width moves from constant to
    // proportional as well, so the area grows with the square of the value.
    const area = (v: number) => (v / hi) * ((1 - t) * 0.5 + (t * v) / hi);
    shownA = area(first);
    shownB = area(last);
  }
  const lf =
    trick === 'ventana' || trick === 'relacion-aspecto'
      ? NaN
      : lieFactor(shownA, shownB, dataA, dataB);
  const windowChange = effectSize(values[windowStart] ?? first, last);
  const fullChange = effectSize(first, last);

  const header =
    trick === 'ventana'
      ? `\\text{cambio en la ventana} = ${formatNumber(100 * windowChange, 1)}\\,\\%\\quad \\text{cambio en toda la serie} = ${formatNumber(100 * fullChange, 1)}\\,\\%`
      : trick === 'relacion-aspecto'
        ? `\\text{misma pendiente en los datos; ángulo dibujado} \\times ${formatNumber(stretch, 2)}\\ \\text{en altura}`
        : `\\text{factor de mentira} = \\frac{\\text{efecto en el gráfico}}{\\text{efecto en los datos}} = \\frac{${formatNumber(effectSize(shownA, shownB), 3)}}{${formatNumber(effectSize(dataA, dataB), 3)}} = ${formatNumber(lf, 2)}`;
  const description =
    `${TRICK_NAMES[trick]}, distorsión al ${formatNumber(100 * t, 0)} %. ` +
    (trick === 'ventana'
      ? `La ventana empieza en ${labels[windowStart] ?? ''}: cambio de ${formatNumber(100 * windowChange, 1)} % frente a ${formatNumber(100 * fullChange, 1)} % en toda la serie.`
      : trick === 'relacion-aspecto'
        ? `El mismo crecimiento se dibuja con una altura ${formatNumber(stretch, 2)} veces mayor por unidad de ancho.`
        : `Factor de mentira ${formatNumber(lf, 2)}.`);

  const barsPanel = (honest: boolean) => (
    <ChartSvg
      label={`${honest ? 'Versión honesta' : 'Versión distorsionada'}. ${description}`}
      aspect={0.75}
      minHeight={220}
      maxHeight={340}
      margins={{ top: 24, right: 12, bottom: 40, left: 52 }}
    >
      {(box) => {
        const base = honest ? 0 : baseline;
        const x = scaleBand<number>()
          .domain(values.map((_, i) => i))
          .range([box.inner.left, box.inner.left + box.inner.width])
          .padding(0.3);
        const y = scaleLinear()
          .domain([base, hi * 1.08])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        return (
          <g>
            <text x={box.inner.left} y={14} className={styles.chartLabel}>
              {honest ? 'Honesto' : 'Distorsionado'}
            </text>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
              label={variable}
            />
            {values.map((v, i) => (
              <g key={i}>
                <rect
                  x={x(i)}
                  y={y(v)}
                  width={x.bandwidth()}
                  height={Math.max(0, y(base) - y(v))}
                  fill={honest ? DATA_COLORS.primary : DATA_COLORS.secondary}
                />
                <text
                  x={(x(i) ?? 0) + x.bandwidth() / 2}
                  y={box.inner.top + box.inner.height + 16}
                  textAnchor="middle"
                  className={styles.chartLabel}
                >
                  {labels[i]}
                </text>
              </g>
            ))}
          </g>
        );
      }}
    </ChartSvg>
  );

  const pictogramPanel = (honest: boolean) => (
    <ChartSvg
      label={`${honest ? 'Versión honesta' : 'Versión distorsionada'}. ${description}`}
      aspect={0.75}
      minHeight={220}
      maxHeight={340}
      margins={{ top: 24, right: 12, bottom: 40, left: 12 }}
    >
      {(box) => {
        const n = values.length;
        const slot = box.inner.width / n;
        const maxSide = Math.min(slot * 0.9, box.inner.height);
        return (
          <g>
            <text x={box.inner.left} y={14} className={styles.chartLabel}>
              {honest ? 'Honesto: solo cambia la altura' : 'Distorsionado: cambian alto y ancho'}
            </text>
            {values.map((v, i) => {
              const h = (maxSide * v) / hi;
              const w = honest ? maxSide * 0.5 : (1 - t) * maxSide * 0.5 + t * h;
              const cx = box.inner.left + slot * (i + 0.5);
              const bottom = box.inner.top + box.inner.height;
              return (
                <g key={i}>
                  <rect
                    x={cx - w / 2}
                    y={bottom - h}
                    width={w}
                    height={h}
                    rx={4}
                    fill={honest ? DATA_COLORS.primary : DATA_COLORS.secondary}
                  />
                  <text x={cx} y={bottom + 16} textAnchor="middle" className={styles.chartLabel}>
                    {labels[i]}: {formatNumber(v, 1)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }}
    </ChartSvg>
  );

  const linePanel = (honest: boolean) => (
    <ChartSvg
      label={`${honest ? 'Versión honesta' : 'Versión distorsionada'}. ${description}`}
      aspect={0.75}
      minHeight={220}
      maxHeight={340}
      margins={{ top: 24, right: 12, bottom: 40, left: 52 }}
    >
      {(box) => {
        const from = !honest && trick === 'ventana' ? windowStart : 0;
        const shown = values.slice(from);
        const shownLabels = labels.slice(from);
        const ylo = !honest && trick === 'ventana' ? Math.min(...shown) : Math.min(0, lo);
        const yhi = !honest && trick === 'ventana' ? Math.max(...shown) : hi * 1.08;
        const squeeze = !honest && trick === 'relacion-aspecto' ? 1 / stretch : 1;
        const width = box.inner.width * squeeze;
        const x = scalePoint<number>()
          .domain(shown.map((_, i) => i))
          .range([box.inner.left, box.inner.left + width]);
        const y = scaleLinear()
          .domain([ylo, yhi])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        return (
          <g>
            <text x={box.inner.left} y={14} className={styles.chartLabel}>
              {honest ? 'Honesto' : 'Distorsionado'}
            </text>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={width}
              ticks={5}
              label={variable}
            />
            <polyline
              points={shown.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={honest ? DATA_COLORS.primary : DATA_COLORS.secondary}
              strokeWidth={2.5}
            />
            {shown.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r={3}
                fill={honest ? DATA_COLORS.primary : DATA_COLORS.secondary}
              />
            ))}
            {[0, shown.length - 1].map((i) => (
              <text
                key={i}
                x={x(i)}
                y={box.inner.top + box.inner.height + 16}
                textAnchor="middle"
                className={styles.chartLabel}
              >
                {shownLabels[i]}
              </text>
            ))}
          </g>
        );
      }}
    </ChartSvg>
  );

  const panel =
    trick === 'eje-truncado' ? barsPanel : trick === 'pictograma' ? pictogramPanel : linePanel;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Distorsión aplicada', value: `${formatNumber(100 * t, 0)} %` },
        ...(Number.isFinite(lf)
          ? [
              {
                label: 'Cambio en los datos',
                value: `${formatNumber(100 * effectSize(dataA, dataB), 1)} %`,
              },
              {
                label: 'Cambio dibujado',
                value: `${formatNumber(100 * effectSize(shownA, shownB), 1)} %`,
              },
              {
                label: 'Factor de mentira',
                value: formatNumber(lf, 2),
                color: DATA_COLORS.secondary,
              },
            ]
          : trick === 'ventana'
            ? [
                {
                  label: 'Cambio en toda la serie',
                  value: `${formatNumber(100 * fullChange, 1)} %`,
                },
                {
                  label: 'Cambio en la ventana',
                  value: `${formatNumber(100 * windowChange, 1)} %`,
                  color: DATA_COLORS.secondary,
                },
              ]
            : [
                {
                  label: 'Altura por unidad de ancho',
                  value: `${formatNumber(stretch, 2)} veces`,
                  color: DATA_COLORS.secondary,
                },
              ]),
      ]}
      legend={[
        { label: 'Versión honesta', color: DATA_COLORS.primary },
        { label: 'Versión distorsionada', color: DATA_COLORS.secondary },
      ]}
      description={description}
      dataTable={{
        caption: variable,
        columns: ['Etiqueta', variable],
        rows: labels.map((l, i) => [l, formatNumber(values[i] ?? 0, 2)]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        {panel(true)}
        {panel(false)}
      </div>
    </VizFrame>
  );
}
