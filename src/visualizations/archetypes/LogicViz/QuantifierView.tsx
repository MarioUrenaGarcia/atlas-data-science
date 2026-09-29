import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { PREDICATES, type PredicateId } from './predicates.ts';
import styles from './LogicViz.module.css';

const CHECKS_PER_SECOND = 3;

interface QuantifierViewProps {
  title: string;
  predicate: PredicateId;
  predicates: readonly PredicateId[];
  start: number;
  size: number;
  k: number;
  fixedDomain?: readonly number[];
}

/**
 * A scanner checks each element of a finite domain. The universal statement
 * is settled by the first counterexample and the existential one by the first
 * witness; only if neither appears must the whole domain be examined.
 */
export function QuantifierView({
  title,
  predicate,
  predicates,
  start,
  size,
  k,
  fixedDomain,
}: QuantifierViewProps) {
  const definitions = useMemo(
    () => [
      ...(predicates.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'predicado',
              label: 'Predicado P(x)',
              options: predicates.map((id) => ({ value: id, label: PREDICATES[id].label(k) })),
              default: predicate,
            },
          ]
        : []),
      ...(fixedDomain
        ? []
        : [
            {
              type: 'number' as const,
              key: 'inicio',
              label: 'Primer elemento del dominio',
              min: -20,
              max: 20,
              step: 1,
              default: start,
            },
            {
              type: 'number' as const,
              key: 'tamano',
              label: 'Tamaño del dominio',
              min: 2,
              max: 40,
              step: 1,
              default: size,
            },
          ]),
      // Only the threshold predicate depends on k.
      ...(predicates.includes('menor-que')
        ? [
            {
              type: 'number' as const,
              key: 'k',
              label: 'Constante k',
              symbol: 'k',
              min: -20,
              max: 40,
              step: 1,
              default: k,
            },
          ]
        : []),
    ],
    [predicates, predicate, start, size, k, fixedDomain],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (predicates.length > 1 ? String(values.predicado) : predicate) as PredicateId;
  const first = Number(values.inicio);
  const count = fixedDomain ? fixedDomain.length : Number(values.tamano);
  const constant = Number(values.k ?? k);
  const domain = useMemo(
    () => fixedDomain ?? Array.from({ length: count }, (_, index) => first + index),
    [fixedDomain, first, count],
  );
  const truth = domain.map((x) => PREDICATES[selected].test(x, constant));
  const [run, setRun] = useState(0);
  const [checked, update] = useResettableState<number>(
    `${selected}|${first}|${count}|${constant}|${run}`,
    () => 0,
  );

  const counterexample = truth.findIndex((value, index) => index < checked && !value);
  const witness = truth.findIndex((value, index) => index < checked && value);
  const settledForAll = counterexample >= 0 || checked >= count;
  const settledExists = witness >= 0 || checked >= count;

  const playback = usePlayback({
    step: () => update((value) => Math.min(count, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: CHECKS_PER_SECOND,
    done: checked >= count,
  });

  const forAll = counterexample >= 0 ? false : checked >= count ? true : null;
  const exists = witness >= 0 ? true : checked >= count ? false : null;
  const label = PREDICATES[selected].label(constant);
  const latex = PREDICATES[selected].latex(constant);
  const verdict = (value: boolean | null) =>
    value === null ? 'sin decidir' : value ? 'verdadera' : 'falsa';
  const description =
    `Dominio ${fixedDomain ? `{${fixedDomain.join(', ')}}` : `de ${first} a ${first + count - 1}`}; predicado ${label}. Se han revisado ${checked} elementos. ` +
    `La afirmación para todo x es ${verdict(forAll)}${counterexample >= 0 ? `, con contraejemplo x = ${domain[counterexample]}` : ''}. ` +
    `La afirmación existe x es ${verdict(exists)}${witness >= 0 ? `, con testigo x = ${domain[witness]}` : ''}.`;

  const columnsPerRow = Math.min(10, count);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Elementos revisados', value: `${checked} de ${count}` },
        { label: 'Para todo x, P(x)', value: verdict(forAll), color: DATA_COLORS.secondary },
        { label: 'Existe x con P(x)', value: verdict(exists), color: DATA_COLORS.tertiary },
        { label: 'Elementos que cumplen P', value: `${truth.filter(Boolean).length} de ${count}` },
      ]}
      legend={[
        { label: 'Cumple P(x)', color: DATA_COLORS.tertiary, shape: 'circle' },
        { label: 'No cumple P(x)', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Sin revisar', color: DATA_COLORS.neutral, shape: 'circle' },
      ]}
      description={description}
    >
      <div className={styles.quantifierHeader}>
        <p>
          <Latex tex={`\\forall x \\in D:\\ ${latex}`} />{' '}
          <span className={styles.badge}>
            {settledForAll ? verdict(forAll) : 'buscando un contraejemplo'}
          </span>
        </p>
        <p>
          <Latex tex={`\\exists x \\in D:\\ ${latex}`} />{' '}
          <span className={styles.badge}>
            {settledExists ? verdict(exists) : 'buscando un testigo'}
          </span>
        </p>
      </div>
      <ChartSvg
        label={description}
        aspect={Math.ceil(count / columnsPerRow) / columnsPerRow}
        minHeight={90}
        maxHeight={360}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const cell = box.inner.width / columnsPerRow;
          const radius = Math.min(22, cell * 0.38);
          return domain.map((x, index) => {
            const column = index % columnsPerRow;
            const rowIndex = Math.floor(index / columnsPerRow);
            const cx = box.inner.left + cell * (column + 0.5);
            const cy = box.inner.top + cell * (rowIndex + 0.5);
            const inspected = index < checked;
            const fill = !inspected
              ? DATA_COLORS.neutral
              : truth[index]
                ? DATA_COLORS.tertiary
                : DATA_COLORS.secondary;
            const special = index === counterexample || index === witness;
            return (
              <g key={x} aria-hidden="true">
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={fill}
                  fillOpacity={inspected ? 0.85 : 0.25}
                  stroke={special ? DATA_COLORS.text : 'none'}
                  strokeWidth={3}
                />
                {index === checked - 1 && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 5}
                    fill="none"
                    stroke={DATA_COLORS.text}
                    strokeDasharray="3 3"
                  />
                )}
                <text x={cx} y={cy} textAnchor="middle" dy="0.35em" className={svgStyles.label}>
                  {x}
                </text>
              </g>
            );
          });
        }}
      </ChartSvg>
      <p className={styles.note}>
        <Latex tex={`\\lnot\\,(\\forall x:\\ ${latex}) \\iff \\exists x:\\ \\lnot\\,(${latex})`} />
      </p>
    </VizFrame>
  );
}
