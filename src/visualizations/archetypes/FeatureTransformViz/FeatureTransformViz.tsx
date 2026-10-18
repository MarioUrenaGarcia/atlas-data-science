import { resolveSample, axisLabel } from '../ChartGallery/samples.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { IqrOutliersView } from './IqrOutliersView.tsx';
import { PowerView } from './PowerView.tsx';
import type { FeatureTransformConfig } from './schema.ts';
import { TransformView } from './TransformView.tsx';
import { ZOutliersView } from './ZOutliersView.tsx';

/** A variable before and after a transformation, and the rules that flag its outliers. */
export default function FeatureTransformViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as FeatureTransformConfig;
  const seed = defaultSeed(conceptId, config.semilla);
  const values = resolveSample(config.muestra, seed);
  const label = axisLabel(config.eje);
  switch (config.modo) {
    case 'transformacion':
      return (
        <TransformView
          title={title}
          values={values}
          label={label}
          transform={config.funcion ?? 'log'}
        />
      );
    case 'box-cox':
    case 'yeo-johnson':
      return (
        <PowerView
          title={title}
          family={config.modo}
          values={values}
          label={label}
          {...(config.lambda === undefined ? {} : { lambda: config.lambda })}
        />
      );
    case 'atipicos-riq':
      return <IqrOutliersView title={title} values={values} label={label} k={config.k ?? 1.5} />;
    case 'atipicos-z':
      return <ZOutliersView title={title} base={values} extremes={config.extremos} label={label} />;
  }
}
