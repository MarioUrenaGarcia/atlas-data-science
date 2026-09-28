import { describe, expect, it } from 'vitest';
import { parseSyllabus, resolveReference } from '../../../scripts/content/syllabus.ts';

const OUTLINE = `
# Documento

## Convenciones

- Esta lista no es un concepto.

## Módulo 0. Fundamentos

### 0.1 Conjuntos

Nivel: Básico a Intermedio
Visualización sugerida: diagramas.

- Conjuntos y notación
- Supremo e ínfimo [Intermedio]
- Funciones (dominio, codominio, imagen)

## Módulo 1. Probabilidad

### 1.1 Variables

Nivel: Intermedio

- Función de supervivencia
- Funciones (ref: Funciones (dominio, codominio, imagen))

### 1.2 Otra

Nivel: Avanzado

- Función de supervivencia
- Máximos (ref: GEV)
- Distribución generalizada de valores extremos (GEV)
`;

describe('parseSyllabus', () => {
  const syllabus = parseSyllabus(OUTLINE);

  it('reads modules, submodules and levels', () => {
    expect(syllabus.modules.map((module) => module.numero)).toEqual([0, 1]);
    expect(syllabus.submodules[0]).toEqual({
      clave: '0.1',
      titulo: 'Conjuntos',
      niveles: ['basico', 'intermedio'],
    });
  });

  it('creates concepts with inherited or explicit level and syllabus order', () => {
    const [first, second, third] = syllabus.concepts;
    expect(first).toMatchObject({ id: 'conjuntos-y-notacion', nivel: 'basico', orden: 1 });
    expect(second).toMatchObject({ id: 'supremo-e-infimo', nivel: 'intermedio', orden: 2 });
    expect(third).toMatchObject({
      id: 'funciones',
      titulo: 'Funciones (dominio, codominio, imagen)',
    });
  });

  it('suffixes colliding ids with the submodule key', () => {
    const ids = syllabus.concepts.map((concept) => concept.id);
    expect(ids).toContain('funcion-de-supervivencia');
    expect(ids).toContain('funcion-de-supervivencia-1-2');
  });

  it('keeps references out of the concept list and resolves them', () => {
    expect(syllabus.concepts).toHaveLength(6);
    expect(syllabus.references).toHaveLength(2);
    const [byTitle, byAcronym] = syllabus.references;
    expect(resolveReference(syllabus, byTitle?.target ?? '')).toBe('funciones');
    expect(resolveReference(syllabus, byAcronym?.target ?? '')).toBe(
      'distribucion-generalizada-de-valores-extremos',
    );
  });
});
