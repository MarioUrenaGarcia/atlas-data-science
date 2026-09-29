import { useCallback, useContext, useMemo, useState } from 'react';
import {
  coerceValue,
  initialValues,
  type ParameterDefinition,
  type ParameterValues,
} from './parameters.ts';
import { UrlSyncContext } from './urlSync.ts';

const URL_PREFIX = 'v.';

function readUrl(definitions: readonly ParameterDefinition[]): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const values: Record<string, unknown> = {};
  for (const definition of definitions) {
    const raw = params.get(URL_PREFIX + definition.key);
    if (raw !== null) values[definition.key] = raw;
  }
  return values;
}

function writeUrl(values: Record<string, unknown>, defaults: Record<string, unknown>): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) {
    if (value === defaults[key]) url.searchParams.delete(URL_PREFIX + key);
    else url.searchParams.set(URL_PREFIX + key, String(value));
  }
  // replaceState keeps the history clean while making the current state shareable.
  window.history.replaceState(window.history.state, '', url);
}

export interface ParametersState<T extends readonly ParameterDefinition[]> {
  definitions: T;
  values: ParameterValues<T>;
  set: (key: string, value: number | string | boolean) => void;
  reset: () => void;
}

/**
 * Parameter state initialized from the definition defaults, then the concept
 * frontmatter, then the page URL. With `syncUrl`, every change is mirrored in
 * query parameters prefixed with "v." so the exact state can be shared.
 */
export function useParameters<const T extends readonly ParameterDefinition[]>(
  definitions: T,
  overrides: Record<string, unknown> = {},
  syncUrlOverride?: boolean,
): ParametersState<T> {
  const syncFromContext = useContext(UrlSyncContext);
  const syncUrl = syncUrlOverride ?? syncFromContext;
  const base = useMemo(() => initialValues(definitions, overrides), [definitions, overrides]);
  const [values, setValues] = useState<ParameterValues<T>>(() =>
    syncUrl
      ? initialValues(definitions, {
          ...(base as Record<string, unknown>),
          ...readUrl(definitions),
        })
      : base,
  );

  const set = useCallback(
    (key: string, value: number | string | boolean) => {
      const definition = definitions.find((candidate) => candidate.key === key);
      if (!definition) return;
      const coerced = coerceValue(definition, value);
      if (coerced === undefined) return;
      setValues((previous) => {
        const next = { ...previous, [key]: coerced } as ParameterValues<T>;
        if (syncUrl) writeUrl(next as Record<string, unknown>, base as Record<string, unknown>);
        return next;
      });
    },
    [definitions, base, syncUrl],
  );

  const reset = useCallback(() => {
    setValues(base);
    if (syncUrl) writeUrl(base as Record<string, unknown>, base as Record<string, unknown>);
  }, [base, syncUrl]);

  return { definitions, values, set, reset };
}
