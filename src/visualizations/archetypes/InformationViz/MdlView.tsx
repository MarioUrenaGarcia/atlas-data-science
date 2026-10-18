import { useMemo, useState } from 'react';
import { descriptionLength, polyfit, polyval } from '../../../lib/information/models.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { BarChart } from './BarChart.tsx';
import styles from './InformationViz.module.css';

const POINTS = 30;
const MAX_DEGREE = 8;
const STEPS_PER_SECOND = 0.8;
const DEFAULT_NOISE = 0.15;
const DEFAULT_SEED = 11;
const DOT_RADIUS = 4;
/** Matches the default aspect of the scatter so the two panels line up. */
const BAR_ASPECT = 0.6;
/** The data come from a cubic, so the shortest description should pick degree 3. */
const truth = (x: number) => x * x * x - x;

interface MdlViewProps {
  title: string;
  noise?: number;
  seed?: number;
}

/**
 * Minimum description length for polynomial regression. Describing the data
 * costs the bits of the model, about (d + 1)/2 log2 n, plus the bits of the
 * residuals given the model, about n/2 log2(RSS/n). The animation raises the
 * degree: the residual part falls and the model part grows, and the total
 * reaches its minimum at the degree that compresses the data best.
 */
export function MdlView({
  title,
  noise = DEFAULT_NOISE,
  seed: initialSeed = DEFAULT_SEED,
}: MdlViewProps) {
  const seed = useSeed(initialSeed);
  const { xs, ys } = useMemo(() => {
    const random = new Random(seed.seed);
    const x = Array.from({ length: POINTS }, (_, i) => -1 + (2 * i) / (POINTS - 1));
    return { xs: x, ys: x.map((xi) => truth(xi) + noise * random.normal()) };
  }, [seed.seed, noise]);
  const lengths = useMemo(
    () => Array.from({ length: MAX_DEGREE + 1 }, (_, d) => descriptionLength(xs, ys, d)),
    [xs, ys],
  );
  // The residual code length is defined up to a constant shared by every degree;
  // shifting it so its smallest value is zero keeps all bars positive.
  const shift = Math.min(...lengths.map((l) => l.data));
  const shifted = lengths.map((l) => ({
    model: l.model,
    data: l.data - shift,
    total: l.model + l.data - shift,
  }));
  const best = shifted.reduce((b, l, d) => (l.total < (shifted[b]?.total ?? Infinity) ? d : b), 0);
  const [degree, setDegree] = useState(0);
  const playback = usePlayback({
    step: () => setDegree((value) => Math.min(MAX_DEGREE, value + 1)),
    reset: () => setDegree(0),
    rate: STEPS_PER_SECOND,
    done: degree >= MAX_DEGREE,
  });
  const coefficients = useMemo(() => polyfit(xs, ys, degree), [xs, ys, degree]);
  const current = shifted[degree] ?? { model: 0, data: 0, total: 0 };
  const top = Math.max(...shifted.map((l) => l.total)) * 1.1 || 1;
  const description =
    `Grado ${degree}: modelo ${formatNumber(current.model, 1)} bits, residuos ${formatNumber(current.data, 1)} bits, ` +
    `total ${formatNumber(current.total, 1)} bits. El total mínimo se alcanza con grado ${best}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Grado d', value: String(degree) },
        {
          label: 'Bits del modelo',
          value: formatNumber(current.model, 1),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Bits de los residuos',
          value: formatNumber(current.data, 1),
          color: DATA_COLORS.primary,
        },
        { label: 'Total', value: formatNumber(current.total, 1), color: DATA_COLORS.highlight },
        { label: 'Grado con total mínimo', value: String(best) },
      ]}
      legend={[
        { label: 'Datos', color: DATA_COLORS.text, shape: 'circle' },
        { label: 'Polinomio ajustado', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Bits de los residuos', color: DATA_COLORS.primary },
        { label: 'Bits del modelo', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`L(d) = \\underbrace{\\tfrac{${degree + 1}}{2}\\log_2 ${POINTS}}_{${formatNumber(current.model, 1)}} + \\underbrace{\\tfrac{${POINTS}}{2}\\log_2\\tfrac{\\mathrm{RSS}}{${POINTS}}}_{${formatNumber(current.data, 1)}} = ${formatNumber(current.total, 1)}\\ \\text{bits}`}
      />
      <div className={styles.pair}>
        <FunctionPlot
          xDomain={[-1.1, 1.1]}
          yDomain={[-1, 1]}
          label={`Datos y polinomio de grado ${degree}. ${description}`}
          curves={[
            { f: (x) => polyval(coefficients, x), color: DATA_COLORS.highlight, width: 2.5 },
          ]}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {xs.map((xi, i) => (
                <circle
                  key={i}
                  cx={x(xi)}
                  cy={y(ys[i] ?? 0)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.text}
                  fillOpacity={0.7}
                />
              ))}
            </g>
          )}
        </FunctionPlot>
        <BarChart
          stacked
          series={[
            {
              values: shifted.map((l, d) => (d <= degree ? l.data : 0)),
              color: DATA_COLORS.primary,
            },
            {
              values: shifted.map((l, d) => (d <= degree ? l.model : 0)),
              color: DATA_COLORS.secondary,
            },
          ]}
          labels={shifted.map((_, d) => String(d))}
          yDomain={[0, top]}
          aspect={BAR_ASPECT}
          annotations={shifted.map((l, d) =>
            d > degree ? '' : d === best && degree >= best ? 'mín' : formatNumber(l.total, 0),
          )}
          label={`Longitud de descripción por grado. ${description}`}
        />
      </div>
    </VizFrame>
  );
}
