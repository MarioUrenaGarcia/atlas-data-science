import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { OrdinalCaseId } from './schema.ts';

const STEPS_PER_SECOND = 1.2;

const CASES: Record<
  OrdinalCaseId,
  { column: string; natural: readonly string[]; ordered: boolean }
> = {
  tallas: { column: 'Talla de playera', natural: ['CH', 'M', 'G', 'EG'], ordered: true },
  satisfaccion: {
    column: 'Satisfacción con el servicio',
    natural: ['Muy insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy satisfecho'],
    ordered: true,
  },
  colores: {
    column: 'Color del auto',
    natural: ['Rojo', 'Blanco', 'Gris', 'Azul'],
    ordered: false,
  },
};

/**
 * Each category receives an integer code and is placed on a number line.
 * With a natural order the codes respect it; with alphabetical codes, or with
 * nominal categories, the line invents an order and distances that the data
 * do not have.
 */
export function OrdinalView({
  title,
  caseId,
  order,
}: {
  title: string;
  caseId: OrdinalCaseId;
  order: 'natural' | 'alfabetico';
}) {
  const item = CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'orden',
      label: 'Orden de los códigos',
      options: [
        {
          value: 'natural',
          label: item.ordered ? 'Orden natural de la escala' : 'Orden de captura',
        },
        { value: 'alfabetico', label: 'Orden alfabético' },
      ],
      default: order,
    },
  ];
  const parameters = useParameters(definitions);
  const current = String(parameters.values.orden);
  const sequence =
    current === 'natural'
      ? [...item.natural]
      : [...item.natural].sort((a, b) => a.localeCompare(b, 'es'));
  const total = sequence.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [placed, update] = useResettableState<number>(`${caseId}|${current}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: placed >= total,
  });
  const code = (c: string) => sequence.indexOf(c) + 1;
  const respects = item.ordered && sequence.every((c, i) => c === item.natural[i]);
  const header = sequence
    .slice(0, Math.max(1, placed))
    .map((c) => `\\text{${c}} \\mapsto ${code(c)}`)
    .join(',\\quad ');
  const first = item.natural[0] ?? '';
  const last = item.natural[item.natural.length - 1] ?? '';
  const description =
    `${item.column}: códigos ${sequence.map((c) => `${c} = ${code(c)}`).join(', ')}. ` +
    (item.ordered
      ? respects
        ? 'Los códigos respetan el orden de la escala.'
        : 'Los códigos no respetan el orden de la escala.'
      : 'La variable es nominal: cualquier orden es arbitrario.') +
    ` Distancia implícita entre ${first} y ${last}: ${Math.abs(code(first) - code(last))}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Categorías', value: String(total) },
        {
          label: 'Respeta un orden real',
          value: item.ordered ? (respects ? 'sí' : 'no') : 'no existe un orden',
        },
        {
          label: `Distancia entre ${first} y ${last}`,
          value: String(Math.abs(code(first) - code(last))),
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Códigos asignados',
        columns: ['Categoría', 'Código'],
        rows: sequence.map((c) => [c, code(c)]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        {item.ordered
          ? 'Escala ordinal: los códigos deben seguir el orden de las categorías.'
          : 'Escala nominal: no hay un orden que los códigos puedan respetar.'}
      </p>
      <ChartSvg
        label={description}
        aspect={0.3}
        minHeight={150}
        maxHeight={200}
        margins={{ top: 16, right: 40, bottom: 40, left: 40 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleLinear()
            .domain([0.5, total + 0.5])
            .range([left, left + width]);
          const lineY = top + height * 0.65;
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                tickValues={sequence.map((_, i) => i + 1)}
                label="Código asignado"
              />
              <g aria-hidden="true">
                <line
                  x1={left}
                  x2={left + width}
                  y1={lineY}
                  y2={lineY}
                  stroke={DATA_COLORS.muted}
                />
                {sequence.slice(0, placed).map((c, i) => {
                  const natural = item.natural.indexOf(c);
                  return (
                    <g key={c}>
                      <circle cx={x(i + 1)} cy={lineY} r={8} fill={seriesColor(natural)} />
                      <text
                        x={x(i + 1)}
                        y={lineY - 16 - (i % 2) * 14}
                        textAnchor="middle"
                        className={styles.chartText}
                      >
                        {c}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
