import { describe, expect, it } from 'vitest';
import {
  exportProgress,
  MAX_PROGRESS_FILE_BYTES,
  parseProgressFile,
} from '../../../src/store/progressFile.ts';

function file(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    formato: 'atlas-progreso',
    version: 1,
    exportado: '2026-01-01T00:00:00.000Z',
    conceptos: { gradiente: 'visto', 'teorema-de-bayes': 'dominado' },
    rutaActiva: { tipo: 'roadmap', objetivo: 'gradiente' },
    ...overrides,
  });
}

describe('parseProgressFile', () => {
  it('accepts its own export', () => {
    const exported = exportProgress({
      conceptos: { gradiente: 'dominado' },
      rutaActiva: { tipo: 'ruta', id: 'estadistico' },
    });
    expect(parseProgressFile(JSON.stringify(exported))).toEqual(exported);
  });

  it('accepts a well formed file', () => {
    expect(parseProgressFile(file())?.conceptos).toEqual({
      gradiente: 'visto',
      'teorema-de-bayes': 'dominado',
    });
  });

  it('rejects malformed JSON and unknown formats', () => {
    expect(parseProgressFile('{')).toBeNull();
    expect(parseProgressFile(file({ formato: 'otro' }))).toBeNull();
    expect(parseProgressFile(file({ version: 2 }))).toBeNull();
  });

  it('rejects concept keys that are not concept ids', () => {
    expect(parseProgressFile(file({ conceptos: { '<img src=x>': 'visto' } }))).toBeNull();
    expect(parseProgressFile(file({ conceptos: { '../../x': 'visto' } }))).toBeNull();
  });

  it('does not let a __proto__ key change the prototype', () => {
    const parsed = parseProgressFile(
      '{"formato":"atlas-progreso","version":1,"exportado":"x","conceptos":{"__proto__":"visto"},"rutaActiva":null}',
    );
    expect(parsed === null || Object.getPrototypeOf(parsed.conceptos) === Object.prototype).toBe(
      true,
    );
    expect(({} as Record<string, unknown>).visto).toBeUndefined();
  });

  it('rejects active routes that do not point to an id', () => {
    expect(
      parseProgressFile(file({ rutaActiva: { tipo: 'roadmap', objetivo: 'javascript:alert(1)' } })),
    ).toBeNull();
    expect(parseProgressFile(file({ rutaActiva: { tipo: 'ruta', id: '' } }))).toBeNull();
  });

  it('rejects statuses outside the allowed set', () => {
    expect(parseProgressFile(file({ conceptos: { gradiente: 'experto' } }))).toBeNull();
  });

  it('rejects files above the size limit before parsing', () => {
    const padding = ' '.repeat(MAX_PROGRESS_FILE_BYTES);
    expect(parseProgressFile(file() + padding)).toBeNull();
  });
});
