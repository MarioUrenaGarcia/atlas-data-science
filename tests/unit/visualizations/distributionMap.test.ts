import { describe, expect, it } from 'vitest';
import { parametersSchema as continuousSchema } from '../../../src/visualizations/archetypes/ContinuousGenesis/schema.ts';
import { parametersSchema as explorerSchema } from '../../../src/visualizations/archetypes/DistributionExplorer/schema.ts';
import { parametersSchema as discreteSchema } from '../../../src/visualizations/archetypes/DistributionGenesis/schema.ts';
import {
  NODES,
  RELATIONS,
} from '../../../src/visualizations/archetypes/DistributionMap/relations.ts';

const SCHEMAS = {
  DistributionExplorer: explorerSchema,
  ContinuousGenesis: continuousSchema,
  DistributionGenesis: discreteSchema,
};

describe('mapa de relaciones', () => {
  it('une solo distribuciones que tienen nodo', () => {
    const ids = new Set(NODES.map((node) => node.id));
    for (const relation of RELATIONS) {
      expect(ids.has(relation.from), relation.id).toBe(true);
      expect(ids.has(relation.to), relation.id).toBe(true);
    }
  });

  it('usa identificadores únicos', () => {
    expect(new Set(RELATIONS.map((relation) => relation.id)).size).toBe(RELATIONS.length);
  });

  it('cada vista tiene parámetros válidos para su componente', () => {
    for (const relation of RELATIONS) {
      const result = SCHEMAS[relation.view.componente].safeParse(relation.view.parametros);
      expect(result.success, relation.id).toBe(true);
    }
  });

  it('cada nodo usado lleva a una ficha', () => {
    for (const node of NODES) expect(node.concept).toMatch(/^distribucion/);
  });
});
