import type { VisualizationProps } from '../../types.ts';
import { CenterView } from './CenterView.tsx';
import type { DataStripConfig } from './schema.ts';
import { SemicircleView } from './SemicircleView.tsx';

/** Observations on a number line with descriptive statistics computed live. */
export default function DataStrip({ params, title }: VisualizationProps) {
  const config = params as unknown as DataStripConfig;
  switch (config.modo) {
    case 'centro':
      return (
        <CenterView
          title={title}
          data={config.datos}
          measures={config.medidas}
          {...(config.pesos ? { weights: config.pesos } : {})}
          {...(config.proporcion === undefined ? {} : { proportion: config.proporcion })}
          balance={config.balanza ?? false}
          {...(config.atipico ? { outlier: config.atipico } : {})}
          variable={config.variable}
          unit={config.unidad ?? ''}
          {...(config.dominio ? { domain: config.dominio } : {})}
          decimals={config.decimales ?? 1}
          {...(config.etiquetas ? { labels: config.etiquetas } : {})}
        />
      );
    case 'semicirculo':
      return (
        <SemicircleView
          title={title}
          a={config.a}
          b={config.b}
          {...(config.variable ? { variable: config.variable } : {})}
        />
      );
  }
}
