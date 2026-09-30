import { useMemo, useState } from 'react';
import { CALC_FUNCTIONS } from '../../../lib/calculus/catalog.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { plainLabel } from './useFunctionChoice.ts';

const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.75;
const SWEEP_STEPS = 120;
const STEPS_PER_SECOND = 15;
/** Fraction of the plotted width covered by each tangent segment. */
const TANGENT_FRACTION = 0.18;

interface ChainViewProps {
  title: string;
  outerId: string;
  innerId: string;
  x0: number;
}

/**
 * The chain rule in three linked graphs: the inner function g near x, the
 * outer function f near u = g(x), and the composition f(g(x)). The slope of
 * the composition is the product of the two slopes, because a small change
 * in x is first multiplied by g'(x) and then by f'(u).
 */
export function ChainView({ title, outerId, innerId, x0 }: ChainViewProps) {
  const outer = CALC_FUNCTIONS[outerId] ?? CALC_FUNCTIONS.seno;
  const inner = CALC_FUNCTIONS[innerId] ?? CALC_FUNCTIONS.cuadrada;
  const [lo, hi] = inner?.domain ?? [-2, 2];
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Punto',
        symbol: 'x',
        min: lo,
        max: hi,
        step: (hi - lo) / 100,
        default: x0,
        digits: 2,
      },
    ],
    [lo, hi, x0],
  );
  const parameters = useParameters(definitions);
  const slider = Number((parameters.values as Record<string, number>).x);
  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => ((value ?? 0) + 1) % (SWEEP_STEPS + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
  });
  if (!outer || !inner) return null;
  const x = sweep === null ? slider : lo + ((hi - lo) * sweep) / SWEEP_STEPS;
  const u = inner.f(x);
  const gSlope = inner.df(x);
  const fSlope = outer.df(u);
  const chain = fSlope * gSlope;
  const composite = (t: number) => outer.f(inner.f(t));
  const uValues = Array.from({ length: 101 }, (_, i) => inner.f(lo + ((hi - lo) * i) / 100)).filter(
    Number.isFinite,
  );
  const uDomain: [number, number] = [Math.min(...uValues) - 0.2, Math.max(...uValues) + 0.2];
  const description =
    `x = ${formatNumber(x, 2)}, u = g(x) = ${formatNumber(u, 3)}. g'(x) = ${formatNumber(gSlope, 3)}, f'(u) = ${formatNumber(fSlope, 3)}; ` +
    `la pendiente de f(g(x)) es su producto, ${formatNumber(chain, 3)}. Exterior ${plainLabel(outer.id)}, interior ${plainLabel(inner.id)}.`;
  const tangent = (x1: number, y1: number, slope: number, width: number) => ({
    f: (t: number) => y1 + slope * (t - x1),
    color: DATA_COLORS.highlight,
    width: 2,
    from: x1 - width * TANGENT_FRACTION,
    to: x1 + width * TANGENT_FRACTION,
  });

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'x', value: formatNumber(x, 3) },
        { label: 'u = g(x)', value: formatNumber(u, 3) },
        { label: "g'(x)", value: formatNumber(gSlope, 3), color: DATA_COLORS.primary },
        { label: "f'(u)", value: formatNumber(fSlope, 3), color: DATA_COLORS.secondary },
        { label: "f'(g(x)) · g'(x)", value: formatNumber(chain, 3), color: DATA_COLORS.tertiary },
      ]}
      legend={[
        { label: 'Recta tangente en el punto actual', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`(f \\circ g)'(x) = f'(g(x))\\,g'(x) = ${formatNumber(fSlope, 3)} \\cdot ${formatNumber(gSlope, 3)} = ${formatNumber(chain, 3)},\\quad f(u) = ${outer.latex.replace(/x/g, 'u')},\\ g(x) = ${inner.latex}`}
        />
      </p>
      <div className={styles.trio}>
        <div>
          <p className={styles.panelTitle}>Interior: u = g(x)</p>
          <FunctionPlot
            xDomain={[lo, hi]}
            label={`Función interior. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={180}
            curves={[
              { f: inner.f, color: DATA_COLORS.primary, width: 3 },
              tangent(x, u, gSlope, hi - lo),
            ]}
          >
            {(s) => (
              <circle
                aria-hidden="true"
                cx={s.x(x)}
                cy={s.y(u)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
              />
            )}
          </FunctionPlot>
        </div>
        <div>
          <p className={styles.panelTitle}>Exterior: f(u)</p>
          <FunctionPlot
            xDomain={uDomain}
            yDomain={autoYDomain([{ f: outer.f, color: '' }], uDomain)}
            label={`Función exterior. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={180}
            xLabel="u"
            curves={[
              { f: outer.f, color: DATA_COLORS.secondary, width: 3 },
              tangent(u, outer.f(u), fSlope, uDomain[1] - uDomain[0]),
            ]}
          >
            {(s) => (
              <circle
                aria-hidden="true"
                cx={s.x(u)}
                cy={s.y(outer.f(u))}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
              />
            )}
          </FunctionPlot>
        </div>
        <div>
          <p className={styles.panelTitle}>Composición: f(g(x))</p>
          <FunctionPlot
            xDomain={[lo, hi]}
            yDomain={autoYDomain([{ f: composite, color: '' }], [lo, hi])}
            label={`Composición. ${description}`}
            aspect={PANEL_ASPECT}
            minHeight={180}
            curves={[
              { f: composite, color: DATA_COLORS.tertiary, width: 3 },
              tangent(x, composite(x), chain, hi - lo),
            ]}
          >
            {(s) => (
              <circle
                aria-hidden="true"
                cx={s.x(x)}
                cy={s.y(composite(x))}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
              />
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
