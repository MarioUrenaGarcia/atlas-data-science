import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';

const ZOOM_LEVELS = 5;
const BASE_WIDTH = 10;
const ZOOM_FACTOR = 10;
const STEPS_PER_SECOND = 0.6;
const PANEL_GAP = 70;
const DOT_RADIUS = 7;

interface ValuesViewProps {
  title: string;
  discrete: { name: string; unit: string; from: number };
  continuous: { name: string; unit: string; from: number; value: number };
}

function windowAround(center: number, level: number): [number, number] {
  const width = BASE_WIDTH / ZOOM_FACTOR ** level;
  return [center - width / 2, center + width / 2];
}

/**
 * Zooms into a discrete and a continuous variable at the same time. The
 * discrete one runs out of possible values between two consecutive counts;
 * the continuous one keeps showing new values at every magnification.
 */
export function ValuesView({ title, discrete, continuous }: ValuesViewProps) {
  const [level, setLevel] = useState(0);
  const playback = usePlayback({
    step: () => setLevel((value) => Math.min(ZOOM_LEVELS - 1, value + 1)),
    reset: () => setLevel(0),
    rate: STEPS_PER_SECOND,
    done: level >= ZOOM_LEVELS - 1,
  });
  // The widest window starts at -0.5 at most, so no impossible negative counts are drawn.
  const discreteCenter =
    level === 0 ? Math.max(discrete.from + 0.5, BASE_WIDTH / 2 - 0.5) : discrete.from + 0.5;
  const discreteWindow = windowAround(discreteCenter, level);
  const continuousWindow = windowAround(continuous.value, level);
  const integers: number[] = [];
  for (let k = Math.ceil(discreteWindow[0]); k <= Math.floor(discreteWindow[1]); k += 1) {
    if (k >= 0) integers.push(k);
  }
  const width = BASE_WIDTH / ZOOM_FACTOR ** level;
  const shownValue = formatNumber(continuous.value, Math.min(6, level + 1));
  const description =
    `Ventana de ancho ${formatNumber(width, 5)}. ${discrete.name}: ${integers.length} valores posibles en la ventana` +
    `${integers.length > 0 ? ` (${integers.join(', ')})` : ''}. ${continuous.name}: infinitos valores posibles; ` +
    `con esta resolución la medición se lee como ${shownValue} ${continuous.unit}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Ancho de la ventana', value: formatNumber(width, 5) },
        {
          label: `Valores posibles de ${discrete.name.toLowerCase()}`,
          value: String(integers.length),
          color: DATA_COLORS.secondary,
        },
        {
          label: `Valores posibles de ${continuous.name.toLowerCase()}`,
          value: 'infinitos',
          color: DATA_COLORS.primary,
        },
        { label: 'Lectura de la medición', value: `${shownValue} ${continuous.unit}` },
      ]}
      legend={[
        { label: `${discrete.name} (se cuenta)`, color: DATA_COLORS.secondary, shape: 'circle' },
        { label: `${continuous.name} (se mide)`, color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\text{ventana de ancho } 10^{${1 - level}}:\\quad ${integers.length}\\ \\text{valores enteros}\\quad\\text{frente a}\\quad \\text{un continuo de valores}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={380}
        margins={{ top: 28, right: 24, bottom: 40, left: 24 }}
      >
        {(box) => {
          const panel = (box.inner.height - PANEL_GAP) / 2;
          const yDiscrete = box.inner.top + panel;
          const yContinuous = box.inner.top + panel * 2 + PANEL_GAP;
          const xd = scaleLinear()
            .domain(discreteWindow)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const xc = scaleLinear()
            .domain(continuousWindow)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          return (
            <g>
              <text x={box.inner.left} y={box.inner.top - 10} className={styles.chartLabel}>
                {`${discrete.name} (${discrete.unit})`}
              </text>
              {integers.length === 0 && (
                <text
                  x={box.inner.left + box.inner.width / 2}
                  y={yDiscrete - 20}
                  textAnchor="middle"
                  className={styles.chartLabel}
                >
                  Ningún valor posible en esta ventana
                </text>
              )}
              {integers.map((k) => (
                <circle
                  key={k}
                  cx={xd(k)}
                  cy={yDiscrete - 14}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.secondary}
                />
              ))}
              <Axis
                scale={xd}
                orientation="bottom"
                position={yDiscrete}
                ticks={6}
                format={(v) => v.toFixed(Math.max(0, level))}
              />
              <text x={box.inner.left} y={yContinuous - panel + 6} className={styles.chartLabel}>
                {`${continuous.name} (${continuous.unit})`}
              </text>
              <rect
                x={box.inner.left}
                y={yContinuous - 20}
                width={box.inner.width}
                height={10}
                fill={DATA_COLORS.primary}
                fillOpacity={0.55}
                rx={3}
              />
              <line
                x1={xc(continuous.value)}
                x2={xc(continuous.value)}
                y1={yContinuous - 34}
                y2={yContinuous}
                stroke={DATA_COLORS.highlight}
                strokeWidth={3}
              />
              <text
                x={xc(continuous.value)}
                y={yContinuous - 40}
                textAnchor="middle"
                className={styles.chartLabel}
              >
                {`${shownValue} ${continuous.unit}`}
              </text>
              <Axis
                scale={xc}
                orientation="bottom"
                position={yContinuous}
                ticks={5}
                format={(v) => v.toFixed(level + 1)}
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
