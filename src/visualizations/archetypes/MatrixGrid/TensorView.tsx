import { useMemo } from 'react';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

type Selection = 'elemento' | 'fibra-1' | 'fibra-2' | 'fibra-3' | 'rebanada-1' | 'rebanada-3';

const SELECTIONS: { value: Selection; label: string }[] = [
  { value: 'elemento', label: 'Un elemento' },
  { value: 'fibra-1', label: 'Fibra en el modo 1 (se mueve i)' },
  { value: 'fibra-2', label: 'Fibra en el modo 2 (se mueve j)' },
  { value: 'fibra-3', label: 'Fibra en el modo 3 (se mueve k)' },
  { value: 'rebanada-1', label: 'Rebanada con i fijo' },
  { value: 'rebanada-3', label: 'Rebanada con k fijo' },
];

/** Entry value that spells its own indices, so positions can be read off the numbers. */
const entry = (i: number, j: number, k: number) => 100 * (i + 1) + 10 * (j + 1) + (k + 1);

interface TensorViewProps {
  title: string;
  shape: [number, number, number];
}

/**
 * A third-order tensor drawn as a stack of matrices, one per value of the
 * first index. Each entry is written as its three indices, so fixing some of
 * them and letting others vary shows fibers (vectors) and slices (matrices).
 * Below, the same tensor unfolded into a matrix.
 */
export function TensorView({ title, shape }: TensorViewProps) {
  const [I, J, K] = shape;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'seleccion',
        label: 'Qué seleccionar',
        options: SELECTIONS,
        default: 'elemento',
      },
      {
        type: 'number' as const,
        key: 'i',
        label: 'Índice i (modo 1)',
        symbol: 'i',
        min: 1,
        max: I,
        step: 1,
        default: 1,
        digits: 0,
      },
      {
        type: 'number' as const,
        key: 'j',
        label: 'Índice j (modo 2)',
        symbol: 'j',
        min: 1,
        max: J,
        step: 1,
        default: 2,
        digits: 0,
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Índice k (modo 3)',
        symbol: 'k',
        min: 1,
        max: K,
        step: 1,
        default: 3,
        digits: 0,
      },
    ],
    [I, J, K],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const selection = values.seleccion as Selection;
  const si = Number(values.i) - 1;
  const sj = Number(values.j) - 1;
  const sk = Number(values.k) - 1;
  const selected = (i: number, j: number, k: number) => {
    switch (selection) {
      case 'elemento':
        return i === si && j === sj && k === sk;
      case 'fibra-1':
        return j === sj && k === sk;
      case 'fibra-2':
        return i === si && k === sk;
      case 'fibra-3':
        return i === si && j === sj;
      case 'rebanada-1':
        return i === si;
      case 'rebanada-3':
        return k === sk;
    }
  };
  const notation: Record<Selection, string> = {
    elemento: `x_{${si + 1}${sj + 1}${sk + 1}} = ${entry(si, sj, sk)}`,
    'fibra-1': `\\mathcal{X}_{:,${sj + 1},${sk + 1}} \\in \\mathbb{R}^{${I}}`,
    'fibra-2': `\\mathcal{X}_{${si + 1},:,${sk + 1}} \\in \\mathbb{R}^{${J}}`,
    'fibra-3': `\\mathcal{X}_{${si + 1},${sj + 1},:} \\in \\mathbb{R}^{${K}}`,
    'rebanada-1': `\\mathcal{X}_{${si + 1},:,:} \\in \\mathbb{R}^{${J} \\times ${K}}`,
    'rebanada-3': `\\mathcal{X}_{:,:,${sk + 1}} \\in \\mathbb{R}^{${I} \\times ${J}}`,
  };
  const count = {
    elemento: 1,
    'fibra-1': I,
    'fibra-2': J,
    'fibra-3': K,
    'rebanada-1': J * K,
    'rebanada-3': I * J,
  }[selection];
  const unfolded = Array.from({ length: I }, (_, i) =>
    Array.from({ length: J * K }, (_, column) => entry(i, column % J, Math.floor(column / J))),
  );
  const description = `Tensor de orden 3 con forma ${I} por ${J} por ${K} (${I * J * K} entradas). Selección: ${
    SELECTIONS.find((item) => item.value === selection)?.label ?? ''
  }, ${count} entrada(s). Cada número abc indica la posición i = a, j = b, k = c.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Orden (número de índices)', value: '3' },
        { label: 'Forma', value: `${I} por ${J} por ${K}` },
        { label: 'Entradas en total', value: String(I * J * K) },
        { label: 'Entradas seleccionadas', value: String(count) },
      ]}
      description={description}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\mathcal{X} \\in \\mathbb{R}^{${I} \\times ${J} \\times ${K}},\\qquad ${notation[selection]}`}
        />
      </p>
      <p className={styles.text} aria-hidden="true">
        Cada entrada muestra sus índices: el número 213 está en i = 2, j = 1, k = 3.
      </p>
      <div
        className={styles.slices}
        role="region"
        aria-label="Rebanadas del tensor, una por valor de i"
        tabIndex={0}
      >
        {Array.from({ length: I }, (_, i) => (
          <div key={i} className={styles.slice}>
            <MatrixDisplay
              label={`Rebanada i = ${i + 1}`}
              matrix={Array.from({ length: J }, (_, j) =>
                Array.from({ length: K }, (_, k) => entry(i, j, k)),
              )}
              compact
              cellState={(j, k) => (selected(i, j, k) ? 'filled' : 'muted')}
            />
            <span className={styles.sliceLabel}>i = {i + 1}</span>
          </div>
        ))}
      </div>
      <p className={styles.text}>
        Despliegue en el modo 1: una fila por cada i, las columnas recorren j y luego k.
      </p>
      <div
        className={styles.matrices}
        role="region"
        aria-label="Tensor desplegado como matriz"
        tabIndex={0}
      >
        <MatrixDisplay
          name="X₍₁₎"
          label="Despliegue en el modo 1"
          matrix={unfolded}
          compact
          cellState={(i, column) =>
            selected(i, column % J, Math.floor(column / J)) ? 'filled' : 'muted'
          }
        />
      </div>
    </VizFrame>
  );
}
