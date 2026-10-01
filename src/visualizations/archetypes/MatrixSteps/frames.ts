import { formatFraction, formatNumber, fractionLatex } from '../../../lib/format/number.ts';
import { multiply, solve, transpose, type Matrix } from '../../../lib/linalg/index.ts';
import {
  choleskySteps,
  gaussianElimination,
  luSteps,
  qrSteps,
  type RowOperation,
} from '../../../lib/linalg/steps.ts';
import type { CellState } from '../../core/MatrixDisplay.tsx';

export interface ShownMatrix {
  name: string;
  matrix: Matrix;
  cells?: (i: number, j: number) => CellState | undefined;
  rows?: (i: number) => 'changed' | 'pivot' | undefined;
  rowLabels?: string[];
  augmentedAt?: number;
  format?: (value: number) => string;
}

export interface Frame {
  matrices: ShownMatrix[];
  /** Operation or formula of this step, in LaTeX. */
  latex: string;
  /** What happens in words. */
  text: string;
}

export interface FrameSet {
  frames: Frame[];
  /** Readouts of the finished process. */
  summary: { label: string; value: string }[];
}

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) =>
  String(n)
    .split('')
    .map((digit) => SUBSCRIPTS[Number(digit)] ?? digit)
    .join('');
const rowLabels = (n: number) => Array.from({ length: n }, (_, i) => `R${sub(i + 1)}`);
const decimals = (value: number) => formatNumber(Math.abs(value) < 1e-9 ? 0 : value, 3);

/** Row operation in LaTeX, such as R_2 \leftarrow R_2 - 3R_1. */
export function operationLatex(operation: RowOperation): string {
  if (operation.kind === 'swap')
    return `R_{${operation.rows[0] + 1}} \\leftrightarrow R_{${operation.rows[1] + 1}}`;
  if (operation.kind === 'scale')
    return `R_{${operation.row + 1}} \\leftarrow ${fractionLatex(operation.factor)}\\,R_{${operation.row + 1}}`;
  const size = Math.abs(operation.factor);
  const coefficient = Math.abs(size - 1) < 1e-12 ? '' : fractionLatex(size);
  return `R_{${operation.target + 1}} \\leftarrow R_{${operation.target + 1}} ${operation.factor < 0 ? '-' : '+'} ${coefficient}R_{${operation.source + 1}}`;
}

function operationText(operation: RowOperation): string {
  if (operation.kind === 'swap')
    return `Se intercambian las filas ${operation.rows[0] + 1} y ${operation.rows[1] + 1} para tener un pivote distinto de cero.`;
  if (operation.kind === 'scale')
    return `Se multiplica la fila ${operation.row + 1} por ${formatFraction(operation.factor)} para que el pivote valga 1.`;
  return `Se suma ${formatFraction(operation.factor)} veces la fila ${operation.source + 1} a la fila ${operation.target + 1} para anular una entrada de la columna del pivote.`;
}

/** Classification of a system from its echelon form. */
function systemVerdict(
  final: Matrix,
  variables: number,
  rank: number,
  original: Matrix,
): { text: string; latex: string } {
  const inconsistent = final.some(
    (row) =>
      row.slice(0, variables).every((value) => Math.abs(value) < 1e-10) &&
      Math.abs(row[variables] ?? 0) > 1e-10,
  );
  if (inconsistent)
    return {
      text: 'Una fila dice 0 = c con c distinto de cero: el sistema no tiene solución.',
      latex: '0 = c \\neq 0 \\ \\Rightarrow\\ \\text{sin solución}',
    };
  if (rank < variables)
    return {
      text: `Hay ${variables - rank} variable(s) libre(s): el sistema tiene infinitas soluciones.`,
      latex: `\\text{rango} = ${rank} < ${variables} \\ \\Rightarrow\\ \\text{infinitas soluciones}`,
    };
  const square = original.slice(0, variables).map((row) => row.slice(0, variables));
  const solution = solve(
    square,
    original.slice(0, variables).map((row) => row[variables] ?? 0),
  );
  const values =
    solution?.map((value, i) => `x_{${i + 1}} = ${fractionLatex(value)}`).join(',\\ ') ?? '';
  return {
    text: `Todas las columnas de variables tienen pivote: la solución es única.`,
    latex: values,
  };
}

export function gaussFrames(matrix: Matrix, augmented: boolean, reduced: boolean): FrameSet {
  const columns = matrix[0]?.length ?? 0;
  const variables = augmented ? columns - 1 : columns;
  const { steps, pivots, rank } = gaussianElimination(matrix, { reduced, columns: variables });
  const labels = rowLabels(matrix.length);
  const frames: Frame[] = steps.map((step) => {
    const pivot = step.pivot;
    const done = pivot ? pivots.filter(([, column]) => column < pivot[1]) : [];
    return {
      matrices: [
        {
          name: '',
          matrix: step.matrix,
          rowLabels: labels,
          augmentedAt: augmented ? variables : undefined,
          rows: (i) =>
            step.changed.includes(i) ? 'changed' : pivot?.[0] === i ? 'pivot' : undefined,
          cells: (i, j) =>
            (pivot && pivot[0] === i && pivot[1] === j) || done.some(([r, c]) => r === i && c === j)
              ? 'pivot'
              : step.changed.includes(i)
                ? 'changed'
                : Math.abs(step.matrix[i]?.[j] ?? 0) < 1e-10
                  ? 'zero'
                  : undefined,
        },
      ],
      latex: step.operation
        ? operationLatex(step.operation)
        : augmented
          ? '[\\,\\mathbf{A} \\mid \\mathbf{b}\\,]'
          : 'A',
      text: step.operation
        ? operationText(step.operation)
        : augmented
          ? 'Matriz aumentada del sistema: cada fila es una ecuación.'
          : 'Matriz original. Se busca un pivote en cada columna, de izquierda a derecha.',
    };
  });
  const final = steps.at(-1)?.matrix ?? matrix;
  const last: Frame = {
    matrices: [
      {
        name: '',
        matrix: final,
        rowLabels: labels,
        augmentedAt: augmented ? variables : undefined,
        cells: (i, j) =>
          pivots.some(([r, c]) => r === i && c === j)
            ? 'pivot'
            : Math.abs(final[i]?.[j] ?? 0) < 1e-10
              ? 'zero'
              : undefined,
      },
    ],
    latex: augmented
      ? systemVerdict(final, variables, rank, matrix).latex
      : `\\operatorname{rango}(\\mathbf{A}) = ${rank},\\quad \\operatorname{nulidad}(\\mathbf{A}) = ${variables - rank}`,
    text: augmented
      ? systemVerdict(final, variables, rank, matrix).text
      : `Forma ${reduced ? 'escalonada reducida' : 'escalonada'} con ${rank} pivote(s): el rango es ${rank} y quedan ${variables - rank} columna(s) sin pivote, una por variable libre.`,
  };
  frames.push(last);
  const freeColumns = Array.from({ length: variables }, (_, j) => j).filter(
    (j) => !pivots.some(([, c]) => c === j),
  );
  return {
    frames,
    summary: [
      { label: 'Operaciones de fila', value: String(steps.length - 1) },
      { label: 'Rango (número de pivotes)', value: String(rank) },
      { label: 'Columnas pivote', value: pivots.map(([, c]) => c + 1).join(', ') || 'ninguna' },
      { label: 'Columnas libres', value: freeColumns.map((c) => c + 1).join(', ') || 'ninguna' },
    ],
  };
}

export function luFrames(matrix: Matrix): FrameSet {
  const result = luSteps(matrix);
  const frames: Frame[] = result.steps.map((step, index) => ({
    matrices: [
      {
        name: 'L',
        matrix: step.lower,
        cells: (i, j) =>
          step.filled && step.filled[0] === i && step.filled[1] === j
            ? 'filled'
            : j > i
              ? 'zero'
              : undefined,
      },
      {
        name: 'U',
        matrix: step.upper,
        rowLabels: rowLabels(matrix.length),
        rows: (i) =>
          step.operation?.kind === 'add' && step.operation.target === i ? 'changed' : undefined,
        cells: (i, j) =>
          step.pivot && step.pivot[0] === i && step.pivot[1] === j
            ? 'pivot'
            : step.operation?.kind === 'add' && step.operation.target === i
              ? 'changed'
              : Math.abs(step.upper[i]?.[j] ?? 0) < 1e-10
                ? 'zero'
                : undefined,
      },
    ],
    latex:
      step.operation && step.filled
        ? `${operationLatex(step.operation)},\\qquad \\ell_{${step.filled[0] + 1}${step.filled[1] + 1}} = ${fractionLatex(step.lower[step.filled[0]]?.[step.filled[1]] ?? 0)}`
        : index === 0
          ? '\\mathbf{L} = \\mathbf{I},\\quad \\mathbf{U} = \\mathbf{A}'
          : '',
    text:
      step.operation && step.filled
        ? `El multiplicador ${formatFraction(step.lower[step.filled[0]]?.[step.filled[1]] ?? 0)} que anula la entrada de U se guarda en L, en la misma posición.`
        : 'Se empieza con L igual a la identidad y U igual a A.',
  }));
  const last = result.steps.at(-1);
  if (!result.ok) {
    frames.push({
      matrices: frames.at(-1)?.matrices ?? [],
      latex: `u_{${result.zeroPivot + 1}${result.zeroPivot + 1}} = 0`,
      text: `El pivote ${result.zeroPivot + 1} es cero: sin intercambiar filas no hay factorización LU. Con una permutación P se obtiene PA = LU.`,
    });
  } else if (last) {
    frames.push({
      matrices: [
        {
          name: 'L',
          matrix: last.lower,
          cells: (i, j) => (j < i ? 'filled' : j > i ? 'zero' : undefined),
        },
        { name: 'U', matrix: last.upper, cells: (i, j) => (j < i ? 'zero' : undefined) },
        { name: 'LU', matrix: multiply(last.lower, last.upper) },
      ],
      latex: '\\mathbf{A} = \\mathbf{L}\\,\\mathbf{U}',
      text: 'L es triangular inferior con unos en la diagonal, U es triangular superior, y su producto reproduce A.',
    });
  }
  const upper = last?.upper ?? matrix;
  return {
    frames,
    summary: [
      {
        label: 'Factorización',
        value: result.ok ? 'existe sin intercambios' : 'requiere intercambiar filas',
      },
      {
        label: 'det A = producto de la diagonal de U',
        value: result.ok
          ? formatFraction(upper.reduce((product, row, i) => product * (row[i] ?? 0), 1))
          : 'no aplica',
      },
    ],
  };
}

export function choleskyFrames(matrix: Matrix): FrameSet {
  const result = choleskySteps(matrix);
  const frames: Frame[] = result.steps.map((step) => {
    const entry = step.entry;
    const [i, j] = entry ?? [0, 0];
    const value = step.lower[i]?.[j] ?? 0;
    return {
      matrices: [
        {
          name: 'A',
          matrix,
          cells: (r, c) => (entry && r === i && c === j ? 'active' : undefined),
          format: decimals,
        },
        {
          name: 'L',
          matrix: step.lower,
          format: decimals,
          cells: (r, c) => (entry && r === i && c === j ? 'filled' : c > r ? 'zero' : undefined),
        },
      ],
      latex: !entry
        ? '\\mathbf{A} = \\mathbf{L}\\,\\mathbf{L}^\\top'
        : i === j
          ? `\\ell_{${i + 1}${i + 1}} = \\sqrt{a_{${i + 1}${i + 1}} - \\textstyle\\sum_{k<${i + 1}} \\ell_{${i + 1}k}^2} = \\sqrt{${formatNumber(step.partial, 3)}} = ${formatNumber(value, 3)}`
          : `\\ell_{${i + 1}${j + 1}} = \\dfrac{a_{${i + 1}${j + 1}} - \\sum_{k<${j + 1}} \\ell_{${i + 1}k}\\ell_{${j + 1}k}}{\\ell_{${j + 1}${j + 1}}} = ${formatNumber(value, 3)}`,
      text: !entry
        ? 'Se calcula L fila por fila, de izquierda a derecha.'
        : i === j
          ? `Entrada diagonal: raíz cuadrada de lo que queda de a${sub(i + 1)}${sub(i + 1)}, que es ${formatNumber(step.partial, 3)}.`
          : `Entrada fuera de la diagonal: se descuenta lo que ya aportan las columnas anteriores y se divide entre el pivote.`,
    };
  });
  if (!result.ok) {
    frames.push({
      matrices: frames.at(-1)?.matrices ?? [],
      latex: `a_{${result.failedAt + 1}${result.failedAt + 1}} - \\textstyle\\sum \\ell^2 = ${formatNumber(result.partial, 3)} \\le 0`,
      text: 'Lo que queda bajo la raíz no es positivo: la matriz no es definida positiva y no tiene factor de Cholesky.',
    });
  } else {
    const lower = result.steps.at(-1)?.lower ?? matrix;
    frames.push({
      matrices: [
        {
          name: 'L',
          matrix: lower,
          format: decimals,
          cells: (r, c) => (c > r ? 'zero' : undefined),
        },
        { name: 'L Lᵀ', matrix: multiply(lower, transpose(lower)), format: decimals },
      ],
      latex: '\\mathbf{A} = \\mathbf{L}\\,\\mathbf{L}^\\top',
      text: 'Todas las raíces fueron de números positivos: A es definida positiva y L Lᵀ la reproduce.',
    });
  }
  return {
    frames,
    summary: [{ label: '¿Definida positiva?', value: result.ok ? 'sí' : 'no' }],
  };
}

export function qrFrames(matrix: Matrix): FrameSet {
  const steps = qrSteps(matrix);
  const columns = matrix[0]?.length ?? 0;
  const start: Frame = {
    matrices: [{ name: 'A', matrix, format: decimals }],
    latex: '\\mathbf{A} = \\mathbf{Q}\\,\\mathbf{R}',
    text: 'Se ortonormalizan las columnas de A una por una; los coeficientes usados forman R.',
  };
  if (!steps) {
    return {
      frames: [
        start,
        {
          matrices: [{ name: 'A', matrix, format: decimals }],
          latex: '\\text{columnas dependientes}',
          text: 'Una columna es combinación de las anteriores: lo que queda al proyectar es cero y no se puede normalizar.',
        },
      ],
      summary: [{ label: 'Columnas independientes', value: 'no' }],
    };
  }
  const frames: Frame[] = [
    start,
    ...steps.map((step) => {
      const [i, j] = step.entry;
      const diagonal = i === j;
      return {
        matrices: [
          {
            name: 'A',
            matrix,
            format: decimals,
            cells: (_r: number, c: number) => (c === step.column ? ('active' as const) : undefined),
          },
          {
            name: 'Q',
            matrix: step.q,
            format: decimals,
            cells: (_r: number, c: number) =>
              diagonal && c === j
                ? ('filled' as const)
                : c > step.column
                  ? ('muted' as const)
                  : undefined,
          },
          {
            name: 'R',
            matrix: step.r,
            format: decimals,
            cells: (r: number, c: number) =>
              r === i && c === j ? ('filled' as const) : r > c ? ('zero' as const) : undefined,
          },
        ],
        latex: diagonal
          ? `r_{${j + 1}${j + 1}} = \\lVert \\mathbf{a}_{${j + 1}} - \\textstyle\\sum_{k<${j + 1}} r_{k${j + 1}}\\mathbf{q}_k \\rVert = ${formatNumber(step.r[j]?.[j] ?? 0, 3)}`
          : `r_{${i + 1}${j + 1}} = \\mathbf{q}_{${i + 1}}^\\top \\mathbf{a}_{${j + 1}} = ${formatNumber(step.r[i]?.[j] ?? 0, 3)}`,
        text: diagonal
          ? `Lo que queda de la columna ${j + 1} tras quitar sus proyecciones mide ${formatNumber(step.r[j]?.[j] ?? 0, 3)}; al dividir entre esa longitud se obtiene q${sub(j + 1)}.`
          : `Componente de la columna ${j + 1} en la dirección q${sub(i + 1)}: se guarda en R y se resta.`,
      };
    }),
  ];
  const last = steps.at(-1);
  if (last) {
    frames.push({
      matrices: [
        { name: 'Q', matrix: last.q, format: decimals },
        {
          name: 'R',
          matrix: last.r,
          format: decimals,
          cells: (r, c) => (r > c ? 'zero' : undefined),
        },
        { name: 'QᵀQ', matrix: multiply(transpose(last.q), last.q), format: decimals },
      ],
      latex: '\\mathbf{A} = \\mathbf{Q}\\,\\mathbf{R},\\quad \\mathbf{Q}^\\top \\mathbf{Q} = \\mathbf{I}',
      text: `Q tiene ${columns} columnas ortonormales y R es triangular superior con diagonal positiva.`,
    });
  }
  return { frames, summary: [{ label: 'Columnas independientes', value: 'sí' }] };
}
