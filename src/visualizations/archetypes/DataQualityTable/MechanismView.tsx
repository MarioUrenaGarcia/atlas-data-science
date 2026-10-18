import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { type MissingMechanism, missingDemo } from '../../../lib/stats/eda.ts';
import { mean } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import type { SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const BATCHES = 20;
const BATCHES_PER_SECOND = 5;
const DOT = 3.5;

const NAMES: Record<MissingMechanism, string> = {
  mcar: 'Completamente al azar (MCAR)',
  mar: 'Al azar dada la edad (MAR)',
  mnar: 'Depende del propio ingreso (MNAR)',
};

interface MechanismViewProps {
  title: string;
  mechanism: MissingMechanism;
  n: number;
  seed: SeedState;
}

/**
 * Survey answers arrive in batches; the incomes that go unreported are drawn
 * hollow at their true value, which in a real survey would be unknown. The
 * mean of the reported incomes is compared with the true mean under each
 * missing-data mechanism.
 */
export function MechanismView({ title, mechanism: m0, n, seed }: MechanismViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'mecanismo',
        label: 'Mecanismo de los faltantes',
        options: (Object.keys(NAMES) as MissingMechanism[]).map((value) => ({
          value,
          label: NAMES[value],
        })),
        default: m0,
      },
      { type: 'toggle', key: 'verdad', label: 'Mostrar los ingresos no reportados', default: true },
    ],
    [m0],
  );
  const parameters = useParameters(definitions);
  const mechanism = String(parameters.values.mecanismo) as MissingMechanism;
  const showTruth = Boolean(parameters.values.verdad);
  const data = useMemo(() => missingDemo(mechanism, n, seed.seed), [mechanism, n, seed.seed]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${mechanism}|${seed.seed}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const k = Math.round((n * shown) / BATCHES);
  const idx = Array.from({ length: k }, (_, i) => i);
  const reported = idx.filter((i) => !data.missing[i]);
  const trueMean = mean(idx.map((i) => data.income[i] ?? 0));
  const obsMean = reported.length ? mean(reported.map((i) => data.income[i] ?? 0)) : Number.NaN;
  const rate = k ? (k - reported.length) / k : 0;
  const header = `\\bar{y}_{\\text{todos}} = ${formatNumber(trueMean, 2)},\\quad \\bar{y}_{\\text{reportados}} = ${formatNumber(obsMean, 2)},\\quad \\text{sesgo} = ${formatNumber(obsMean - trueMean, 2)}`;
  const description =
    `${NAMES[mechanism]}. ${k} encuestados, ${formatNumber(100 * rate, 1)} % sin ingreso reportado. ` +
    `Ingreso medio de todos ${formatNumber(trueMean, 2)} mil pesos, de los que reportan ${formatNumber(obsMean, 2)}.`;
  const yMax = Math.max(...data.income) * 1.05;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Encuestados', value: String(k) },
        { label: 'Sin ingreso reportado', value: `${formatNumber(100 * rate, 1)} %` },
        { label: 'Media verdadera', value: formatNumber(trueMean, 2) },
        {
          label: 'Media de los reportados',
          value: formatNumber(obsMean, 2),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Sesgo',
          value: formatNumber(obsMean - trueMean, 2),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Ingreso reportado', color: DATA_COLORS.primary, shape: 'circle' },
        {
          label: 'Ingreso no reportado (valor verdadero)',
          color: DATA_COLORS.secondary,
          shape: 'circle',
        },
        { label: 'Media de los reportados', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Media verdadera', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 12, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([18, 67])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={6}
                label="Ingreso mensual (miles de pesos)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="Edad (años)"
              />
              <g aria-hidden="true">
                {idx.map((i) =>
                  data.missing[i] ? (
                    showTruth ? (
                      <circle
                        key={i}
                        cx={x(data.age[i] ?? 0)}
                        cy={y(data.income[i] ?? 0)}
                        r={DOT}
                        fill="none"
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={1.5}
                      />
                    ) : null
                  ) : (
                    <circle
                      key={i}
                      cx={x(data.age[i] ?? 0)}
                      cy={y(data.income[i] ?? 0)}
                      r={DOT}
                      fill={DATA_COLORS.primary}
                      fillOpacity={0.7}
                    />
                  ),
                )}
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(trueMean)}
                  y2={y(trueMean)}
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                />
                {Number.isFinite(obsMean) && (
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(obsMean)}
                    y2={y(obsMean)}
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2.5}
                  />
                )}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
