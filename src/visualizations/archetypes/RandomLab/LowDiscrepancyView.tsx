import { useMemo, useState } from 'react';
import { halton2, MersenneTwister, starDiscrepancy } from '../../../lib/random/generators.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import styles from './RandomLab.module.css';
import type { RandomLabConfig } from './schema.ts';
import { SquarePlot } from './SquarePlot.tsx';

const MAX_POINTS = 2048;
const POINTS_PER_SECOND = 8;

/** Fraction of points inside the quarter circle, times 4: an estimate of pi. */
function piEstimate(points: readonly [number, number][]): number {
  if (points.length === 0) return 0;
  return (4 * points.filter(([x, y]) => x * x + y * y < 1).length) / points.length;
}

interface LowDiscrepancyViewProps {
  config: RandomLabConfig;
  title: string;
}

/**
 * Pseudorandom points against the Halton sequence in the unit square:
 * random points leave clumps and holes, while the Halton points fill the
 * square evenly. Both estimate pi with the quarter circle, and the
 * low-discrepancy estimate settles faster.
 */
export function LowDiscrepancyView({ config, title }: LowDiscrepancyViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('n', 'Puntos iniciales', 'n', 16, 1024, 16, initial.n ?? 64, 0),
      num('semilla', 'Semilla de los puntos aleatorios', 's', 1, 9999, 1, initial.semilla ?? 3, 0),
    ],
    [initial.n, initial.semilla],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const [extra, setExtra] = useState(0);
  const n = Math.min(MAX_POINTS, Number(v.n) + extra);
  const random = useMemo<[number, number][]>(() => {
    const mt = new MersenneTwister(Number(v.semilla));
    return Array.from({ length: MAX_POINTS }, () => [mt.next(), mt.next()]);
  }, [v.semilla]);
  const halton = useMemo<[number, number][]>(
    () => Array.from({ length: MAX_POINTS }, (_, i) => halton2(i + 1)),
    [],
  );
  const shownRandom = random.slice(0, n);
  const shownHalton = halton.slice(0, n);
  const dRandom = useMemo(() => starDiscrepancy(random.slice(0, n)), [random, n]);
  const dHalton = useMemo(() => starDiscrepancy(halton.slice(0, n)), [halton, n]);
  const piRandom = piEstimate(shownRandom);
  const piHalton = piEstimate(shownHalton);
  const playback = usePlayback({
    step: () => setExtra((value) => value + 1),
    reset: () => setExtra(0),
    rate: POINTS_PER_SECOND,
    done: n >= MAX_POINTS,
    autoplay: false,
  });
  const description =
    `${n} puntos. Discrepancia aproximada: aleatorios ${formatNumber(dRandom, 3)}, Halton ${formatNumber(dHalton, 3)}. ` +
    `Estimación de π: aleatorios ${formatNumber(piRandom, 4)}, Halton ${formatNumber(piHalton, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{
        ...parameters,
        values: v,
        reset: () => {
          parameters.reset();
          setExtra(0);
        },
      }}
      readouts={[
        { label: 'Puntos', value: String(n) },
        {
          label: 'Discrepancia, aleatorios',
          value: formatNumber(dRandom, 4),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Discrepancia, Halton',
          value: formatNumber(dHalton, 4),
          color: DATA_COLORS.primary,
        },
        { label: 'Error de π, aleatorios', value: formatNumber(Math.abs(piRandom - Math.PI), 4) },
        { label: 'Error de π, Halton', value: formatNumber(Math.abs(piHalton - Math.PI), 4) },
      ]}
      legend={[
        { label: 'Pseudoaleatorios (Mersenne Twister)', color: DATA_COLORS.secondary },
        { label: 'Sucesión de Halton en bases 2 y 3', color: DATA_COLORS.primary },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => {
          loadPreset(preset, definitions, parameters.set);
          setExtra(0);
        }}
      />
      <FormulaLine
        tex={`D_n^{*} = \\sup_{a, b}\\left|\\frac{\\#\\{\\mathbf{x}_i \\in [0, a) \\times [0, b)\\}}{n} - ab\\right|,\\qquad n = ${n}`}
      />
      <div className={styles.pair}>
        {[
          { name: 'Pseudoaleatorios', points: shownRandom, color: DATA_COLORS.secondary },
          { name: 'Halton', points: shownHalton, color: DATA_COLORS.primary },
        ].map((panel) => (
          <div key={panel.name}>
            <p className={styles.panelTitle}>{panel.name}</p>
            <SquarePlot
              domain={[0, 1]}
              label={`${panel.name}: ${n} puntos en el cuadrado unitario`}
              xLabel="x"
              yLabel="y"
              maxHeight={340}
            >
              {({ x, y }) => (
                <g aria-hidden="true">
                  <path
                    d={`M ${x(1)} ${y(0)} A ${x(1) - x(0)} ${y(0) - y(1)} 0 0 0 ${x(0)} ${y(1)}`}
                    fill="none"
                    stroke="var(--color-border-strong)"
                    strokeDasharray="4 3"
                  />
                  {panel.points.map(([px, py], i) => (
                    <circle
                      key={i}
                      cx={x(px)}
                      cy={y(py)}
                      r={2.2}
                      fill={panel.color}
                      fillOpacity={0.8}
                    />
                  ))}
                </g>
              )}
            </SquarePlot>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
