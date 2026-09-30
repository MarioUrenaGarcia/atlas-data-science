import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { plainLabel, useFunctionChoice } from './useFunctionChoice.ts';

const FRAMES = 40;
const FRAMES_PER_SECOND = 25;
const RANGE = 3;
const STEP = 0.1;

const signed = (value: number) =>
  value < 0 ? `- ${formatNumber(-value, 2)}` : `+ ${formatNumber(value, 2)}`;

interface TransformViewProps {
  title: string;
  ids: readonly string[];
  initial: [number, number, number, number];
}

/**
 * The graph of g(x) = a f(b(x - h)) + k compared with the graph of f. The
 * animation moves from f to g: h and k translate the graph, b compresses it
 * horizontally and a stretches it vertically; negative values reflect it.
 */
export function TransformView({ title, ids, initial }: TransformViewProps) {
  const extra = useMemo(
    () =>
      (['a', 'b', 'h', 'k'] as const).map((key, index) => ({
        type: 'number' as const,
        key,
        label: {
          a: 'Estiramiento vertical',
          b: 'Compresión horizontal',
          h: 'Traslación horizontal',
          k: 'Traslación vertical',
        }[key],
        symbol: key,
        min: -RANGE,
        max: RANGE,
        step: STEP,
        default: initial[index] ?? 0,
        digits: 1,
      })),
    [initial],
  );
  const { parameters, values, fn } = useFunctionChoice(ids, extra);
  const [a, b, h, k] = (['a', 'b', 'h', 'k'] as const).map((key) => Number(values[key]));
  const [frame, setFrame] = useState(0);
  const playback = usePlayback({
    step: () => setFrame((value) => Math.min(FRAMES, value + 1)),
    reset: () => setFrame(0),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  const t = frame / FRAMES;
  const ca = 1 + ((a ?? 1) - 1) * t;
  const cb = 1 + ((b ?? 1) - 1) * t;
  const ch = (h ?? 0) * t;
  const ck = (k ?? 0) * t;
  const g = (x: number) => ca * fn.f(cb * (x - ch)) + ck;
  const pad = Math.abs(h ?? 0) + 1;
  const xDomain: [number, number] = [fn.domain[0] - pad, fn.domain[1] + pad];
  // The axes are fixed to the start and the end of the animation so they do not jump while it plays.
  const finalG = (x: number) => (a ?? 1) * fn.f((b ?? 1) * (x - (h ?? 0))) + (k ?? 0);
  const yDomain = autoYDomain(
    [
      { f: fn.f, color: '' },
      { f: finalG, color: '' },
    ],
    xDomain,
  );
  const description =
    `g(x) = ${formatNumber(a ?? 1, 1)} · f(${formatNumber(b ?? 1, 1)} (x ${signed(-(h ?? 0))})) ${signed(k ?? 0)} con f(x) = ${plainLabel(fn.id)}. ` +
    `${(a ?? 1) < 0 ? 'El signo negativo de a refleja la gráfica respecto al eje x. ' : ''}${(b ?? 1) < 0 ? 'El signo negativo de b la refleja respecto al eje y. ' : ''}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'a (estira en vertical)', value: formatNumber(a ?? 1, 2) },
        { label: 'b (comprime en horizontal)', value: formatNumber(b ?? 1, 2) },
        { label: 'h (mueve a la derecha)', value: formatNumber(h ?? 0, 2) },
        { label: 'k (mueve hacia arriba)', value: formatNumber(k ?? 0, 2) },
        { label: 'Avance de la transformación', value: `${Math.round(t * 100)} %` },
      ]}
      legend={[
        { label: 'f(x) original', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'g(x) transformada', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`g(x) = ${formatNumber(a ?? 1, 1)}\\, f\\big(${formatNumber(b ?? 1, 1)}(x ${signed(-(h ?? 0))})\\big) ${signed(k ?? 0)},\\quad f(x) = ${fn.latex}`}
        />
      </p>
      <FunctionPlot
        xDomain={xDomain}
        yDomain={yDomain}
        label={description}
        curves={[
          { f: fn.f, color: DATA_COLORS.muted, dashed: true, width: 2 },
          { f: g, color: DATA_COLORS.primary, width: 3 },
        ]}
      />
    </VizFrame>
  );
}
