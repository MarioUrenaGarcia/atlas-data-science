import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import styles from './InequalityBound.module.css';
import type { InequalityBoundConfig } from './schema.ts';

const DIMENSIONS = [1, 2, 5, 10, 20, 50, 100, 200, 500] as const;
const DEFAULT_SAMPLES = 1500;
const BINS = 40;
const STAGES_PER_SECOND = 0.8;
/** Windows of the two histograms: the norm divided by sqrt(d), and the norm minus sqrt(d). */
const RELATIVE_WINDOW: [number, number] = [0, 2.5];
const ABSOLUTE_WINDOW: [number, number] = [-4, 4];

interface MeasureConcentrationViewProps {
  title: string;
  conceptId: string;
  config: InequalityBoundConfig;
}

function histogram(values: readonly number[], [lo, hi]: [number, number]): number[] {
  const width = (hi - lo) / BINS;
  const counts = Array<number>(BINS).fill(0);
  for (const value of values) {
    const k = Math.floor((value - lo) / width);
    if (k >= 0 && k < BINS) counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts.map((c) => (values.length > 0 ? c / (values.length * width) : 0));
}

/**
 * Concentration of measure with a Gaussian vector X in d dimensions. The
 * norm |X| grows like sqrt(d), but its fluctuations do not grow: |X| minus
 * sqrt(d) keeps a spread of about 0.7 in every dimension. Relative to its
 * size, the norm concentrates on a thin shell. Because the norm is a
 * 1-Lipschitz function, P(||X| - E|X|| >= t) <= 2 exp(-t^2 / 2) whatever d is.
 */
export function MeasureConcentrationView({
  title,
  conceptId,
  config,
}: MeasureConcentrationViewProps) {
  const total = config.muestras ?? DEFAULT_SAMPLES;
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'dimension',
        label: 'Dimensión',
        options: DIMENSIONS.map((d) => ({ value: String(d), label: String(d) })),
        default: String(
          config.dimension && DIMENSIONS.includes(config.dimension as (typeof DIMENSIONS)[number])
            ? config.dimension
            : 10,
        ),
      },
      {
        type: 'number' as const,
        key: 't',
        label: 'Desviación t',
        symbol: 't',
        min: 0.5,
        max: 4,
        step: 0.1,
        digits: 1,
        default: config.umbral ?? 2,
      },
    ],
    [config.dimension, config.umbral],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const d = Number(values.dimension ?? 10);
  const t = Number(values.t ?? 2);
  const stage = DIMENSIONS.indexOf(d as (typeof DIMENSIONS)[number]);
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const norms = useMemo(() => {
    const random = new Random(seed.seed + d);
    return Array.from({ length: total }, () => {
      let sum = 0;
      for (let k = 0; k < d; k += 1) {
        const z = random.normal();
        sum += z * z;
      }
      return Math.sqrt(sum);
    });
  }, [seed.seed, d, total]);
  const playback = usePlayback({
    step: () =>
      parameters.set(
        'dimension',
        String(DIMENSIONS[Math.min(DIMENSIONS.length - 1, stage + 1)] ?? d),
      ),
    reset: () => parameters.set('dimension', String(DIMENSIONS[0])),
    rate: STAGES_PER_SECOND,
    done: stage >= DIMENSIONS.length - 1,
    autoplay: false,
  });
  const mean = norms.reduce((a, b) => a + b, 0) / norms.length;
  const sd = Math.sqrt(
    norms.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, norms.length - 1),
  );
  const root = Math.sqrt(d);
  const outside = norms.filter((v) => Math.abs(v - mean) >= t).length / norms.length;
  const bound = Math.min(1, 2 * Math.exp((-t * t) / 2));
  const f = (v: number) => formatNumber(v, 3);
  const header = `d = ${d}: \\quad \\mathbb{E}\\lVert \\mathbf{X} \\rVert \\approx ${f(mean)} \\approx \\sqrt{${d}} = ${f(root)}, \\qquad P\\big(\\big|\\lVert \\mathbf{X} \\rVert - \\mathbb{E}\\lVert \\mathbf{X} \\rVert\\big| \\ge ${formatNumber(t, 1)}\\big) \\approx ${f(outside)} \\le 2e^{-${formatNumber(t, 1)}^2/2} = ${f(bound)}`;
  const description =
    `Vector normal estándar en ${d} dimensiones, ${total} simulaciones. Norma media ${f(mean)}, raíz de d ${f(root)}, ` +
    `desviación estándar de la norma ${f(sd)} y desviación relativa ${f(sd / mean)}.`;
  const width = (w: [number, number]) => (w[1] - w[0]) / BINS;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Dimensión d', value: String(d) },
        { label: 'Media de la norma', value: f(mean), color: DATA_COLORS.primary },
        { label: 'Desviación estándar de la norma', value: f(sd), color: DATA_COLORS.secondary },
        { label: 'Desviación relativa', value: f(sd / mean) },
        { label: 'Fracción a distancia t o más', value: f(outside), color: DATA_COLORS.highlight },
        { label: 'Cota 2e^(-t²/2)', value: f(bound) },
      ]}
      legend={[{ label: 'Histograma de las simulaciones', color: DATA_COLORS.secondary }]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <DensityHistogram
          start={RELATIVE_WINDOW[0]}
          width={width(RELATIVE_WINDOW)}
          densities={histogram(
            norms.map((v) => v / root),
            RELATIVE_WINDOW,
          )}
          domain={RELATIVE_WINDOW}
          label={`Norma dividida entre la raíz de la dimensión. ${description}`}
          axisLabel="|X| / raíz de d"
          aspect={0.75}
        />
        <DensityHistogram
          start={ABSOLUTE_WINDOW[0]}
          width={width(ABSOLUTE_WINDOW)}
          densities={histogram(
            norms.map((v) => v - root),
            ABSOLUTE_WINDOW,
          )}
          domain={ABSOLUTE_WINDOW}
          label={`Norma menos la raíz de la dimensión. ${description}`}
          axisLabel="|X| - raíz de d"
          aspect={0.75}
        />
      </div>
      <p className={styles.caption}>
        Al subir la dimensión, el histograma de la izquierda se estrecha alrededor de 1: casi toda
        la probabilidad queda en una cáscara delgada. El de la derecha conserva su ancho: las
        fluctuaciones absolutas no crecen con d.
      </p>
    </VizFrame>
  );
}
