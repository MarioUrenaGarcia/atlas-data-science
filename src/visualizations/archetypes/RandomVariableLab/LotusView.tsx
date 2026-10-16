import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { expectationOf, makePmf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import { LOTUS_FUNCTIONS, type RandomVariableLabConfig } from './schema.ts';
import { resolveSource, type VariableSource } from './source.ts';

const TERMS_PER_SECOND = 1.5;
const MAX_LISTED_TERMS = 5;
const ARROW_HEIGHT = 70;

type LotusFunction = (typeof LOTUS_FUNCTIONS)[number];

const FUNCTION_LABELS: Record<LotusFunction, string> = {
  cuadrado: 'g(x) = x²',
  'abs-centro': 'g(x) = |x - c|',
  lineal: 'g(x) = 2x + 1',
  exponencial: 'g(x) = 2^x',
  umbral: 'g(x) = 1 si x > c, 0 si no',
};

function makeFunction(id: LotusFunction, c: number): { g: (x: number) => number; tex: string } {
  switch (id) {
    case 'cuadrado':
      return { g: (x) => x * x, tex: 'x^2' };
    case 'abs-centro':
      return { g: (x) => Math.abs(x - c), tex: `|x - ${formatNumber(c, 2)}|` };
    case 'lineal':
      return { g: (x) => 2 * x + 1, tex: '2x + 1' };
    case 'exponencial':
      return { g: (x) => 2 ** x, tex: '2^{x}' };
    case 'umbral':
      return { g: (x) => (x > c ? 1 : 0), tex: `\\mathbf{1}\\{x > ${formatNumber(c, 2)}\\}` };
  }
}

interface LotusViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * The law of the unconscious statistician: E[g(X)] is computed directly from
 * the distribution of X as the sum of g(x) p(x), without first finding the
 * distribution of g(X). Arrows carry each value x to g(x), where values that
 * land on the same point pool their probability; both routes give the same
 * expectation, which in general differs from g(E[X]).
 */
export function LotusView({ title, config }: LotusViewProps) {
  const source = resolveSource(config);
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'funcion',
        label: 'Función g',
        options: LOTUS_FUNCTIONS.map((id) => ({ value: id, label: FUNCTION_LABELS[id] })),
        default: config.funcion ?? 'cuadrado',
      },
    ],
    [config.funcion],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const functionId = (values.funcion ?? 'cuadrado') as LotusFunction;
  const c = config.c ?? expectationOf(source.pmf);
  const { g, tex } = makeFunction(functionId, c);
  const { pmf } = source;
  const transformed = makePmf(pmf.values.map(g), pmf.probs);
  const lotus = expectationOf(pmf, g);
  const mean = expectationOf(pmf);
  const atMean = g(mean);
  const n = pmf.values.length;

  const [run, setRun] = useState(0);
  const [added, update] = useResettableState(`${functionId}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: added >= n,
  });
  const partial = pmf.values
    .slice(0, added)
    .reduce((sum, value, index) => sum + g(value) * (pmf.probs[index] ?? 0), 0);
  const s = source.symbol;
  const header = (() => {
    if (added === 0) return `\\mathbb{E}[g(${s})] = \\sum_x g(x)\\, p(x), \\qquad g(x) = ${tex}`;
    if (added >= n)
      return `\\mathbb{E}[g(${s})] = ${formatNumber(lotus, 3)} \\qquad g(\\mathbb{E}[${s}]) = g(${formatNumber(mean, 2)}) = ${formatNumber(atMean, 3)}`;
    const shown = pmf.values
      .slice(0, added)
      .map(
        (value, index) =>
          `${formatNumber(g(value), 2)} \\cdot ${formatNumber(pmf.probs[index] ?? 0, 3)}`,
      );
    const listed =
      shown.length > MAX_LISTED_TERMS
        ? [...shown.slice(0, 2), '\\cdots', ...shown.slice(-1)]
        : shown;
    return `\\mathbb{E}[g(${s})] \\approx ${listed.join(' + ')} + \\cdots = ${formatNumber(partial, 3)}`;
  })();
  const lo = Math.min(...transformed.values);
  const hi = Math.max(...transformed.values);
  const pad = Math.max(0.5, (hi - lo) * 0.05);
  const ySource: VariableSource = {
    ...source,
    pmf: transformed,
    symbol: 'g(X)',
    continuous: false,
    domain: [lo - pad, hi + pad],
  };
  const description =
    `${source.label}, con ${FUNCTION_LABELS[functionId]}. E[g(X)] = ${formatNumber(lotus, 3)}; g(E[X]) = ${formatNumber(atMean, 3)}. ` +
    `Distribución de g(X): ${transformed.values.map((value, index) => `${formatNumber(value, 2)} con ${formatNumber(transformed.probs[index] ?? 0, 3)}`).join('; ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'E[g(X)] por LOTUS', value: formatNumber(lotus, 3), color: DATA_COLORS.primary },
        {
          label: 'E[g(X)] con la distribución de g(X)',
          value: formatNumber(expectationOf(transformed), 3),
        },
        { label: 'g(E[X])', value: formatNumber(atMean, 3), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Valor ya sumado', color: DATA_COLORS.primary },
        { label: 'g aplicada a cada valor', color: DATA_COLORS.muted, shape: 'line' },
        { label: 'Distribución de g(X)', color: DATA_COLORS.tertiary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PmfChart
        source={source}
        label={description}
        aspect={0.3}
        color={(index) => (index < added ? DATA_COLORS.primary : DATA_COLORS.neutral)}
        markers={[
          {
            x: mean,
            label: `E[X] = ${formatNumber(mean, 2)}`,
            color: DATA_COLORS.secondary,
            dashed: true,
          },
        ]}
        showValues={false}
      />
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={ARROW_HEIGHT}
        maxHeight={ARROW_HEIGHT}
        margins={{ top: 4, right: 20, bottom: 4, left: 52 }}
      >
        {(box) => {
          const xTop = scaleLinear()
            .domain(source.domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const xBottom = scaleLinear()
            .domain(ySource.domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          return (
            <g aria-hidden="true">
              {pmf.values.map((value, index) => (
                <line
                  key={index}
                  x1={xTop(value)}
                  y1={box.inner.top}
                  x2={xBottom(g(value))}
                  y2={box.inner.top + box.inner.height}
                  stroke={index < added ? DATA_COLORS.primary : DATA_COLORS.muted}
                  strokeOpacity={index < added ? 0.9 : 0.35}
                  strokeWidth={index === added - 1 ? 2.5 : 1}
                />
              ))}
              <text
                x={box.inner.left + box.inner.width}
                y={box.inner.top + box.inner.height / 2}
                textAnchor="end"
                className={svgStyles.label}
              >
                g
              </text>
            </g>
          );
        }}
      </ChartSvg>
      <PmfChart
        source={ySource}
        label={description}
        aspect={0.3}
        color={() => DATA_COLORS.tertiary}
        markers={[
          { x: lotus, label: `E[g(X)] = ${formatNumber(lotus, 2)}`, color: DATA_COLORS.primary },
          {
            x: atMean,
            label: `g(E[X]) = ${formatNumber(atMean, 2)}`,
            color: DATA_COLORS.secondary,
            dashed: true,
          },
        ]}
        showValues={false}
      />
      <p className={styles.caption}>
        Las líneas llevan cada valor x a g(x). Valores distintos que caen en el mismo g(x) juntan su
        probabilidad en una sola barra de abajo.
      </p>
    </VizFrame>
  );
}
