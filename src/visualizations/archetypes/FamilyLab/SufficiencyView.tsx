import { useState } from 'react';
import { Button } from '../../../components/ui/Button.tsx';
import { bernoulliLogLikelihood } from '../../../lib/distributions/families.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FamilyLab.module.css';
import type { FamilyLabConfig } from './schema.ts';

const DEFAULT_SEQUENCE = '1001100010';
/** Small margin that keeps the logarithms of the likelihood finite at the ends. */
const EDGE = 0.001;

interface SufficiencyViewProps {
  config: FamilyLabConfig;
  title: string;
}

/**
 * Sufficiency for Bernoulli trials: the likelihood of the edited sequence
 * (solid) and of the sequence with the same successes all at the end
 * (dashed) always coincide, because they depend on the data only through
 * the number of successes.
 */
export function SufficiencyView({ config, title }: SufficiencyViewProps) {
  const start = (config.secuencia ?? DEFAULT_SEQUENCE).split('').map(Number);
  const [trials, setTrials] = useState<number[]>(start);
  const n = trials.length;
  const k = trials.reduce((sum, value) => sum + value, 0);
  const sorted = [...new Array<number>(n - k).fill(0), ...new Array<number>(k).fill(1)];
  const likelihood = (sequence: readonly number[]) => (p: number) =>
    Math.exp(bernoulliLogLikelihood(sequence, Math.min(1 - EDGE, Math.max(EDGE, p))));
  const peak = likelihood(trials)(k / n);
  const description =
    `Secuencia ${trials.join('')} con ${k} éxitos en ${n} ensayos. Su verosimilitud coincide con la de ${sorted.join('')}; ` +
    `ambas alcanzan su máximo en p = ${formatNumber(k / n, 3)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{
        definitions: [],
        values: {},
        set: () => undefined,
        reset: () => setTrials(start),
      }}
      readouts={[
        { label: 'Ensayos n', value: String(n) },
        { label: 'Éxitos k = ΣXᵢ', value: String(k), color: DATA_COLORS.secondary },
        { label: 'Estimador de máxima verosimilitud k/n', value: formatNumber(k / n, 3) },
        { label: 'Verosimilitud máxima', value: formatNumber(peak, 6) },
      ]}
      legend={[
        {
          label: 'Verosimilitud de la secuencia',
          color: DATA_COLORS.primary,
          shape: 'line' as const,
        },
        {
          label: 'Verosimilitud con los éxitos al final',
          color: DATA_COLORS.secondary,
          shape: 'dashed' as const,
        },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`L(p) = \\prod_{i=1}^{${n}} p^{x_i}(1 - p)^{1 - x_i} = p^{${k}}(1 - p)^{${n - k}},\\qquad T(\\mathbf{x}) = \\textstyle\\sum_i x_i = ${k}`}
      />
      <div
        className={styles.trials}
        role="group"
        aria-label="Ensayos de la secuencia; cada botón cambia éxito por fracaso"
      >
        {trials.map((value, index) => (
          <Button
            key={index}
            size="small"
            variant={value === 1 ? 'primary' : 'secondary'}
            pressed={value === 1}
            aria-label={`Ensayo ${index + 1}: ${value === 1 ? 'éxito' : 'fracaso'}`}
            onClick={() =>
              setTrials((previous) => previous.map((x, j) => (j === index ? 1 - x : x)))
            }
          >
            {String(value)}
          </Button>
        ))}
      </div>
      <p className={styles.stage}>
        Ordenada: <span className={styles.mono}>{sorted.join('')}</span>
      </p>
      <FunctionPlot
        xDomain={[0, 1]}
        label={description}
        xLabel="p"
        curves={[
          { f: likelihood(trials), color: DATA_COLORS.primary, width: 3 },
          { f: likelihood(sorted), color: DATA_COLORS.secondary, dashed: true, width: 2 },
        ]}
      />
    </VizFrame>
  );
}
