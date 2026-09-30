import { useMemo, useState } from 'react';
import { TAYLOR_FUNCTIONS, taylorPolynomial } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const TERMS_PER_SECOND = 0.8;
const DOT_RADIUS = 5;
const Y_MARGIN = 0.4;

const NAMES: Record<string, string> = {
  exp: 'eˣ',
  sin: 'sen x',
  cos: 'cos x',
  log1p: 'log(1 + x)',
  geometric: '1 / (1 - x)',
};

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

/** LaTeX of the Taylor polynomial of the given order around x0 with its numeric coefficients. */
function polynomialLatex(
  derivativeAt: (n: number, x: number) => number,
  x0: number,
  order: number,
): string {
  const variable = x0 === 0 ? 'x' : `(x - ${formatNumber(x0, 2)})`;
  const terms: string[] = [];
  for (let n = 0; n <= order; n += 1) {
    const c = derivativeAt(n, x0) / factorial(n);
    if (Math.abs(c) < 1e-12) continue;
    const size = formatNumber(Math.abs(c), 4);
    const power = n === 0 ? '' : n === 1 ? variable : `${variable}^{${n}}`;
    const body = n === 0 ? size : `${size === '1' ? '' : size}${power}`;
    terms.push(`${c < 0 ? '-' : terms.length > 0 ? '+' : ''} ${body}`);
  }
  return terms.length > 0 ? terms.join(' ') : '0';
}

interface TaylorViewProps {
  title: string;
  ids: readonly string[];
  x0: number;
  maxOrder: number;
}

/**
 * Taylor polynomials of increasing order around x0. Each new term matches
 * one more derivative at x0, so the polynomial hugs the function over a
 * wider stretch; the error at a test point shrinks while it is inside the
 * interval of convergence.
 */
export function TaylorView({ title, ids, x0, maxOrder }: TaylorViewProps) {
  const definitions = useMemo(
    () => [
      ...(ids.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'funcion',
              label: 'Función',
              options: ids.map((id) => ({ value: id, label: NAMES[id] ?? id })),
              default: ids[0] ?? 'exp',
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'punto',
        label: 'Punto de prueba',
        symbol: 'x',
        min: -4,
        max: 4,
        step: 0.1,
        default: 1.5,
        digits: 1,
      },
    ],
    [ids],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const id = ids.length > 1 ? String(values.funcion) : (ids[0] ?? 'exp');
  const fn = TAYLOR_FUNCTIONS[id] ?? TAYLOR_FUNCTIONS.exp;
  const [order, setOrder] = useState(0);
  const playback = usePlayback({
    step: () => setOrder((value) => Math.min(maxOrder, value + 1)),
    reset: () => setOrder(0),
    rate: TERMS_PER_SECOND,
    done: order >= maxOrder,
  });
  if (!fn) return null;
  const [lo, hi] = fn.domain;
  const test = Math.max(lo, Math.min(hi, Number(values.punto)));
  const polynomial = taylorPolynomial(fn, x0, order);
  const exact = fn.f(test);
  const approx = polynomial(test);
  const [y0, y1] = autoYDomain([{ f: fn.f, color: '' }], fn.domain);
  const pad = (y1 - y0) * Y_MARGIN;
  const description =
    `Polinomio de Taylor de ${NAMES[id] ?? id} de orden ${order} alrededor de ${formatNumber(x0, 2)}. En x = ${formatNumber(test, 2)}: ` +
    `función ${formatNumber(exact, 4)}, polinomio ${formatNumber(approx, 4)}, error ${formatNumber(Math.abs(exact - approx), 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Orden n', value: String(order) },
        {
          label: 'f(x) en el punto de prueba',
          value: formatNumber(exact, 5),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Pₙ(x) en el punto de prueba',
          value: formatNumber(approx, 5),
          color: DATA_COLORS.secondary,
        },
        { label: 'Error |f(x) - Pₙ(x)|', value: formatNumber(Math.abs(exact - approx), 4) },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Polinomio de Taylor', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Punto de prueba', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`P_{${order}}(x) = ${polynomialLatex(fn.derivativeAt, x0, order)}`} />
      </p>
      <FunctionPlot
        xDomain={fn.domain}
        yDomain={[y0 - pad, y1 + pad]}
        label={description}
        curves={[
          { f: fn.f, color: DATA_COLORS.primary, width: 3 },
          { f: polynomial, color: DATA_COLORS.secondary, width: 2.5 },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <circle cx={s.x(x0)} cy={s.y(fn.f(x0))} r={DOT_RADIUS} fill={DATA_COLORS.text} />
            <line
              x1={s.x(test)}
              x2={s.x(test)}
              y1={s.y(exact)}
              y2={s.y(approx)}
              stroke={DATA_COLORS.highlight}
              strokeWidth={2}
            />
            <circle cx={s.x(test)} cy={s.y(exact)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
