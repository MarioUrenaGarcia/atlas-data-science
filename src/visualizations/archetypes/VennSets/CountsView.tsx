import { useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { OUTSIDE, type VennCountsConfig } from './schema.ts';
import { describeRegion } from './setMath.ts';
import styles from './VennSets.module.css';
import { VennDiagram } from './VennDiagram.tsx';

const QUERIES_PER_SECOND = 0.4;

/** Membership mask of a region key: "AC" in a diagram A, B, C is 0b101. */
function maskOf(key: string, labels: readonly string[]): number {
  if (key === OUTSIDE) return 0;
  return labels.reduce(
    (mask, label, index) => (key.includes(label) ? mask | (1 << index) : mask),
    0,
  );
}

/**
 * Venn diagram with the number of elements written in each region instead of
 * the elements themselves, as in survey tables. The queries shade a union of
 * regions one after another and add up its counts.
 */
export function CountsView({ title, config }: { title: string; config: VennCountsConfig }) {
  const labels = config.etiquetas;
  const regions = 2 ** labels.length;
  const counts = new Map<number, number>();
  for (const [key, value] of Object.entries(config.conteos)) counts.set(maskOf(key, labels), value);
  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  const [position, setPosition] = useState(0);
  const playback = usePlayback({
    step: () => setPosition((value) => (value + 1) % config.consultas.length),
    reset: () => setPosition(0),
    rate: QUERIES_PER_SECOND,
  });
  const query = config.consultas[position] ?? config.consultas[0];
  const shaded = new Set((query?.regiones ?? []).map((key) => maskOf(key, labels)));
  const sum = [...shaded].reduce((acc, mask) => acc + (counts.get(mask) ?? 0), 0);
  const terms = [...shaded].map((mask) => counts.get(mask) ?? 0);
  const regionText = new Map(
    Array.from({ length: regions - 1 }, (_, index) => index + 1).map((mask) => [
      mask,
      String(counts.get(mask) ?? 0),
    ]),
  );
  const outside = counts.get(0) ?? 0;
  const description =
    `${query?.nombre ?? ''}: ${terms.join(' + ')} = ${sum}. ` +
    `Conteos por región: ${Array.from({ length: regions }, (_, mask) => `${describeRegion(mask, labels)}, ${counts.get(mask) ?? 0}`).join('; ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Consulta', value: query?.nombre ?? '', color: DATA_COLORS.highlight },
        {
          label: 'Suma de sus regiones',
          value: `${terms.join(' + ')} = ${sum}`,
          color: DATA_COLORS.primary,
        },
        { label: config.universo ?? 'Total', value: String(total) },
        { label: 'Fuera de todos', value: String(outside) },
      ]}
      description={description}
      dataTable={{
        caption: 'Número de elementos por región',
        columns: ['Región', 'Elementos'],
        rows: Array.from({ length: regions }, (_, index) => regions - 1 - index).map((mask) => [
          describeRegion(mask, labels),
          counts.get(mask) ?? 0,
        ]),
      }}
      controls={
        <div className={styles.queries} role="group" aria-label="Consultas">
          {config.consultas.map((item, index) => (
            <button
              key={item.nombre}
              type="button"
              className={
                index === position ? `${styles.query} ${styles.queryActive}` : styles.query
              }
              aria-pressed={index === position}
              onClick={() => {
                playback.pause();
                setPosition(index);
              }}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      }
    >
      <VennDiagram
        labels={labels}
        elements={[]}
        masks={[]}
        shaded={shaded}
        label={description}
        title={config.universo ? `${config.universo}: ${total}` : undefined}
        regionText={regionText}
        showElements={false}
      />
      <p className={styles.expression}>Fuera de todos los conjuntos: {outside}.</p>
    </VizFrame>
  );
}
