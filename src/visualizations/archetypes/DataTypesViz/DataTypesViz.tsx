import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { ClassifyView } from './ClassifyView.tsx';
import { PanelView } from './PanelView.tsx';
import { PopulationView } from './PopulationView.tsx';
import { ScalesView } from './ScalesView.tsx';
import type { DataTypesVizConfig } from './schema.ts';
import { StructureView } from './StructureView.tsx';
import { TidyView } from './TidyView.tsx';
import { ValuesView } from './ValuesView.tsx';

/** Kinds of data: populations and samples, variable types, scales and table layouts. */
export default function DataTypesViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DataTypesVizConfig;
  switch (config.modo) {
    case 'poblacion':
      return (
        <PopulationView
          title={title}
          focus={config.enfoque}
          size={config.tamano}
          n={config.n}
          shape={config.forma}
          center={config.centro}
          {...(config.dispersion === undefined ? {} : { spread: config.dispersion })}
          statistic={config.estadistico}
          unit={config.unidad}
          variable={config.variable}
          {...(config.exito === undefined ? {} : { success: config.exito })}
          selection={config.seleccion ?? 'aleatoria'}
          decimals={config.decimales ?? 0}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'clasificar':
      return <ClassifyView title={title} axis={config.eje} examples={config.ejemplos} />;
    case 'valores':
      return (
        <ValuesView
          title={title}
          discrete={{
            name: config.discreta.nombre,
            unit: config.discreta.unidad,
            from: config.discreta.desde,
          }}
          continuous={{
            name: config.continua.nombre,
            unit: config.continua.unidad,
            from: config.continua.desde,
            value: config.continua.valor,
          }}
        />
      );
    case 'escalas':
      return <ScalesView title={title} variable={config.variable} />;
    case 'panel':
      return (
        <PanelView
          title={title}
          units={config.unidades}
          periods={config.periodos}
          variable={config.variable}
          values={config.valores}
          layout={config.vista ?? 'panel'}
          missing={config.faltantes ?? []}
        />
      );
    case 'estructura':
      return <StructureView title={title} caseId={config.caso} />;
    case 'ordenados':
      return <TidyView title={title} caseId={config.caso} />;
  }
}
