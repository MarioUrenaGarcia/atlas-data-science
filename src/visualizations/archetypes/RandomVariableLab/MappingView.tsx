import { useMemo, useState } from 'react';
import { experiment, type ExperimentId } from '../../../lib/probability/sampleSpace.ts';
import { findVariable } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SpaceGrid } from '../SampleSpaceLab/SpaceGrid.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import { resolveSource, variableSelect } from './source.ts';

const SWEEP_SECONDS = 6;

interface MappingViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * A random variable as a function on the sample space. The sweep visits the
 * outcomes, writes X(omega) on each one and drops its probability into the
 * bar of that value, so the probability mass function is built from the
 * outcomes that share a value.
 */
export function MappingView({ title, config }: MappingViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dos-dados';
  const space = experiment(experimentId);
  const definitions = useMemo(() => variableSelect(config, true), [config]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const variableId = values.variable ?? '';
  const variable = findVariable(experimentId, variableId);
  const source = resolveSource(config, variableId);
  const map = variable?.map ?? (() => 0);
  const n = space.outcomes.length;

  const [run, setRun] = useState(0);
  const [scanned, update] = useResettableState(`${variableId}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    stepMany: (count) => update((value) => Math.min(n, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: n / SWEEP_SECONDS,
    done: scanned >= n,
  });

  // Probability accumulated so far in each value of the variable.
  const partial = source.pmf.values.map(
    (value) =>
      space.outcomes.slice(0, scanned).filter((outcome) => map(outcome) === value).length / n,
  );
  const current = scanned > 0 ? space.outcomes[scanned - 1] : undefined;
  const currentValue = current ? map(current) : undefined;
  const currentIndex = currentValue === undefined ? -1 : source.pmf.values.indexOf(currentValue);
  const symbol = variable?.symbol ?? 'X';
  const header =
    scanned >= n
      ? `p_{${symbol}}(x) = P(${symbol} = x) = \\frac{|\\{\\omega : ${symbol}(\\omega) = x\\}|}{|\\Omega|}`
      : current
        ? `${symbol}(${space.format(current)}) = ${formatNumber(currentValue ?? 0, 2)} \\quad P(${symbol} = ${formatNumber(currentValue ?? 0, 2)}) \\ge \\frac{${Math.round((partial[currentIndex] ?? 0) * n)}}{${n}}`
        : `${symbol} : \\Omega \\to \\mathbb{R}`;
  const description =
    `${space.label}. Variable: ${variable?.label ?? ''}. Revisados ${scanned} de ${n} resultados. ` +
    `Distribución: ${source.pmf.values.map((value, index) => `${formatNumber(value, 2)} con probabilidad ${formatNumber(source.pmf.probs[index] ?? 0, 3)}`).join('; ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Resultados revisados', value: `${scanned} de ${n}` },
        {
          label: 'Último resultado',
          value: current
            ? `${space.format(current)} da ${formatNumber(currentValue ?? 0, 2)}`
            : 'ninguno',
          color: DATA_COLORS.highlight,
        },
        { label: 'Valores distintos', value: String(source.pmf.values.length) },
      ]}
      legend={[
        { label: 'Probabilidad acumulada en cada valor', color: DATA_COLORS.primary },
        { label: 'Valor del último resultado', color: DATA_COLORS.highlight },
        { label: 'Distribución completa', color: DATA_COLORS.neutral },
      ]}
      description={description}
      dataTable={{
        caption: `Función de masa de ${symbol}`,
        columns: ['x', 'P(X = x)'],
        rows: source.pmf.values.map((value, index) => [
          formatNumber(value, 2),
          formatNumber(source.pmf.probs[index] ?? 0, 4),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>{variable ? `${symbol}: ${variable.label}.` : ''}</p>
      <SpaceGrid
        experiment={space}
        label={description}
        fill={(_, index) =>
          index === scanned - 1
            ? { color: DATA_COLORS.highlight, opacity: 0.85 }
            : index < scanned
              ? { color: DATA_COLORS.primary, opacity: 0.35 }
              : null
        }
        text={(outcome, index) =>
          index < scanned ? formatNumber(map(outcome), 0) : space.format(outcome)
        }
      />
      <p className={styles.caption}>
        Cada casilla revisada muestra el número que la variable le asigna.
      </p>
      <PmfChart
        source={source}
        label={description}
        probs={partial}
        yMax={Math.max(...source.pmf.probs) * 1.2}
        color={(index) => (index === currentIndex ? DATA_COLORS.highlight : DATA_COLORS.primary)}
        overlay={({ x, y }) =>
          source.pmf.values.map((value, index) => (
            <rect
              key={index}
              x={x(value) - 10}
              y={y(source.pmf.probs[index] ?? 0)}
              width={20}
              height={Math.max(0, y(0) - y(source.pmf.probs[index] ?? 0))}
              fill="none"
              stroke={DATA_COLORS.neutral}
              strokeDasharray="3 3"
              aria-hidden="true"
            />
          ))
        }
      />
    </VizFrame>
  );
}
