import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { describeRegion, membershipMask } from './setMath.ts';
import styles from './VennSets.module.css';
import { VennDiagram } from './VennDiagram.tsx';

const TERMS_PER_SECOND = 0.5;

interface InclusionExclusionViewProps {
  title: string;
  universe: readonly number[];
  sets: readonly { etiqueta: string; elementos: number[] }[];
}

function bitCount(mask: number): number {
  let count = 0;
  for (let rest = mask; rest > 0; rest >>= 1) count += rest & 1;
  return count;
}

/**
 * Inclusion and exclusion applied term by term. Each region shows how many
 * times its elements have been counted so far: single sets count the
 * overlaps several times, subtracting pairwise intersections overcorrects the
 * center, and adding the triple intersection leaves every region at exactly one.
 */
export function InclusionExclusionView({ title, universe, sets }: InclusionExclusionViewProps) {
  const labels = sets.map((set) => set.etiqueta);
  const k = labels.length;
  const terms = useMemo(
    () =>
      Array.from({ length: 2 ** k - 1 }, (_, index) => index + 1).sort(
        (a, b) => bitCount(a) - bitCount(b) || a - b,
      ),
    [k],
  );
  const definitions = useMemo(
    () => [
      { type: 'toggle' as const, key: 'elementos', label: 'Mostrar los elementos', default: true },
    ],
    [],
  );
  const parameters = useParameters(definitions);
  const showElements = Boolean((parameters.values as Record<string, boolean>).elementos);
  const [applied, setApplied] = useState(0);
  const playback = usePlayback({
    step: () => setApplied((value) => Math.min(terms.length, value + 1)),
    reset: () => setApplied(0),
    rate: TERMS_PER_SECOND,
    done: applied >= terms.length,
  });
  const masks = universe.map((element) =>
    membershipMask(
      element,
      sets.map((set) => set.elementos),
    ),
  );
  const sizeOf = (term: number) => masks.filter((mask) => (mask & term) === term).length;
  const sign = (term: number) => (bitCount(term) % 2 === 1 ? 1 : -1);
  const counters = new Map<number, number>();
  for (let region = 1; region < 2 ** k; region += 1) {
    const times = terms
      .slice(0, applied)
      .reduce((sum, term) => sum + ((region & term) === term ? sign(term) : 0), 0);
    counters.set(region, times);
  }
  const running = terms.slice(0, applied).reduce((sum, term) => sum + sign(term) * sizeOf(term), 0);
  const union = masks.filter((mask) => mask !== 0).length;
  const current = applied > 0 ? terms[applied - 1] : undefined;
  const termLatex = (term: number) =>
    `|${labels.filter((_, index) => (term >> index) & 1).join(' \\cap ')}|`;
  const shaded = new Set(
    current === undefined
      ? []
      : Array.from({ length: 2 ** k }, (_, region) => region).filter(
          (region) => (region & current) === current,
        ),
  );
  const formula = terms
    .map((term, index) => `${index === 0 ? '' : sign(term) > 0 ? '+' : '-'} ${termLatex(term)}`)
    .join(' ');
  const description =
    `Inclusión y exclusión con ${k} conjuntos: se han aplicado ${applied} de ${terms.length} términos y el total parcial es ${running}; la unión tiene ${union} elementos. ` +
    `Veces contada cada región: ${[...counters].map(([region, times]) => `${describeRegion(region, labels)}, ${times}`).join('; ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        {
          label: 'Término actual',
          value:
            current === undefined
              ? 'ninguno'
              : `${sign(current) > 0 ? '+' : '-'}${sizeOf(current)}`,
          color: sign(current ?? 1) > 0 ? DATA_COLORS.tertiary : DATA_COLORS.secondary,
        },
        { label: 'Total parcial', value: String(running), color: DATA_COLORS.primary },
        { label: `|${labels.join(' ∪ ')}|`, value: String(union) },
      ]}
      description={description}
      dataTable={{
        caption: 'Términos de la fórmula',
        columns: ['Intersección', 'Signo', 'Elementos'],
        rows: terms.map((term) => [
          labels.filter((_, index) => (term >> index) & 1).join(' ∩ '),
          sign(term) > 0 ? '+' : '-',
          sizeOf(term),
        ]),
      }}
    >
      <p className={styles.expression}>
        <Latex tex={`|${labels.join(' \\cup ')}| = ${formula}`} />
      </p>
      <VennDiagram
        labels={labels}
        elements={universe}
        masks={masks}
        shaded={shaded}
        shadeColor={sign(current ?? 1) > 0 ? DATA_COLORS.tertiary : DATA_COLORS.secondary}
        label={description}
        regionText={new Map([...counters].map(([region, times]) => [region, `${times}`]))}
        showElements={showElements}
      />
      <p className={styles.expression}>
        Número grande en cada región: veces que se han contado sus elementos.
      </p>
    </VizFrame>
  );
}
