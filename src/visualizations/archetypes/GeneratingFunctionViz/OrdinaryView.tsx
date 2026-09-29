import { useMemo, useState } from 'react';
import { ordinaryProducts } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CoefficientBars } from './CoefficientBars.tsx';
import styles from './GeneratingFunctionViz.module.css';

const FACTORS_PER_SECOND = 0.6;

interface OrdinaryViewProps {
  title: string;
  parts: readonly number[];
  name: string;
  target: number;
  once: boolean;
}

/** Factor 1 + x^s + x^(2s) + ... (or 1 + x^s when each part is used at most once), in LaTeX. */
function factorLatex(size: number, once: boolean): string {
  const power = (exponent: number) => (exponent === 1 ? 'x' : `x^{${exponent}}`);
  return once ? `(1 + ${power(size)})` : `(1 + ${power(size)} + ${power(2 * size)} + \\cdots)`;
}

/**
 * Ordinary generating function of the ways to reach each total with the given
 * part sizes. Each factor lists how many times one size is used; multiplying
 * the factors one at a time updates every coefficient at once, and the
 * coefficient of x^n is the number of ways to reach n.
 */
export function OrdinaryView({ title, parts, name, target, once }: OrdinaryViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'objetivo',
        label: 'Total buscado',
        symbol: 'n',
        min: 1,
        max: 40,
        step: 1,
        default: target,
      },
      {
        type: 'toggle' as const,
        key: 'unaVez',
        label: `Cada ${name} a lo más una vez`,
        default: once,
      },
    ],
    [target, name, once],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const goal = Number(values.objetivo);
  const atMostOnce = Boolean(values.unaVez);
  const degree = Math.max(goal, 12);
  const steps = useMemo(
    () => ordinaryProducts(parts, degree, atMostOnce ? 1 : undefined),
    [parts, degree, atMostOnce],
  );
  const [run, setRun] = useState(0);
  const [applied, update] = useResettableState<number>(`${degree}|${atMostOnce}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(parts.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: FACTORS_PER_SECOND,
    done: applied >= parts.length,
  });
  const initial = [1, ...Array.from({ length: degree }, () => 0)];
  const coefficients = applied === 0 ? initial : (steps[applied - 1] ?? initial);
  const previous = applied <= 1 ? initial : steps[applied - 2];
  const usedParts = parts.slice(0, applied);
  const ways = coefficients[goal] ?? 0;
  const product =
    usedParts.length === 0 ? '1' : usedParts.map((size) => factorLatex(size, atMostOnce)).join('');
  const description =
    `Factores multiplicados: ${applied} de ${parts.length} (${name}s de ${usedParts.join(', ') || 'ninguna denominación'}). ` +
    `El coeficiente de x^${goal} es ${ways}: hay ${ways} maneras de formar ${goal} con esas partes.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Factores aplicados', value: `${applied} de ${parts.length}` },
        { label: `Partes usadas`, value: usedParts.join(', ') || 'ninguna' },
        { label: `Coeficiente de x^${goal}`, value: String(ways), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Coeficientes actuales', color: DATA_COLORS.primary },
        { label: 'Antes del último factor', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Coeficientes del producto',
        columns: ['n', 'maneras'],
        rows: coefficients.map((value, index) => [index, value]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={`G(x) = ${product}`} />
      </p>
      <CoefficientBars
        coefficients={coefficients}
        previous={applied === 0 ? undefined : previous}
        highlight={goal}
        label={description}
        axisLabel="n (exponente de x)"
      />
    </VizFrame>
  );
}
