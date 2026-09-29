import { formatNumber } from '../../../lib/format/number.ts';
import { REAL_FUNCTIONS } from '../../../lib/sets/realFunctions.ts';
import type { RestrictedFunction } from './schema.ts';

export const intervalText = ([a, b]: readonly [number, number]) =>
  `[${formatNumber(a, 2)}, ${formatNumber(b, 2)}]`;

/** Selector label of a restricted function, such as "f(x) = x² de [0, 2] en [0, 4]". */
export function functionName(item: RestrictedFunction): string {
  return (
    item.nombre ??
    `${REAL_FUNCTIONS[item.funcion].label} de ${intervalText(item.dominio)} en ${intervalText(item.codominio)}`
  );
}
