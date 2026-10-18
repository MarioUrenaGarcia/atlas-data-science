import { useCallback } from 'react';
import { marsagliaPolar } from '../../../lib/random/generators.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
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

const MAX_POINTS = 3000;
const POINTS_PER_SECOND = 3;
const QUICK_POINTS = 500;
const INITIAL_POINTS = 300;
const REACH = 4;

interface Proposal {
  v: [number, number];
  z: [number, number] | null;
}

interface PolarViewProps {
  config: RandomLabConfig;
  conceptId: string;
  title: string;
}

/**
 * Marsaglia's polar method: points uniform in the square [-1, 1]² are kept
 * only inside the unit circle (a fraction pi/4 of them), and each kept
 * point gives two normals without computing a sine or a cosine.
 */
export function PolarView({ config, conceptId, title }: PolarViewProps) {
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random): Proposal => {
    const v: [number, number] = [random.uniform(-1, 1), random.uniform(-1, 1)];
    return { v, z: marsagliaPolar(v[0], v[1]) };
  }, []);
  const { samples, stepMany, playback } = useSamples(seed, 'polar', draw, {
    max: MAX_POINTS,
    rate: POINTS_PER_SECOND,
    initial: INITIAL_POINTS,
  });
  const accepted = samples.filter((s) => s.z !== null);
  const rate = samples.length === 0 ? 0 : accepted.length / samples.length;
  const last = samples[samples.length - 1];
  const s = last ? last.v[0] ** 2 + last.v[1] ** 2 : 0;
  const description =
    `${samples.length} puntos propuestos en el cuadrado, ${accepted.length} aceptados dentro del círculo: tasa ${formatProbability(rate)} frente a π/4 = 0.7854. ` +
    (last
      ? `Último punto con s = ${formatNumber(s, 3)}, ${last.z ? 'aceptado' : 'rechazado'}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      controls={<QuickSample count={QUICK_POINTS} onClick={() => stepMany(QUICK_POINTS)} />}
      readouts={[
        { label: 'Puntos propuestos', value: String(samples.length) },
        { label: 'Aceptados', value: String(accepted.length), color: DATA_COLORS.primary },
        {
          label: 'Tasa de aceptación',
          value: formatProbability(rate),
          color: DATA_COLORS.secondary,
        },
        { label: 'Tasa teórica π/4', value: formatNumber(Math.PI / 4, 4) },
        { label: 'Último s = v₁² + v₂²', value: formatNumber(s, 4) },
      ]}
      legend={[
        { label: 'Aceptados (dentro del círculo)', color: DATA_COLORS.primary },
        { label: 'Rechazados', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`s = v_1^{2} + v_2^{2} < 1:\\quad Z_i = v_i\\sqrt{\\frac{-2\\log s}{s}},\\qquad \\text{aceptados} = ${formatProbability(rate)} \\approx \\frac{\\pi}{4}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Propuestas en el cuadrado</p>
          <SquarePlot
            domain={[-1, 1]}
            label="Puntos propuestos en el cuadrado de lado 2"
            xLabel="v₁"
            yLabel="v₂"
            maxHeight={340}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                <circle
                  cx={x(0)}
                  cy={y(0)}
                  r={x(1) - x(0)}
                  fill="none"
                  stroke="var(--color-border-strong)"
                  strokeWidth={1.5}
                />
                {samples.map((p, i) => (
                  <circle
                    key={i}
                    cx={x(p.v[0])}
                    cy={y(p.v[1])}
                    r={1.8}
                    fill={p.z ? DATA_COLORS.primary : DATA_COLORS.secondary}
                    fillOpacity={0.7}
                  />
                ))}
              </g>
            )}
          </SquarePlot>
        </div>
        <div>
          <p className={styles.panelTitle}>Normales obtenidas</p>
          <SquarePlot
            domain={[-REACH, REACH]}
            label="Pares de normales estándar"
            xLabel="z₁"
            yLabel="z₂"
            maxHeight={340}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                {accepted.map((p, i) => (
                  <circle
                    key={i}
                    cx={x(p.z?.[0] ?? 0)}
                    cy={y(p.z?.[1] ?? 0)}
                    r={1.8}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.6}
                  />
                ))}
              </g>
            )}
          </SquarePlot>
        </div>
      </div>
    </VizFrame>
  );
}
