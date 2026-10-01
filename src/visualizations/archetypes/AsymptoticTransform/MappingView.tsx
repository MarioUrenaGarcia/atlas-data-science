import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  atomsCdf,
  mapAtoms,
  MAPS,
  sequenceAtoms,
  type Atom,
  type MapId,
} from '../../../lib/limits/mapping.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { makeBins } from '../../shared/binning.ts';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import styles from './AsymptoticTransform.module.css';
import { AtomBars } from './AtomBars.tsx';

const STEPS_PER_SECOND = 4;
const GRID = 400;
const Z_DOMAIN: [number, number] = [-4, 4];

const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/** Histogram of the standardized binomial with bins whose edges fall halfway between atoms. */
function latticeHistogram(atoms: readonly Atom[], n: number) {
  const bins = makeBins(Z_DOMAIN[0], Z_DOMAIN[1], {
    spacing: 2 / Math.sqrt(n),
    origin: -Math.sqrt(n),
  });
  const masses = new Array<number>(bins.count).fill(0);
  for (const { x, p } of atoms) {
    const index = Math.floor((x - bins.start) / bins.width);
    if (index >= 0 && index < bins.count) masses[index] = (masses[index] ?? 0) + p;
  }
  return { start: bins.start, width: bins.width, densities: masses.map((m) => m / bins.width) };
}

interface MappingViewProps {
  title: string;
  map: MapId;
  maps: readonly MapId[];
  nMax: number;
}

/**
 * Continuous mapping theorem with exact laws. X_n is a standardized
 * binomial (or the constant 1/n in the counterexample); g(X_n) is computed
 * atom by atom and compared with the law of g(X).
 */
export function MappingView({ title, map, maps, nMax }: MappingViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(maps.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'funcion',
              label: 'Función g',
              options: maps.map((id) => ({ value: id, label: MAPS[id].label })),
              default: map,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Índice',
        symbol: 'n',
        min: 1,
        max: nMax,
        step: 1,
        default: 4,
        digits: 0,
      },
    ],
    [maps, map, nMax],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (maps.length > 1 ? String(values.funcion) : map) as MapId;
  const definition = MAPS[selected];

  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(nMax, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= nMax,
  });
  const n = sweep ?? Number(values.n);

  const xAtoms = useMemo(() => sequenceAtoms(definition, n), [definition, n]);
  const yAtoms = useMemo(() => mapAtoms(xAtoms, definition.g), [xAtoms, definition]);
  const [lo, hi] = definition.domain;
  const discrete = 'atoms' in definition.limit;
  const distance = useMemo(() => {
    let best = 0;
    for (let i = 0; i <= GRID; i += 1) {
      const y = lo + ((hi - lo) * i) / GRID;
      best = Math.max(best, Math.abs(atomsCdf(yAtoms, y) - definition.limitCdf(y)));
    }
    return best;
  }, [yAtoms, definition, lo, hi]);
  const xHistogram = useMemo(
    () => (definition.constantSequence ? null : latticeHistogram(xAtoms, n)),
    [xAtoms, definition.constantSequence, n],
  );
  const gLatex = (arg: string) => definition.latex.replaceAll('#', arg);
  const xLatex = definition.constantSequence
    ? `X_{${n}} = \\tfrac{1}{${n}}`
    : `X_{${n}} = \\frac{B_{${n}} - ${n}/2}{\\sqrt{${n}/4}}`;
  const limitAtoms = 'atoms' in definition.limit ? definition.limit.atoms : [];

  const description =
    `${definition.label}. Con n = ${n}, la mayor diferencia entre la distribución de g(Xₙ) y la de g(X) es ${formatNumber(distance, 4)}. ` +
    (definition.constantSequence
      ? 'Xₙ = 1/n converge a 0, pero g(Xₙ) = 1 para todo n mientras que g(0) = 0: g es discontinua justo donde el límite pone toda su masa.'
      : definition.continuous
        ? 'Como g es continua, g(Xₙ) converge en distribución a g(Z).'
        : 'g es discontinua solo en 0, donde Z no tiene masa, así que el teorema sigue aplicando.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        {
          label: 'sup |P(g(Xₙ) ≤ y) - P(g(X) ≤ y)|',
          value: formatNumber(distance, 4),
          color: DATA_COLORS.secondary,
        },
        ...(discrete
          ? [
              {
                label: 'P(g(Xₙ) = 1)',
                value: formatNumber(yAtoms.find((a) => a.x === 1)?.p ?? 0, 4),
              },
              {
                label: 'P(g(X) = 1)',
                value: formatNumber(limitAtoms.find((a) => a.x === 1)?.p ?? 0, 4),
              },
            ]
          : []),
        { label: 'g continua en todas partes', value: definition.continuous ? 'sí' : 'no' },
      ]}
      legend={[
        { label: 'Distribución exacta para este n', color: DATA_COLORS.secondary },
        {
          label: 'Distribución límite',
          color: DATA_COLORS.primary,
          shape: discrete ? 'square' : 'line',
        },
        ...(discrete
          ? []
          : [
              {
                label: 'Normal estándar, límite de Xₙ',
                color: DATA_COLORS.primary,
                shape: 'line' as const,
              },
            ]),
      ]}
      description={description}
    >
      <FormulaLine
        tex={`${xLatex},\\qquad g(X_{${n}}) = ${gLatex(`X_{${n}}`)}\\ \\xrightarrow{?}\\ ${definition.limitLatex}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Xₙ</p>
          {xHistogram ? (
            <DensityHistogram
              start={xHistogram.start}
              width={xHistogram.width}
              densities={xHistogram.densities}
              curves={[{ f: phi, color: DATA_COLORS.primary }]}
              domain={Z_DOMAIN}
              label={`Distribución de X. ${description}`}
              axisLabel="Xₙ"
              aspect={0.7}
            />
          ) : (
            <AtomBars
              atoms={xAtoms}
              limit={[{ x: 0, p: 1 }]}
              label={`Distribución de X. ${description}`}
              axisLabel="Xₙ"
            />
          )}
        </div>
        <div>
          <p className={styles.panelTitle}>
            {discrete ? 'g(Xₙ)' : 'Funciones de distribución de g(Xₙ) y g(X)'}
          </p>
          {!discrete ? (
            <FunctionPlot
              xDomain={definition.domain}
              yDomain={[-0.03, 1.05]}
              label={`Distribución de g de X. ${description}`}
              aspect={0.7}
              xLabel="y"
              curves={[
                { f: (y) => definition.limitCdf(y), color: DATA_COLORS.primary, width: 2.5 },
                { f: (y) => atomsCdf(yAtoms, y), color: DATA_COLORS.secondary, width: 2 },
              ]}
            />
          ) : (
            <AtomBars
              atoms={yAtoms}
              limit={limitAtoms}
              label={`Distribución de g de X. ${description}`}
              axisLabel="g(Xₙ)"
            />
          )}
        </div>
      </div>
    </VizFrame>
  );
}
