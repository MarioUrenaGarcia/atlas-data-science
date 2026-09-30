import { useMemo } from 'react';
import { formatFraction, formatNumber } from '../../../lib/format/number.ts';
import { determinant } from '../../../lib/linalg/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';
import { SPECIAL_KINDS, type SpecialKind } from './schema.ts';
import { specialExample } from './special.ts';

const format = (value: number) =>
  Number.isInteger(value) ? formatFraction(value) : formatNumber(value, 2);

interface SpecialViewProps {
  title: string;
  kinds: readonly SpecialKind[];
  size: number;
}

/**
 * Families of matrices recognized by where their zeros are or by how they
 * relate to their transpose. Each one is shown with its pattern highlighted
 * and next to a second matrix that makes its defining property visible.
 */
export function SpecialView({ title, kinds, size }: SpecialViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'tipo',
        label: 'Tipo de matriz',
        options: kinds.map((kind) => ({ value: kind, label: specialExample(kind, 2).label })),
        default: kinds[0] ?? SPECIAL_KINDS[0],
      },
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño',
        symbol: 'n',
        min: 2,
        max: 5,
        step: 1,
        default: size,
        digits: 0,
      },
    ],
    [kinds, size],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const kind = (values.tipo as SpecialKind) ?? kinds[0] ?? 'identidad';
  const n = Number(values.n);
  const example = specialExample(kind, n);
  const description = `${example.label} de ${n} por ${n}. ${example.text} ${example.check.text}`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Tipo', value: example.label },
        { label: 'Determinante', value: formatNumber(determinant(example.matrix), 3) },
        {
          label: 'Entradas que deben ser cero',
          value: String(
            example.matrix
              .flatMap((row, i) => row.map((_, j) => example.forcedZero(i, j)))
              .filter(Boolean).length,
          ),
        },
      ]}
      description={description}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex tex={example.latex} />
      </p>
      <p className={styles.text} aria-hidden="true">
        {example.text}
      </p>
      <div
        className={styles.matrices}
        role="region"
        aria-label={`Ejemplo de matriz ${example.label.toLowerCase()}`}
        tabIndex={0}
      >
        <MatrixDisplay
          label={`Matriz ${example.label.toLowerCase()}`}
          matrix={example.matrix}
          format={format}
          cellState={(i, j) => (example.forcedZero(i, j) ? 'zero' : i === j ? 'pivot' : 'changed')}
        />
        <MatrixDisplay
          name={example.check.name}
          label={example.check.text}
          matrix={example.check.matrix}
          format={format}
        />
      </div>
      <p className={styles.text} aria-hidden="true">
        {example.check.text}
      </p>
    </VizFrame>
  );
}
