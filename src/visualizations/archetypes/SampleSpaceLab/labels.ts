import {
  EVENT_OPERATIONS,
  experiment,
  type EventOperation,
  type ExperimentId,
} from '../../../lib/probability/sampleSpace.ts';

export const OPERATION_LABELS: Record<EventOperation, string> = {
  A: 'Solo A',
  B: 'Solo B',
  union: 'A o B (unión)',
  interseccion: 'A y B (intersección)',
  complemento: 'No A (complemento)',
  diferencia: 'A pero no B (diferencia)',
  'diferencia-simetrica': 'Exactamente uno de los dos',
};

export function eventOptions(id: ExperimentId, allowed?: readonly string[]) {
  const events = experiment(id).events;
  const list = allowed ? events.filter((event) => allowed.includes(event.id)) : events;
  return list.map((event) => ({ value: event.id, label: event.label }));
}

export function operationOptions(allowed?: readonly EventOperation[]) {
  return (allowed ?? EVENT_OPERATIONS).map((operation) => ({
    value: operation,
    label: OPERATION_LABELS[operation],
  }));
}

export function eventLabel(id: ExperimentId, eventId: string): string {
  return experiment(id).events.find((event) => event.id === eventId)?.label ?? eventId;
}

/** Caption that explains how the grid is arranged. */
export function gridCaption(id: ExperimentId): string {
  const space = experiment(id);
  const coins = id.includes('moneda') ? ' C: cara, X: cruz.' : '';
  if (space.rows === 1)
    return `Cada casilla es un resultado posible: ${space.outcomes.length} en total.${coins}`;
  return `Filas: ${space.rowTitle}. Columnas: ${space.colTitle}. Cada casilla es un resultado posible: ${space.outcomes.length} en total.${coins}`;
}
