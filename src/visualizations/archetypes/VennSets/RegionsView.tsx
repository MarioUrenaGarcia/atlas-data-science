import { useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { describeRegion, formatSet, membershipMask, regionLatex } from './setMath.ts';
import styles from './VennSets.module.css';
import { VennDiagram } from './VennDiagram.tsx';

const REGIONS_PER_SECOND = 0.6;

interface RegionsViewProps {
  title: string;
  universe: readonly number[];
  sets: readonly { etiqueta: string; elementos: number[] }[];
}

/**
 * The 2^k regions of a Venn diagram with k sets, visited one at a time.
 * Clicking a region jumps to it; each region is an intersection of sets and
 * complements, and together they partition the universe.
 */
export function RegionsView({ title, universe, sets }: RegionsViewProps) {
  const labels = sets.map((set) => set.etiqueta);
  const regionCount = 2 ** labels.length;
  // Regions are visited from the innermost (all sets) to the outside.
  const order = Array.from({ length: regionCount }, (_, index) => regionCount - 1 - index);
  const [position, setPosition] = useState(0);
  const playback = usePlayback({
    step: () => setPosition((value) => (value + 1) % regionCount),
    reset: () => setPosition(0),
    rate: REGIONS_PER_SECOND,
  });
  const masks = universe.map((element) =>
    membershipMask(
      element,
      sets.map((set) => set.elementos),
    ),
  );
  const region = order[position] ?? 0;
  const inside = universe.filter((_, index) => masks[index] === region);
  const counts = order.map((mask) => masks.filter((value) => value === mask).length);
  const description = `Región ${position + 1} de ${regionCount}: elementos ${describeRegion(region, labels)}. Contiene ${formatSet(inside)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Región', value: describeRegion(region, labels), color: DATA_COLORS.highlight },
        { label: 'Elementos de la región', value: formatSet(inside) },
        {
          label: 'Suma de las regiones',
          value: `${counts.reduce((total, value) => total + value, 0)} = |U|`,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Número de elementos por región',
        columns: ['Región', 'Elementos'],
        rows: order.map((mask, index) => [describeRegion(mask, labels), counts[index] ?? 0]),
      }}
    >
      <p className={styles.expression}>
        <Latex tex={regionLatex(region, labels)} />
      </p>
      <VennDiagram
        labels={labels}
        elements={universe}
        masks={masks}
        shaded={new Set([region])}
        highlighted={new Map(inside.map((element) => [element, true]))}
        label={description}
        onRegionClick={(mask) => {
          playback.pause();
          setPosition(order.indexOf(mask));
        }}
      />
    </VizFrame>
  );
}
