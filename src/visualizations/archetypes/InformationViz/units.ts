import { formatNumber } from '../../../lib/format/number.ts';

const unit = (text: string) => (text === '1' ? 'bit' : 'bits');

/** A value in bits written for KaTeX, with the singular unit when it reads exactly 1. */
export function bitsTex(value: number, digits = 3): string {
  const text = formatNumber(value, digits);
  return `${text}\\ \\text{${unit(text)}}`;
}

/** A value in bits as plain text for readouts and descriptions. */
export function bitsText(value: number, digits = 3): string {
  const text = formatNumber(value, digits);
  return `${text} ${unit(text)}`;
}
