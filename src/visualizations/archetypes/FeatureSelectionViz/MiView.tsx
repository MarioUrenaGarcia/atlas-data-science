import { useMemo, useState } from 'react';
import { binnedMutualInformation, correlationScores } from '../../../lib/dataprep/selection.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import { ScatterFrame } from '../../shared/ScatterCharts.tsx';
import { cropData, CROP_FEATURES, ROLE_NAMES } from './cropData.ts';
import styles from './FeatureSelectionViz.module.css';

const BINS = 6;
const TRAIN = 400;
const FEATURES_PER_SECOND = 1.2;

/**
 * Each variable is scored by its mutual information with the yield, from a
 * two-dimensional histogram, next to its absolute correlation. Temperature,
 * whose effect is an inverted U, has almost no correlation but clear mutual
 * information.
 */
export function MiView({
  title,
  variable,
  seed: seed0,
}: {
  title: string;
  variable: number;
  seed: number;
}) {
  const seed = useSeed(seed0);
  const data = useMemo(() => cropData(seed.seed, TRAIN), [seed.seed]);
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'variable',
      label: 'Variable del diagrama de dispersión',
      options: data.names.map((n, j) => ({ value: String(j), label: n })),
      default: String(variable),
    },
  ];
  const parameters = useParameters(definitions);
  const chosen = Number(parameters.values.variable);
  const corr = useMemo(() => correlationScores(data), [data]);
  const mi = useMemo(
    () =>
      data.names.map((_, j) =>
        binnedMutualInformation(
          data.train.x.map((r) => r[j] ?? 0),
          data.train.y,
          BINS,
        ),
      ),
    [data],
  );
  const total = mi.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: FEATURES_PER_SECOND,
    done: shown >= total,
  });
  const current = shown > 0 ? shown - 1 : -1;
  const g = (v: number) => formatNumber(v, 3);
  const header =
    current >= 0
      ? `\\hat{I}(\\text{${data.names[current]}};\\ y) = \\sum_{a,b} \\hat{p}_{ab} \\log\\frac{\\hat{p}_{ab}}{\\hat{p}_{a}\\,\\hat{p}_{b}} = ${g(mi[current] ?? 0)}\\ \\text{nats},\\quad |r| = ${g(corr[current] ?? 0)}`
      : `\\hat{I}(x;\\ y) = \\sum_{a,b} \\hat{p}_{ab} \\log\\frac{\\hat{p}_{ab}}{\\hat{p}_{a}\\,\\hat{p}_{b}}`;
  const description =
    `Información mutua estimada con ${BINS} intervalos por eje y ${TRAIN} parcelas: ` +
    data.names.map((n, j) => `${n} ${g(mi[j] ?? 0)} nats (|r| ${g(corr[j] ?? 0)})`).join(', ') +
    '.';
  const xs = data.train.x.map((r) => r[chosen] ?? 0);
  const pad = (v: readonly number[]): [number, number] => {
    const lo = Math.min(...v);
    const hi = Math.max(...v);
    return [lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05];
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Variables evaluadas', value: `${shown} de ${total}` },
        {
          label: `Información mutua de ${data.names[chosen]?.toLowerCase() ?? ''}`,
          value: `${g(mi[chosen] ?? 0)} nats`,
          color: DATA_COLORS.highlight,
        },
        {
          label: `Correlación absoluta de ${data.names[chosen]?.toLowerCase() ?? ''}`,
          value: g(corr[chosen] ?? 0),
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Puntajes de cada variable',
        columns: ['Variable', 'Papel en los datos simulados', 'Información mutua (nats)', '|r|'],
        rows: data.names.map((n, j) => [
          n,
          ROLE_NAMES[CROP_FEATURES[j]?.role ?? 'ruido'],
          g(mi[j] ?? 0),
          g(corr[j] ?? 0),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Información mutua con el rendimiento</h4>
          <HBars
            labels={data.names}
            values={mi.map((v, j) => (j < shown ? v : 0))}
            highlight={chosen}
            axisLabel="Información mutua (nats)"
            decimals={3}
            labelWidth={136}
            label={description}
          />
          <h4 className={styles.panelTitle}>Correlación absoluta con el rendimiento</h4>
          <HBars
            labels={data.names}
            values={corr.map((v, j) => (j < shown ? v : 0))}
            highlight={chosen}
            axisLabel="|r|"
            decimals={2}
            domain={[0, 1]}
            labelWidth={136}
            label={description}
          />
        </div>
        <ScatterFrame
          xDomain={pad(xs)}
          yDomain={pad(data.train.y)}
          xLabel={`${data.names[chosen] ?? ''} (estandarizada)`}
          yLabel="Rendimiento simulado"
          label={description}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {xs.map((v, i) => (
                <circle
                  key={i}
                  cx={x(v)}
                  cy={y(data.train.y[i] ?? 0)}
                  r={2.5}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.45}
                />
              ))}
            </g>
          )}
        </ScatterFrame>
      </div>
    </VizFrame>
  );
}
