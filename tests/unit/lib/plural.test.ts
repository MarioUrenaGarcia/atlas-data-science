import { describe, expect, it } from 'vitest';
import { pluralize } from '../../../src/lib/format/plural.ts';

describe('pluralize', () => {
  it('follows the basic Spanish rules', () => {
    expect(pluralize('Hogar')).toBe('Hogares');
    expect(pluralize('Pez')).toBe('Peces');
    expect(pluralize('Transacción')).toBe('Transacciones');
    expect(pluralize('Huerta')).toBe('Huertas');
    expect(pluralize('Hospital')).toBe('Hospitales');
    expect(pluralize('Proveedor')).toBe('Proveedores');
    expect(pluralize('Lote')).toBe('Lotes');
    expect(pluralize('Mes')).toBe('Meses');
    expect(pluralize('Análisis')).toBe('Análisis');
    expect(pluralize('Lectura de sensor')).toBe('Lectura de sensores');
  });
});
