/** Short tick labels: integers as is, other values rounded by magnitude. */
export function defaultTickFormat(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const abs = Math.abs(value);
  const digits = abs >= 10 ? 1 : abs >= 1 ? 2 : 3;
  return String(Number(value.toFixed(digits)));
}
