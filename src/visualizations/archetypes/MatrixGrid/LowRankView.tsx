import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber, formatPercent } from '../../../lib/format/number.ts';
import { lowRankApproximation, svd, type Matrix } from '../../../lib/linalg/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';
import { PixelGrid } from './PixelGrid.tsx';

type ImageKind = 'figura' | 'degradado' | 'tablero';

const SIZE = 24;
const RANKS_PER_SECOND = 1.5;
const IMAGES: { value: ImageKind; label: string }[] = [
  { value: 'figura', label: 'Figura: anillo y cruz' },
  { value: 'degradado', label: 'Ondas suaves' },
  { value: 'tablero', label: 'Tablero con marco' },
];

function buildImage(kind: ImageKind): Matrix {
  const center = (SIZE - 1) / 2;
  return Array.from({ length: SIZE }, (_, i) =>
    Array.from({ length: SIZE }, (_, j) => {
      const x = (j - center) / center;
      const y = (i - center) / center;
      switch (kind) {
        case 'figura': {
          const r = Math.hypot(x, y);
          const ring = r > 0.55 && r < 0.8 ? 1 : 0;
          const cross = Math.abs(x) < 0.12 || Math.abs(y) < 0.12 ? 0.7 : 0;
          return Math.max(ring, r < 0.8 ? cross : 0);
        }
        case 'degradado':
          return (
            0.5 +
            0.25 * Math.sin(3 * x) * Math.cos(2 * y) +
            0.25 * Math.cos(4 * x) * Math.sin(3 * y)
          );
        case 'tablero': {
          const frame = i < 2 || j < 2 || i >= SIZE - 2 || j >= SIZE - 2 ? 1 : 0;
          const check = (Math.floor(i / 4) + Math.floor(j / 4)) % 2 === 0 ? 0.8 : 0.1;
          return frame || check;
        }
      }
    }),
  );
}

interface LowRankViewProps {
  title: string;
  initialImage: ImageKind;
}

/**
 * An image as a 24 by 24 matrix rebuilt from its first k singular triples.
 * By the Eckart-Young theorem no rank-k matrix is closer; the error left is
 * exactly the size of the singular values that were dropped, and the storage
 * needed is k(m + n + 1) numbers instead of mn.
 */
export function LowRankView({ title, initialImage }: LowRankViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'imagen',
        label: 'Imagen',
        options: IMAGES,
        default: initialImage,
      },
    ],
    [initialImage],
  );
  const parameters = useParameters(definitions);
  const kind = (parameters.values as Record<string, ImageKind>).imagen ?? initialImage;
  const image = useMemo(() => buildImage(kind), [kind]);
  const decomposition = useMemo(() => svd(image), [image]);
  const sigma = decomposition.singularValues;
  const [run, setRun] = useState(0);
  const [k, setK] = useResettableState(`${kind}|${run}`, () => 1);
  const playback = usePlayback({
    step: () => setK((value) => Math.min(SIZE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: RANKS_PER_SECOND,
    done: k >= SIZE,
  });
  const approximation = useMemo(() => lowRankApproximation(decomposition, k), [decomposition, k]);
  const total = Math.hypot(...sigma);
  const dropped = Math.hypot(...sigma.slice(k));
  const numericalRank = sigma.filter((value) => value > 1e-8 * (sigma[0] ?? 1)).length;
  const storage = k * (2 * SIZE + 1);
  const description =
    `Aproximación de rango ${k} de una imagen de ${SIZE} por ${SIZE} con rango ${numericalRank}. ` +
    `Error relativo ${formatPercent(total > 0 ? dropped / total : 0)}; guarda ${storage} números en lugar de ${SIZE * SIZE}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Rango k usado', value: String(k), color: DATA_COLORS.primary },
        { label: 'Rango de la imagen', value: String(numericalRank) },
        {
          label: 'Error relativo ‖A - Aₖ‖F / ‖A‖F',
          value: formatPercent(total > 0 ? dropped / total : 0),
        },
        { label: 'Error en norma espectral = σₖ₊₁', value: formatNumber(sigma[k] ?? 0, 3) },
        { label: 'Números guardados k(m + n + 1)', value: `${storage} de ${SIZE * SIZE}` },
      ]}
      legend={[
        { label: 'Valores singulares usados', color: DATA_COLORS.primary },
        { label: 'Valores singulares descartados', color: DATA_COLORS.neutral },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A_k = \\sum_{\\ell=1}^{${k}} \\sigma_\\ell\\, \\mathbf{u}_\\ell \\mathbf{v}_\\ell^\\top,\\qquad \\lVert A - A_k \\rVert_F = \\sqrt{\\textstyle\\sum_{\\ell > ${k}} \\sigma_\\ell^2}`}
        />
      </p>
      <div className={styles.pixels}>
        <div className={styles.slice}>
          <PixelGrid matrix={image} label="Imagen original" />
          <span className={styles.sliceLabel}>Original (rango {numericalRank})</span>
        </div>
        <div className={styles.slice}>
          <PixelGrid matrix={approximation} label={`Aproximación de rango ${k}`} />
          <span className={styles.sliceLabel}>Rango {k}</span>
        </div>
      </div>
      <ChartSvg
        label="Valores singulares de la imagen"
        aspect={0.3}
        minHeight={140}
        maxHeight={200}
        margins={{ left: 44, bottom: 30 }}
      >
        {(box) => {
          const x = scaleBand<number>()
            .domain(sigma.map((_, index) => index + 1))
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.15);
          const y = scaleLinear()
            .domain([0, sigma[0] ?? 1])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={3}
              />
              <Axis
                scale={Object.assign((value: number) => (x(value) ?? 0) + x.bandwidth() / 2, {
                  domain: () => [1, SIZE],
                })}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                tickValues={[1, 6, 12, 18, 24]}
                label="índice ℓ del valor singular"
              />
              {sigma.map((value, index) => (
                <rect
                  key={index}
                  x={x(index + 1)}
                  y={y(value)}
                  width={x.bandwidth()}
                  height={Math.max(0, y(0) - y(value))}
                  fill={index < k ? DATA_COLORS.primary : DATA_COLORS.neutral}
                />
              ))}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
