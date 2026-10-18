import { useMemo, useState } from 'react';
import { crossEntropy, entropy, normalize, perplexity } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const SAMPLES = 400;
const STEPS_PER_SECOND = 20;
const DEFAULT_SEED = 7;

interface PerplexityViewProps {
  title: string;
  p: readonly number[];
  q: readonly number[];
  seed?: number;
}

/**
 * Perplexity of a model on a stream of observations drawn from the true
 * distribution p: two raised to the average surprise the model assigns. As the
 * stream grows the running value settles at 2^H(p, q) for the model q and at
 * 2^H(p) for the true distribution, the smallest perplexity any model can reach.
 */
export function PerplexityView({
  title,
  p: pRaw,
  q: qRaw,
  seed: initialSeed = DEFAULT_SEED,
}: PerplexityViewProps) {
  const p = useMemo(() => normalize(pRaw), [pRaw]);
  const q = useMemo(() => normalize(qRaw), [qRaw]);
  const seed = useSeed(initialSeed);
  const draws = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: SAMPLES }, () => random.categorical(p));
  }, [seed.seed, p]);
  const [count, setCount] = useState(0);
  const playback = usePlayback({
    step: () => setCount((value) => Math.min(SAMPLES, value + 1)),
    reset: () => setCount(0),
    rate: STEPS_PER_SECOND,
    done: count >= SAMPLES,
  });
  const running = useMemo(() => {
    const model: number[] = [];
    const truth: number[] = [];
    let sq = 0;
    let sp = 0;
    draws.forEach((d, i) => {
      sq -= Math.log2(q[d] ?? 1);
      sp -= Math.log2(p[d] ?? 1);
      model.push(2 ** (sq / (i + 1)));
      truth.push(2 ** (sp / (i + 1)));
    });
    return { model, truth };
  }, [draws, p, q]);
  const k = p.length;
  const limitQ = 2 ** crossEntropy(p, q);
  const limitP = 2 ** entropy(p);
  const shown = draws.slice(0, count);
  const current = count > 0 ? perplexity(shown.map((d) => q[d] ?? 1)) : NaN;
  const currentP = count > 0 ? perplexity(shown.map((d) => p[d] ?? 1)) : NaN;
  const show = (v: number) => (Number.isFinite(v) ? formatNumber(v, 3) : 'sin datos');
  const yMax = Math.max(k, limitQ) * 1.25;
  const description =
    `${count} observaciones: perplejidad del modelo q ${show(current)}, de la distribución verdadera ${show(currentP)}. ` +
    `Límites 2^H(p,q) = ${formatNumber(limitQ, 3)} y 2^H(p) = ${formatNumber(limitP, 3)}, frente a ${k} valores posibles.`;
  const path = (values: readonly number[], x: (v: number) => number, y: (v: number) => number) =>
    values
      .slice(0, count)
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i + 1)},${y(Math.min(yMax, v))}`)
      .join(' ');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Observaciones', value: String(count) },
        { label: 'Perplejidad de q', value: show(current), color: DATA_COLORS.secondary },
        { label: 'Perplejidad de p', value: show(currentP), color: DATA_COLORS.primary },
        { label: 'Límite 2^H(p,q)', value: formatNumber(limitQ, 3) },
        { label: 'Límite 2^H(p)', value: formatNumber(limitP, 3) },
        { label: 'Valores posibles', value: String(k) },
      ]}
      legend={[
        { label: 'Modelo q', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Distribución verdadera p', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Límites', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\mathrm{PP}(q) = 2^{-\\frac{1}{N}\\sum_{i=1}^{N}\\log_2 q(x_i)} = ${show(current)}\\ \\xrightarrow{N\\to\\infty}\\ 2^{H(p,q)} = ${formatNumber(limitQ, 3)},\\quad N = ${count}`}
      />
      <FunctionPlot
        xDomain={[1, SAMPLES]}
        yDomain={[0, yMax]}
        xLabel="observaciones N"
        label={description}
        curves={[
          { f: () => limitQ, color: DATA_COLORS.muted, width: 1.5, dashed: true },
          { f: () => limitP, color: DATA_COLORS.muted, width: 1.5, dashed: true },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true" fill="none" strokeWidth={2.5}>
            <path d={path(running.model, x, y)} stroke={DATA_COLORS.secondary} />
            <path d={path(running.truth, x, y)} stroke={DATA_COLORS.primary} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
