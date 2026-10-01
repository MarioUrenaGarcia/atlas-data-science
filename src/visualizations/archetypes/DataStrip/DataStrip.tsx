import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { BesselView } from './BesselView.tsx';
import { BoxView } from './BoxView.tsx';
import { DispersionView } from './DispersionView.tsx';
import { QuantileView } from './QuantileView.tsx';
import { StandardizeView } from './StandardizeView.tsx';
import { CenterView } from './CenterView.tsx';
import type { DataStripConfig } from './schema.ts';
import { SemicircleView } from './SemicircleView.tsx';

/** Observations on a number line with descriptive statistics computed live. */
export default function DataStrip({ params, title, conceptId }: VisualizationProps) {
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
    case 'dispersion':
      return (
        <DispersionView
          title={title}
          main={{
            values: config.datos,
            variable: config.variable,
            unit: config.unidad ?? '',
            ...(config.etiquetas ? { labels: config.etiquetas } : {}),
            ...(config.dominio ? { domain: config.dominio } : {}),
          }}
          {...(config.comparar
            ? {
                other: {
                  values: config.comparar.datos,
                  variable: config.comparar.variable,
                  unit: config.comparar.unidad ?? '',
                  ...(config.comparar.etiquetas ? { labels: config.comparar.etiquetas } : {}),
                  ...(config.comparar.dominio ? { domain: config.comparar.dominio } : {}),
                },
              }
            : {})}
          measure={config.medida}
          readouts={config.lecturas ?? [config.medida]}
          squares={config.cuadrados ?? false}
          band={config.banda ?? false}
          decimals={config.decimales ?? 1}
        />
      );
    case 'bessel':
      return (
        <BesselView
          title={title}
          n={config.n}
          mu={config.media}
          sigma={config.desviacion}
          variable={config.variable}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'cuantiles':
      return (
        <QuantileView
          title={title}
          data={config.datos}
          p={config.p ?? 0.5}
          family={config.familia}
          method={config.metodo ?? 7}
          compareMethods={config.compararMetodos ?? false}
          variable={config.variable}
          unit={config.unidad ?? ''}
          decimals={config.decimales ?? 1}
        />
      );
    case 'caja':
      return (
        <BoxView
          title={title}
          data={config.datos}
          k={config.k ?? 1.5}
          until={config.hasta ?? 6}
          variable={config.variable}
          unit={config.unidad ?? ''}
          decimals={config.decimales ?? 1}
          {...(config.dominio ? { domain: config.dominio } : {})}
        />
      );
    case 'estandarizar':
      return (
        <StandardizeView
          title={title}
          groups={config.grupos.map((group) => ({
            values: group.datos,
            variable: group.variable,
            unit: group.unidad ?? '',
            ...(group.resaltar === undefined ? {} : { highlight: group.resaltar }),
          }))}
          robust={config.robusta ?? false}
          {...(config.umbral === undefined ? {} : { threshold: config.umbral })}
          decimals={config.decimales ?? 1}
        />
      );
  }
}
