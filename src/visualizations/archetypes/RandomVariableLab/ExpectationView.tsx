import { useMemo, useState } from 'react';
import { expectationOf, makePmf, medianInterval } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import { resolveSource, variableSelect } from './source.ts';

const TERMS_PER_SECOND = 1.5;
const MAX_LISTED_TERMS = 6;
const FULCRUM = 12;

interface ExpectationViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * The expectation as the balance point of the distribution: bars are
 * weights on a beam and the fulcrum sits at E[X] = sum of x p(x). The
 * animation adds the terms x p(x) one at a time; dragging a bar changes the
 * probabilities (renormalized) and moves the balance point.
 */
export function ExpectationView({ title, config }: ExpectationViewProps) {
  const definitions = useMemo(() => variableSelect(config), [config]);
  const parameters = useParameters(definitions);
  const variableId = (parameters.values as Record<string, string>).variable;
  const source = resolveSource(config, variableId);
  const editable = Boolean(config.editable) && !source.continuous;
  const [version, setVersion] = useState(0);
  const [weights, updateWeights] = useResettableState(`${version}|${variableId}`, () => [
    ...source.pmf.probs,
  ]);
  const pmf = editable ? makePmf(source.pmf.values, weights) : source.pmf;
  const mean = expectationOf(pmf);
  const [m0, m1] = medianInterval(pmf);
  const n = pmf.values.length;
  const termCount = source.continuous ? 1 : n;

  const [run, setRun] = useState(0);
  const [added, update] = useResettableState(`${run}|${version}|${variableId}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(termCount, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: added >= termCount,
  });

  const s = source.symbol;
  const partial = pmf.values
    .slice(0, added)
    .reduce((sum, value, index) => sum + value * (pmf.probs[index] ?? 0), 0);
  const header = (() => {
    if (source.continuous) {
      return added === 0
        ? `\\mathbb{E}[${s}] = \\int x\\, f(x)\\, dx`
        : `\\mathbb{E}[${s}] = \\int x\\, f(x)\\, dx \\approx ${formatNumber(mean, 3)}`;
    }
    if (added === 0) return `\\mathbb{E}[${s}] = \\sum_x x\\, p(x)`;
    const shown = pmf.values
      .slice(0, added)
      .map(
        (value, index) =>
          `${formatNumber(value, 2)} \\cdot ${formatNumber(pmf.probs[index] ?? 0, 3)}`,
      );
    const listed =
      shown.length > MAX_LISTED_TERMS
        ? [...shown.slice(0, 2), '\\cdots', ...shown.slice(-2)]
        : shown;
    return `\\mathbb{E}[${s}] ${added < n ? '\\approx' : '='} ${listed.join(' + ')}${added < n ? ' + \\cdots' : ''} = ${formatNumber(added < n ? partial : mean, 3)}`;
  })();
  const description =
    `${source.label}. Esperanza ${formatNumber(mean, 3)}${added < termCount ? `, suma parcial ${formatNumber(partial, 3)}` : ''}. ` +
    `Mediana ${m0 === m1 ? formatNumber(m0, 2) : `entre ${formatNumber(m0, 2)} y ${formatNumber(m1, 2)}`}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={definitions.length > 0 ? parameters : undefined}
      controls={
        editable ? (
          <Button size="small" variant="ghost" onClick={() => setVersion((value) => value + 1)}>
            Restablecer las probabilidades
          </Button>
        ) : undefined
      }
      readouts={[
        {
          label: `E[${s.replace(/[_^{}]/g, '')}]`,
          value: formatNumber(mean, 3),
          color: DATA_COLORS.secondary,
        },
        ...(source.continuous ? [] : [{ label: 'Suma parcial', value: formatNumber(partial, 3) }]),
        {
          label: 'Mediana',
          value:
            m0 === m1 ? formatNumber(m0, 2) : `${formatNumber(m0, 2)} a ${formatNumber(m1, 2)}`,
        },
      ]}
      legend={[
        { label: 'Masa ya sumada', color: DATA_COLORS.primary },
        { label: 'Punto de equilibrio (esperanza)', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
      dataTable={
        source.continuous
          ? undefined
          : {
              caption: 'Términos de la esperanza',
              columns: ['x', 'p(x)', 'x p(x)'],
              rows: pmf.values.map((value, index) => [
                formatNumber(value, 2),
                formatNumber(pmf.probs[index] ?? 0, 4),
                formatNumber(value * (pmf.probs[index] ?? 0), 4),
              ]),
            }
      }
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PmfChart
        source={source}
        probs={pmf.probs}
        label={description}
        yMax={editable ? 0.7 : undefined}
        onEdit={
          editable
            ? (index, probability) =>
                updateWeights((previous) => {
                  // The dragged bar takes the new value and the others are rescaled to keep the total at one.
                  const rest = previous.reduce(
                    (sum, value, i) => (i === index ? sum : sum + value),
                    0,
                  );
                  const target = Math.min(0.99, probability);
                  return previous.map((value, i) =>
                    i === index
                      ? target
                      : rest > 0
                        ? (value / rest) * (1 - target)
                        : (1 - target) / (previous.length - 1),
                  );
                })
            : undefined
        }
        color={(index) =>
          source.continuous || index < added ? DATA_COLORS.primary : DATA_COLORS.neutral
        }
        opacity={(index) => (source.continuous || index < added ? 0.8 : 0.35)}
        markers={
          added >= termCount
            ? [{ x: mean, label: `E = ${formatNumber(mean, 2)}`, color: DATA_COLORS.secondary }]
            : []
        }
        overlay={({ x, bottom }) => (
          <polygon
            aria-hidden="true"
            points={`${x(mean)},${bottom + 2} ${x(mean) - FULCRUM},${bottom + 2 + FULCRUM * 1.4} ${x(mean) + FULCRUM},${bottom + 2 + FULCRUM * 1.4}`}
            fill={DATA_COLORS.secondary}
            fillOpacity={added >= termCount ? 0.9 : 0.3}
          />
        )}
      />
      <p className={styles.caption}>
        Las barras son pesos sobre una regla; el triángulo marca el punto donde la regla queda en
        equilibrio, que es la esperanza.
        {editable
          ? ' Al arrastrar una barra, las demás se reescalan para que la suma siga siendo 1.'
          : ''}
      </p>
    </VizFrame>
  );
}
