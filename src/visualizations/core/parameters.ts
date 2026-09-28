/**
 * Declarative parameter definitions. A visualization describes its controls
 * once; VizFrame renders them and useParameters keeps their state.
 */

export interface NumberParameter<K extends string = string> {
  type: 'number';
  key: K;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** Short symbol shown before the value, such as "n" or "λ". */
  symbol?: string;
  unit?: string;
  /** Decimal places shown next to the slider. */
  digits?: number;
}

export interface SelectParameter<K extends string = string> {
  type: 'select';
  key: K;
  label: string;
  options: readonly { value: string; label: string }[];
  default: string;
}

export interface ToggleParameter<K extends string = string> {
  type: 'toggle';
  key: K;
  label: string;
  default: boolean;
}

export type ParameterDefinition<K extends string = string> =
  NumberParameter<K> | SelectParameter<K> | ToggleParameter<K>;

type ValueOf<P> = P extends NumberParameter ? number : P extends SelectParameter ? string : boolean;

export type ParameterValues<T extends readonly ParameterDefinition[]> = {
  [P in T[number] as P['key']]: ValueOf<P>;
};

/** Identity helper that preserves literal keys for type inference. */
export function defineParameters<const T extends readonly ParameterDefinition[]>(
  definitions: T,
): T {
  return definitions;
}

export function defaultValues<T extends readonly ParameterDefinition[]>(
  definitions: T,
): ParameterValues<T> {
  return Object.fromEntries(
    definitions.map((definition) => [definition.key, definition.default]),
  ) as ParameterValues<T>;
}

/** Clamps and snaps a number to the parameter's grid. */
export function normalizeNumber(definition: NumberParameter, value: number): number {
  const clamped = Math.min(definition.max, Math.max(definition.min, value));
  const steps = Math.round((clamped - definition.min) / definition.step);
  const snapped = definition.min + steps * definition.step;
  // Remove floating point noise such as 0.30000000000000004.
  const decimals = Math.max(0, -Math.floor(Math.log10(definition.step)) + 1);
  return Number(snapped.toFixed(Math.min(12, decimals)));
}

/** Converts an untrusted value (from the URL or frontmatter) into a valid one, or undefined. */
export function coerceValue(
  definition: ParameterDefinition,
  raw: unknown,
): number | string | boolean | undefined {
  switch (definition.type) {
    case 'number': {
      const value =
        typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
      return Number.isFinite(value) ? normalizeNumber(definition, value) : undefined;
    }
    case 'select': {
      const value = String(raw);
      return definition.options.some((option) => option.value === value) ? value : undefined;
    }
    case 'toggle': {
      if (typeof raw === 'boolean') return raw;
      if (raw === 'true' || raw === '1') return true;
      if (raw === 'false' || raw === '0') return false;
      return undefined;
    }
  }
}

/** Default values overridden by any valid entries of `overrides`. */
export function initialValues<T extends readonly ParameterDefinition[]>(
  definitions: T,
  overrides: Record<string, unknown>,
): ParameterValues<T> {
  const values: Record<string, unknown> = {};
  for (const definition of definitions) {
    const override = overrides[definition.key];
    values[definition.key] =
      override === undefined
        ? definition.default
        : (coerceValue(definition, override) ?? definition.default);
  }
  return values as ParameterValues<T>;
}
