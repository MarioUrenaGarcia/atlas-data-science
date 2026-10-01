import { useState } from 'react';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';
import { CLASS_AXES, type ClassAxis, type ClassExample } from './schema.ts';

const CARDS_PER_SECOND = 0.6;

const BIN_INFO: Record<string, { title: string; hint: string }> = {
  cualitativo: { title: 'Cualitativo', hint: 'Categorías o atributos' },
  cuantitativo: { title: 'Cuantitativo', hint: 'Cantidades medidas o contadas' },
  discreto: { title: 'Discreto', hint: 'Valores aislados, se cuentan' },
  continuo: { title: 'Continuo', hint: 'Cualquier valor de un intervalo, se miden' },
  nominal: { title: 'Nominal', hint: 'Solo igual o distinto' },
  ordinal: { title: 'Ordinal', hint: 'Además, un orden' },
  intervalo: { title: 'De intervalo', hint: 'Además, diferencias con sentido' },
  razon: { title: 'De razón', hint: 'Además, cero absoluto y cocientes' },
  estructurado: { title: 'Estructurado', hint: 'Filas y columnas fijas' },
  semiestructurado: { title: 'Semiestructurado', hint: 'Etiquetas, esquema flexible' },
  'no-estructurado': { title: 'No estructurado', hint: 'Texto, imagen, audio' },
  transversal: { title: 'Transversal', hint: 'Muchas unidades, un momento' },
  longitudinal: { title: 'Longitudinal', hint: 'Una unidad, muchos momentos' },
  panel: { title: 'De panel', hint: 'Las mismas unidades en varios momentos' },
};

const AXIS_QUESTION: Record<ClassAxis, string> = {
  naturaleza: '¿La variable registra una categoría o una cantidad?',
  medida: '¿Los valores posibles se cuentan uno por uno o llenan un intervalo?',
  escala: '¿Qué comparaciones entre valores tienen sentido?',
  estructura: '¿Los datos llegan en una tabla con columnas fijas?',
  temporal: '¿Cuántas unidades y cuántos momentos se observan?',
};

interface ClassifyViewProps {
  title: string;
  axis: ClassAxis;
  examples: readonly ClassExample[];
}

/**
 * Example variables that move one by one into the bin of their type. Each
 * card, when selected, shows the reason for its classification.
 */
export function ClassifyView({ title, axis, examples }: ClassifyViewProps) {
  const [placed, setPlaced] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => {
      setSelected(placed < examples.length ? placed : null);
      setPlaced((value) => Math.min(examples.length, value + 1));
    },
    reset: () => {
      setPlaced(0);
      setSelected(null);
    },
    rate: CARDS_PER_SECOND,
    done: placed >= examples.length,
  });
  const bins: readonly string[] = CLASS_AXES[axis];
  const active = selected === null ? null : examples[selected];
  const description =
    `${AXIS_QUESTION[axis]} ${placed} de ${examples.length} variables clasificadas. ` +
    examples
      .slice(0, placed)
      .map((item) => `${item.nombre}: ${BIN_INFO[item.clase]?.title ?? item.clase}`)
      .join('; ') +
    '.';

  const card = (item: ClassExample, index: number) => (
    <button
      key={item.nombre}
      type="button"
      className={index === selected ? `${styles.card} ${styles.cardActive}` : styles.card}
      aria-pressed={index === selected}
      onClick={() => {
        playback.pause();
        setSelected(index);
        if (index >= placed) setPlaced(index + 1);
      }}
    >
      <span className={styles.cardName}>{item.nombre}</span>
      <span className={styles.cardValues}>{item.valores}</span>
    </button>
  );

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Variables clasificadas', value: `${placed} de ${examples.length}` },
        ...bins.map((bin) => ({
          label: BIN_INFO[bin]?.title ?? bin,
          value: String(examples.slice(0, placed).filter((item) => item.clase === bin).length),
        })),
      ]}
      description={description}
    >
      <p className={styles.stage} aria-live="off">
        {active ? (
          <>
            <strong>{active.nombre}</strong>: {BIN_INFO[active.clase]?.title.toLowerCase()}.{' '}
            {active.razon}
          </>
        ) : (
          AXIS_QUESTION[axis]
        )}
      </p>
      <div className={styles.pool} aria-label="Variables sin clasificar">
        {examples.map((item, index) => (index >= placed ? card(item, index) : null))}
      </div>
      <div className={styles.bins}>
        {bins.map((bin) => (
          <section key={bin} className={styles.bin} aria-label={BIN_INFO[bin]?.title ?? bin}>
            <h4 className={styles.binTitle}>{BIN_INFO[bin]?.title}</h4>
            <p className={styles.binHint}>{BIN_INFO[bin]?.hint}</p>
            {examples.map((item, index) =>
              index < placed && item.clase === bin ? card(item, index) : null,
            )}
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
