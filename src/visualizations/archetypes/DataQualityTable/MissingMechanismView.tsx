import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, median } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './Quality.module.css';
import { MECHANISM_LABELS, padded, SCENARIO, scenarioPoints } from './missingData.ts';
import { MECHANISMS, type MechanismId } from './schema.ts';

const POINTS_PER_SECOND = 40;
const DOT = 4;

interface MissingMechanismViewProps {
  title: string;
  mechanism: MechanismId;
  rate: number;
  strength: number;
  n: number;
  hidden: boolean;
  seed: number;
}

/**
 * Pairs of age and income in which some incomes go missing. The mechanism
 * decides which ones: at random (MCAR), more often at some ages (MAR) or
 * more often when the income itself is high (MNAR). The hidden values,
 * known only in a simulation, show the bias of the observed mean.
 */
export function MissingMechanismView(props: MissingMechanismViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'mecanismo',
      label: 'Mecanismo',
      options: MECHANISMS.map((m) => ({ value: m, label: MECHANISM_LABELS[m] })),
      default: props.mechanism,
    },
    {
      type: 'number',
      key: 'tasa',
      label: 'Proporción de faltantes',
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: props.rate,
      digits: 2,
    },
    {
      type: 'number',
      key: 'fuerza',
      label: 'Fuerza de la dependencia',
      min: 0,
      max: 3,
      step: 0.1,
      default: props.strength,
      digits: 1,
    },
    { type: 'toggle', key: 'ocultos', label: 'Mostrar los valores ocultos', default: props.hidden },
  ];
  const parameters = useParameters(definitions);
  const mechanism = String(parameters.values.mecanismo) as MechanismId;
  const rate = Number(parameters.values.tasa);
  const strength = Number(parameters.values.fuerza);
  const showHidden = Boolean(parameters.values.ocultos);
  const seed = useSeed(props.seed);
  const points = useMemo(
    () => scenarioPoints({ mechanism, rate, strength, n: props.n, seed: seed.seed }),
    [mechanism, rate, strength, props.n, seed.seed],
  );
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${props.n}|${run}`, () =>
    reducedMotion ? props.n : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(props.n, v + 1)),
    stepMany: (count) => update((v) => Math.min(props.n, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= props.n,
  });
  const visible = points.slice(0, Math.max(1, shown));
  const observed = visible.filter((p) => !p.missing);
  const missingCount = visible.length - observed.length;
  const trueMean = mean(visible.map((p) => p.y));
  const obsMean = observed.length > 0 ? mean(observed.map((p) => p.y)) : Number.NaN;
  const medX = median(points.map((p) => p.x));
  const medY = median(points.map((p) => p.y));
  const rateIn = (filter: (p: (typeof points)[number]) => boolean) => {
    const group = visible.filter(filter);
    return group.length === 0 ? 0 : group.filter((p) => p.missing).length / group.length;
  };
  const rates = [
    rateIn((p) => p.x < medX),
    rateIn((p) => p.x >= medX),
    rateIn((p) => p.y < medY),
    rateIn((p) => p.y >= medY),
  ];
  const g = (v: number) => formatNumber(v, 2);
  const header = `\\bar{y}_{\\text{obs}} - \\bar{y} = ${g(obsMean)} - ${g(trueMean)} = ${g(obsMean - trueMean)}`;
  const description =
    `${MECHANISM_LABELS[mechanism]}. ${visible.length} personas, ${missingCount} ingresos faltantes. ` +
    `Media observada ${g(obsMean)} contra media real ${g(trueMean)} miles de pesos. ` +
    `Proporción faltante: edad baja ${g(rates[0] ?? 0)}, edad alta ${g(rates[1] ?? 0)}, ingreso bajo ${g(rates[2] ?? 0)}, ingreso alto ${g(rates[3] ?? 0)}.`;
  const xDomain = padded(points.map((p) => p.x));
  const yDomain = padded(points.map((p) => p.y));

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Ingresos faltantes', value: `${missingCount} de ${visible.length}` },
        { label: 'Media real (con ocultos)', value: g(trueMean), color: DATA_COLORS.muted },
        { label: 'Media de los observados', value: g(obsMean), color: DATA_COLORS.primary },
        {
          label: 'Sesgo de la media observada',
          value: g(obsMean - trueMean),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Ingreso observado', color: DATA_COLORS.primary, shape: 'circle' },
        {
          label: 'Ingreso faltante (marca en la edad)',
          color: DATA_COLORS.negative,
          shape: 'square',
        },
        ...(showHidden
          ? [{ label: 'Valor oculto', color: DATA_COLORS.negative, shape: 'circle' as const }]
          : []),
        { label: 'Media observada', color: DATA_COLORS.primary, shape: 'dashed' as const },
        { label: 'Media real', color: DATA_COLORS.muted, shape: 'dashed' as const },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <ChartSvg
          label={description}
          aspect={0.75}
          minHeight={260}
          maxHeight={400}
          margins={{ top: 12, right: 12, bottom: 46, left: 52 }}
        >
          {(box) => {
            const { left, top, width, height } = box.inner;
            const x = scaleLinear()
              .domain(xDomain)
              .range([left, left + width]);
            const y = scaleLinear()
              .domain(yDomain)
              .range([top + height, top]);
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={left}
                  gridLength={width}
                  ticks={5}
                  label={`${SCENARIO.yName} (${SCENARIO.yUnit})`}
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={top + height}
                  ticks={6}
                  label={`${SCENARIO.xName} (${SCENARIO.xUnit})`}
                />
                <g aria-hidden="true">
                  {visible.map((p, i) =>
                    p.missing ? (
                      <g key={i}>
                        <rect
                          x={x(p.x) - 1.5}
                          y={top + height - 10}
                          width={3}
                          height={10}
                          fill={DATA_COLORS.negative}
                        />
                        {showHidden && (
                          <circle
                            cx={x(p.x)}
                            cy={y(p.y)}
                            r={DOT}
                            fill="none"
                            stroke={DATA_COLORS.negative}
                            strokeWidth={1.5}
                          />
                        )}
                      </g>
                    ) : (
                      <circle
                        key={i}
                        cx={x(p.x)}
                        cy={y(p.y)}
                        r={DOT}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.7}
                      />
                    ),
                  )}
                  {Number.isFinite(obsMean) && (
                    <line
                      x1={left}
                      x2={left + width}
                      y1={y(obsMean)}
                      y2={y(obsMean)}
                      stroke={DATA_COLORS.primary}
                      strokeWidth={2}
                      strokeDasharray="6 4"
                    />
                  )}
                  <line
                    x1={left}
                    x2={left + width}
                    y1={y(trueMean)}
                    y2={y(trueMean)}
                    stroke={DATA_COLORS.muted}
                    strokeWidth={2}
                    strokeDasharray="2 3"
                  />
                </g>
              </g>
            );
          }}
        </ChartSvg>
        <div>
          <h4 className={styles.panelTitle}>Proporción de ingresos faltantes por grupo</h4>
          <HBars
            labels={['Edad baja', 'Edad alta', 'Ingreso bajo', 'Ingreso alto']}
            values={rates}
            highlight={-1}
            colors={[
              DATA_COLORS.primary,
              DATA_COLORS.primary,
              DATA_COLORS.negative,
              DATA_COLORS.negative,
            ]}
            axisLabel="Proporción faltante"
            decimals={2}
            domain={[0, 1]}
            label={description}
          />
          <p className={styles.stage}>
            La edad siempre se observa; el ingreso de cada persona solo se conoce aquí porque los
            datos son simulados.
          </p>
        </div>
      </div>
    </VizFrame>
  );
}
