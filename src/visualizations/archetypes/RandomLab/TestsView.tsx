import { useMemo } from 'react';
import { chiSquare, normal } from '../../../lib/distributions/index.ts';
import { frequencyTest, runsUpDown, serialCorrelation } from '../../../lib/random/generators.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Bars } from '../../core/svg/Bars.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import { GENERATOR_IDS, type GeneratorId, type RandomLabConfig } from './schema.ts';
import { GENERATOR_LABELS, take, uniformStream } from './sources.ts';

const ALPHA = 0.05;

interface TestsViewProps {
  config: RandomLabConfig;
  title: string;
}

/**
 * Statistical tests applied to the output of a generator: the frequency
 * test compares the counts in k bins with n/k through a chi-squared
 * statistic, the runs test counts ups and downs, and the serial
 * correlation looks for dependence between neighbors.
 */
export function TestsView({ config, title }: TestsViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select' as const,
        key: 'generador',
        label: 'Generador',
        options: GENERATOR_IDS.map((id) => ({ value: id, label: GENERATOR_LABELS[id] })),
        default: config.generador ?? 'mt',
      },
      num('n', 'Tamaño de la muestra', 'n', 100, 10000, 100, initial.n ?? 2000, 0),
      num('k', 'Número de clases', 'k', 2, 20, 1, initial.k ?? 10, 0),
      num('semilla', 'Semilla del generador', 's', 1, 9999, 1, initial.semilla ?? 7, 0),
    ],
    [config.generador, initial.n, initial.k, initial.semilla],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, string | number>;
  const id = v.generador as GeneratorId;
  const n = Number(v.n);
  const k = Number(v.k);
  const values = useMemo(() => take(uniformStream(id, Number(v.semilla)), n), [id, n, v.semilla]);
  const frequency = frequencyTest(values, k);
  const pFrequency = 1 - chiSquare(frequency.degrees).cdf(frequency.statistic);
  const runs = runsUpDown(values);
  const pRuns = 2 * normal(0, 1).cdf(-Math.abs(runs.z));
  const correlation = serialCorrelation(values);
  const verdict = (p: number) => (p < ALPHA ? 'se rechaza la uniformidad' : 'no se rechaza');
  const bars = frequency.counts.map((count, i) => ({
    x0: i / k,
    x1: (i + 1) / k,
    value: count,
    color:
      Math.abs(count - frequency.expected) > 2 * Math.sqrt(frequency.expected)
        ? DATA_COLORS.secondary
        : DATA_COLORS.primary,
  }));
  const description =
    `${GENERATOR_LABELS[id]} con ${n} valores en ${k} clases. Ji cuadrada ${formatNumber(frequency.statistic, 2)} con ${frequency.degrees} grados, valor p ${formatProbability(pFrequency)}. ` +
    `Corridas ${runs.runs} frente a ${formatNumber(runs.expected, 1)} esperadas, valor p ${formatProbability(pRuns)}. Correlación serial ${formatNumber(correlation, 3)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: 'Ji cuadrada de frecuencias',
          value: formatNumber(frequency.statistic, 2),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Valor p de frecuencias',
          value: `${formatProbability(pFrequency)}: ${verdict(pFrequency)}`,
        },
        {
          label: 'Corridas observadas y esperadas',
          value: `${runs.runs} y ${formatNumber(runs.expected, 1)}`,
        },
        { label: 'Valor p de corridas', value: `${formatProbability(pRuns)}: ${verdict(pRuns)}` },
        { label: 'Correlación serial', value: formatNumber(correlation, 4) },
      ]}
      legend={[
        { label: 'Conteo por clase', color: DATA_COLORS.primary },
        { label: 'Clase a más de dos desviaciones de lo esperado', color: DATA_COLORS.secondary },
        { label: 'Conteo esperado n/k', color: DATA_COLORS.text, shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`\\chi^{2} = \\sum_{j=1}^{${k}} \\frac{(O_j - ${formatNumber(frequency.expected, 1)})^{2}}{${formatNumber(frequency.expected, 1)}} = ${formatNumber(frequency.statistic, 2)},\\quad p = ${formatNumber(pFrequency, 4)}`}
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, Math.max(...frequency.counts, frequency.expected) * 1.15]}
        label={description}
        xLabel="clase del valor u"
        curves={[{ f: () => frequency.expected, color: DATA_COLORS.text, dashed: true }]}
        background={({ x, y }) => (
          <Bars
            bars={bars}
            xScale={x}
            yScale={y}
            color={DATA_COLORS.primary}
            opacity={0.8}
            gap={2}
          />
        )}
      />
    </VizFrame>
  );
}
