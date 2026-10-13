import { resolveSource, type VariableSource } from '../RandomVariableLab/source.ts';
import type { MomentFunctionVizConfig } from './schema.ts';

export { momentsOf } from '../RandomVariableLab/source.ts';

/**
 * The distribution behind the generating functions, as a finite pmf: catalog
 * distributions are discretized finely (continuous) or listed (discrete).
 */
export function momentSource(config: MomentFunctionVizConfig): VariableSource {
  return resolveSource(
    config.valores
      ? {
          modo: 'forma',
          valores: config.valores,
          probabilidades: config.probabilidades,
          nombre: config.nombre,
        }
      : {
          modo: 'forma',
          distribucion: config.distribucion,
          parametros: config.parametros,
          nombre: config.nombre,
        },
  );
}
