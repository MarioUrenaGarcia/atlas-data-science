import { useMemo, useState } from 'react';
import { Latex } from '../../core/Latex.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { choleskyFrames, gaussFrames, luFrames, qrFrames, type FrameSet } from './frames.ts';
import styles from './MatrixSteps.module.css';
import type { MatrixStepsConfig } from './schema.ts';

const STEPS_PER_SECOND = 0.8;

function buildFrames(config: MatrixStepsConfig, matrix: number[][]): FrameSet {
  switch (config.modo) {
    case 'gauss':
      return gaussFrames(matrix, config.aumentada ?? false, config.reducida ?? false);
    case 'rango':
      return gaussFrames(matrix, false, config.reducida ?? false);
    case 'lu':
      return luFrames(matrix);
    case 'cholesky':
      return choleskyFrames(matrix);
    case 'qr':
      return qrFrames(matrix);
  }
}

/**
 * Matrix algorithms one step at a time: every row operation or computed entry
 * is shown with the matrices it changes highlighted and the operation written
 * out, so the final factorization or echelon form can be traced back.
 */
export default function MatrixSteps({ params, title }: VisualizationProps) {
  const config = params as unknown as MatrixStepsConfig;
  const definitions = useMemo(
    () =>
      config.matrices.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'matriz',
              label: 'Matriz',
              options: config.matrices.map((item, index) => ({
                value: String(index),
                label: item.nombre,
              })),
              default: '0',
            },
          ]
        : [],
    [config.matrices],
  );
  const parameters = useParameters(definitions);
  const chosen =
    config.matrices[Number((parameters.values as Record<string, string>).matriz ?? 0)] ??
    config.matrices[0];
  const matrix = useMemo(() => chosen?.matriz.map((row) => [...row]) ?? [[0]], [chosen]);
  const { frames, summary } = useMemo(() => buildFrames(config, matrix), [config, matrix]);
  const [run, setRun] = useState(0);
  const [index, setIndex] = useResettableState(`${JSON.stringify(matrix)}|${run}`, () => 0);
  const lastIndex = frames.length - 1;
  const playback = usePlayback({
    step: () => setIndex((value) => Math.min(lastIndex, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: index >= lastIndex,
  });
  const frame = frames[Math.min(index, lastIndex)];
  if (!frame) return null;
  const description = `Paso ${index} de ${lastIndex}. ${frame.text}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'Paso', value: `${index} de ${lastIndex}` },
        ...(index >= lastIndex ? summary : []),
      ]}
      description={description}
      graphic="html"
    >
      <p className={styles.formula}>{frame.latex && <Latex tex={frame.latex} />}</p>
      <p className={styles.text} aria-hidden="true">
        {frame.text}
      </p>
      <div
        className={styles.matrices}
        role="region"
        aria-label={`Matrices del paso ${index}`}
        tabIndex={0}
      >
        {frame.matrices.map((shown, position) => (
          <MatrixDisplay
            key={`${position}-${shown.name}`}
            name={shown.name || undefined}
            label={`${shown.name ? `Matriz ${shown.name}` : 'Matriz'} en el paso ${index}`}
            matrix={shown.matrix}
            cellState={shown.cells}
            rowState={shown.rows}
            rowLabels={shown.rowLabels}
            augmentedAt={shown.augmentedAt}
            format={shown.format}
          />
        ))}
      </div>
    </VizFrame>
  );
}
