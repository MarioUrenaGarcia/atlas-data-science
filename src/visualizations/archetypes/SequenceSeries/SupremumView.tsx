import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SUP_SETS, type SupSetId } from './catalog.ts';
import styles from './SequenceSeries.module.css';

const ELEMENTS = 40;
const ELEMENTS_PER_SECOND = 4;

interface SupremumViewProps {
  title: string;
  set: SupSetId;
  sets: readonly SupSetId[];
  epsilon: number;
}

/**
 * Elements of a bounded set appear on the number line. Everything to the
 * right of the supremum is an upper bound; for every epsilon some element
 * lies in (sup - epsilon, sup], which is what makes the supremum the least
 * upper bound.
 */
export function SupremumView({ title, set, sets, epsilon }: SupremumViewProps) {
  const definitions = useMemo(
    () => [
      ...(sets.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'conjunto',
              label: 'Conjunto',
              options: sets.map((id) => ({ value: id, label: SUP_SETS[id].label })),
              default: set,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'epsilon',
        label: 'Distancia',
        symbol: 'ε',
        min: 0.005,
        max: 0.3,
        step: 0.005,
        default: epsilon,
      },
    ],
    [sets, set, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (sets.length > 1 ? String(values.conjunto) : set) as SupSetId;
  const eps = Number(values.epsilon);
  const definition = SUP_SETS[selected];
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${selected}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(ELEMENTS, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ELEMENTS_PER_SECOND,
    done: shown >= ELEMENTS,
  });
  const elements = Array.from({ length: shown }, (_, index) => definition.element(index + 1));
  const sup = definition.supremum;
  const witnessIndex = elements.findIndex((value) => value > sup - eps);
  const witness = witnessIndex >= 0 ? elements[witnessIndex] : undefined;
  const description =
    `${definition.label}. Supremo ${formatNumber(sup, 5)}${definition.hasMaximum ? ', que pertenece al conjunto (es un máximo)' : ', que no pertenece al conjunto'}; ` +
    `ínfimo ${formatNumber(definition.infimum, 5)}. ` +
    (witness !== undefined
      ? `El elemento ${formatNumber(witness, 5)} (n = ${witnessIndex + 1}) supera sup - ε = ${formatNumber(sup - eps, 5)}.`
      : `Todavía no aparece un elemento mayor que sup - ε = ${formatNumber(sup - eps, 5)}.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Elementos mostrados', value: String(shown) },
        { label: 'sup S', value: formatNumber(sup, 6), color: DATA_COLORS.secondary },
        { label: '¿Es máximo?', value: definition.hasMaximum ? 'sí' : 'no' },
        { label: 'inf S', value: formatNumber(definition.infimum, 6), color: DATA_COLORS.tertiary },
        {
          label: 'Elemento en (sup - ε, sup]',
          value:
            witness !== undefined
              ? `${formatNumber(witness, 6)} (n = ${witnessIndex + 1})`
              : 'todavía no aparece',
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Elementos de S', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Cotas superiores', color: DATA_COLORS.secondary },
        { label: 'Intervalo (sup - ε, sup]', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={definition.latex} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.32}
        minHeight={170}
        maxHeight={260}
        margins={{ top: 30, bottom: 40, left: 20, right: 20 }}
      >
        {(box) => {
          const lo = definition.infimum;
          const span = sup - lo;
          const x = scaleLinear()
            .domain([lo - span * 0.1, sup + span * 0.25])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const axisY = box.inner.top + box.inner.height * 0.6;
          return (
            <>
              <rect
                x={x(sup)}
                y={box.inner.top}
                width={(x.range()[1] ?? x(sup)) - x(sup)}
                height={axisY - box.inner.top}
                fill={DATA_COLORS.secondary}
                fillOpacity={0.12}
                aria-hidden="true"
              />
              <rect
                x={x(sup - eps)}
                y={box.inner.top}
                width={x(sup) - x(sup - eps)}
                height={axisY - box.inner.top}
                fill={DATA_COLORS.highlight}
                fillOpacity={0.25}
                aria-hidden="true"
              />
              <text x={x(sup) + 6} y={box.inner.top + 12} className={svgStyles.labelMuted}>
                cotas superiores
              </text>
              <Axis scale={x} orientation="bottom" position={axisY} ticks={6} />
              <line
                x1={x(sup)}
                x2={x(sup)}
                y1={box.inner.top}
                y2={axisY + 6}
                stroke={DATA_COLORS.secondary}
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <line
                x1={x(lo)}
                x2={x(lo)}
                y1={box.inner.top}
                y2={axisY + 6}
                stroke={DATA_COLORS.tertiary}
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <g aria-hidden="true">
                {elements.map((value, index) => (
                  <circle
                    key={index}
                    cx={x(value)}
                    cy={axisY - 12 - (index % 3) * 6}
                    r={index === witnessIndex ? 6 : 4}
                    fill={index === witnessIndex ? DATA_COLORS.highlight : DATA_COLORS.primary}
                    fillOpacity={0.85}
                    stroke={index === witnessIndex ? DATA_COLORS.text : 'none'}
                  />
                ))}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
