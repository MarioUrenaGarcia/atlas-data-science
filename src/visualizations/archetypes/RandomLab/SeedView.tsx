import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import styles from './RandomLab.module.css';
import type { RandomLabConfig } from './schema.ts';
import { take, uniformStream } from './sources.ts';

const SHOWN = 20;
const MARK = 4;

interface SeedViewProps {
  config: RandomLabConfig;
  title: string;
}

/**
 * Two runs of the Mersenne Twister side by side: with the same seed the
 * sequences coincide value by value, with seeds that differ by one they
 * share nothing. The first values of each run are listed under the chart.
 */
export function SeedView({ config, title }: SeedViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('a', 'Semilla de la primera corrida', 's₁', 0, 9999, 1, initial.a ?? 2024, 0),
      num('b', 'Semilla de la segunda corrida', 's₂', 0, 9999, 1, initial.b ?? 2024, 0),
    ],
    [initial.a, initial.b],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const first = useMemo(() => take(uniformStream('mt', Number(v.a)), SHOWN), [v.a]);
  const second = useMemo(() => take(uniformStream('mt', Number(v.b)), SHOWN), [v.b]);
  const equal = first.filter((u, i) => u === second[i]).length;
  const description =
    `Corrida con semilla ${v.a} y corrida con semilla ${v.b}: ${equal} de los primeros ${SHOWN} valores coinciden. ` +
    `Primeros valores: ${formatNumber(first[0] ?? 0, 4)} y ${formatNumber(second[0] ?? 0, 4)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: 'Valores que coinciden',
          value: `${equal} de ${SHOWN}`,
          color: DATA_COLORS.primary,
        },
        {
          label: 'Primer valor, corrida 1',
          value: formatNumber(first[0] ?? 0, 6),
          color: seriesColor(0),
        },
        {
          label: 'Primer valor, corrida 2',
          value: formatNumber(second[0] ?? 0, 6),
          color: seriesColor(1),
        },
      ]}
      legend={[
        { label: 'Corrida 1', color: seriesColor(0), shape: 'line' as const },
        { label: 'Corrida 2', color: seriesColor(1), shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`\\text{semilla } s \\;\\mapsto\\; u_1, u_2, \\dots,\\qquad s_1 = ${v.a},\\ s_2 = ${v.b}`}
      />
      <FunctionPlot
        xDomain={[0.5, SHOWN + 0.5]}
        yDomain={[0, 1]}
        label={description}
        xLabel="posición n en la secuencia"
        curves={[]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            <polyline
              points={first.map((u, i) => `${x(i + 1)},${y(u)}`).join(' ')}
              fill="none"
              stroke={seriesColor(0)}
              strokeWidth={2}
            />
            <polyline
              points={second.map((u, i) => `${x(i + 1)},${y(u)}`).join(' ')}
              fill="none"
              stroke={seriesColor(1)}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            {first.map((u, i) => (
              <circle key={`a${i}`} cx={x(i + 1)} cy={y(u)} r={MARK} fill={seriesColor(0)} />
            ))}
            {second.map((u, i) => (
              <circle key={`b${i}`} cx={x(i + 1)} cy={y(u)} r={MARK - 1.5} fill={seriesColor(1)} />
            ))}
          </g>
        )}
      </FunctionPlot>
      <p className={styles.sequence}>
        {first
          .slice(0, 6)
          .map((u) => formatNumber(u, 4))
          .join(', ')}{' '}
        ...
      </p>
      <p className={styles.sequence}>
        {second
          .slice(0, 6)
          .map((u) => formatNumber(u, 4))
          .join(', ')}{' '}
        ...
      </p>
    </VizFrame>
  );
}
