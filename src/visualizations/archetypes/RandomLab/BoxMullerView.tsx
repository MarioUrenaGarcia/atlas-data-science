import { useCallback } from 'react';
import { boxMuller } from '../../../lib/random/generators.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { useSamples } from '../MultivariateExplorer/shared.ts';
import styles from './RandomLab.module.css';
import type { RandomLabConfig } from './schema.ts';
import { SquarePlot } from './SquarePlot.tsx';

const MAX_PAIRS = 3000;
const PAIRS_PER_SECOND = 2;
const QUICK_PAIRS = 500;
/** Pairs drawn before any interaction, so both clouds are visible from the start. */
const INITIAL_PAIRS = 300;
const REACH = 4;

interface Pair {
  u1: number;
  u2: number;
  z: [number, number];
}

interface BoxMullerViewProps {
  config: RandomLabConfig;
  conceptId: string;
  title: string;
}

/**
 * Box-Muller: each pair of uniforms in the square (left) becomes a radius
 * R = sqrt(-2 log u1) and an angle 2 pi u2, which place a point of the
 * standard bivariate normal (right). The latest pair is highlighted in
 * both panels with its radius and angle.
 */
export function BoxMullerView({ config, conceptId, title }: BoxMullerViewProps) {
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random): Pair => {
    const u1 = 1 - random.uniform();
    const u2 = random.uniform();
    return { u1, u2, z: boxMuller(u1, u2) };
  }, []);
  const { samples, stepMany, playback } = useSamples(seed, 'box-muller', draw, {
    max: MAX_PAIRS,
    rate: PAIRS_PER_SECOND,
    initial: INITIAL_PAIRS,
  });
  const last = samples[samples.length - 1];
  const zs = samples.flatMap((s) => s.z);
  const mean = zs.reduce((s, z) => s + z, 0) / Math.max(1, zs.length);
  const variance = zs.reduce((s, z) => s + (z - mean) ** 2, 0) / Math.max(1, zs.length - 1);
  const r = last ? Math.sqrt(-2 * Math.log(last.u1)) : 0;
  const theta = last ? 2 * Math.PI * last.u2 : 0;
  const description =
    `${samples.length} pares transformados. Último par u1 = ${formatNumber(last?.u1 ?? 0, 3)}, u2 = ${formatNumber(last?.u2 ?? 0, 3)}: radio ${formatNumber(r, 3)}, ángulo ${formatNumber(theta, 3)} radianes, ` +
    `normales ${formatNumber(last?.z[0] ?? 0, 3)} y ${formatNumber(last?.z[1] ?? 0, 3)}. Media de las normales ${formatNumber(mean, 3)} y varianza ${formatNumber(variance, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      controls={<QuickSample count={QUICK_PAIRS} onClick={() => stepMany(QUICK_PAIRS)} />}
      readouts={[
        {
          label: 'Pares transformados',
          value: String(samples.length),
          color: DATA_COLORS.tertiary,
        },
        {
          label: 'Último par (u₁, u₂)',
          value: `${formatNumber(last?.u1 ?? 0, 3)}, ${formatNumber(last?.u2 ?? 0, 3)}`,
        },
        { label: 'Radio √(-2 log u₁)', value: formatNumber(r, 3), color: DATA_COLORS.secondary },
        { label: 'Ángulo 2π u₂', value: formatNumber(theta, 3) },
        {
          label: 'Normales (z₁, z₂)',
          value: `${formatNumber(last?.z[0] ?? 0, 3)}, ${formatNumber(last?.z[1] ?? 0, 3)}`,
        },
        {
          label: 'Media y varianza de las normales',
          value: `${formatNumber(mean, 3)}, ${formatNumber(variance, 3)}`,
        },
      ]}
      legend={[
        { label: 'Pares anteriores', color: DATA_COLORS.tertiary },
        { label: 'Último par y su radio', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`Z_1 = \\sqrt{-2\\log U_1}\\cos(2\\pi U_2),\\quad Z_2 = \\sqrt{-2\\log U_1}\\sin(2\\pi U_2);\\quad R = ${formatNumber(r, 3)},\\ \\theta = ${formatNumber(theta, 3)}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Uniformes (u₁, u₂)</p>
          <SquarePlot
            domain={[0, 1]}
            label="Pares de uniformes en el cuadrado unitario"
            xLabel="u₁"
            yLabel="u₂"
            maxHeight={340}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                {samples.map((s, i) => (
                  <circle
                    key={i}
                    cx={x(s.u1)}
                    cy={y(s.u2)}
                    r={1.8}
                    fill={DATA_COLORS.tertiary}
                    fillOpacity={0.6}
                  />
                ))}
                {last && (
                  <circle
                    cx={x(last.u1)}
                    cy={y(last.u2)}
                    r={6}
                    fill={DATA_COLORS.secondary}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                )}
              </g>
            )}
          </SquarePlot>
        </div>
        <div>
          <p className={styles.panelTitle}>Normales (z₁, z₂)</p>
          <SquarePlot
            domain={[-REACH, REACH]}
            label="Pares de normales estándar obtenidos"
            xLabel="z₁"
            yLabel="z₂"
            maxHeight={340}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                {samples.map((s, i) => (
                  <circle
                    key={i}
                    cx={x(s.z[0])}
                    cy={y(s.z[1])}
                    r={1.8}
                    fill={DATA_COLORS.tertiary}
                    fillOpacity={0.6}
                  />
                ))}
                {last && (
                  <>
                    <circle
                      cx={x(0)}
                      cy={y(0)}
                      r={Math.abs(x(r) - x(0))}
                      fill="none"
                      stroke={DATA_COLORS.secondary}
                      strokeDasharray="4 3"
                    />
                    <line
                      x1={x(0)}
                      y1={y(0)}
                      x2={x(last.z[0])}
                      y2={y(last.z[1])}
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={2}
                    />
                    <circle
                      cx={x(last.z[0])}
                      cy={y(last.z[1])}
                      r={6}
                      fill={DATA_COLORS.secondary}
                      stroke="var(--color-surface)"
                      strokeWidth={2}
                    />
                  </>
                )}
              </g>
            )}
          </SquarePlot>
        </div>
      </div>
    </VizFrame>
  );
}
