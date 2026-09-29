import type { VisualizationProps } from '../../types.ts';
import { DataSumView } from './DataSumView.tsx';
import { GeometricView } from './GeometricView.tsx';
import { NotationView } from './NotationView.tsx';
import type { SequenceSeriesConfig } from './schema.ts';
import { SequenceView } from './SequenceView.tsx';
import { SeriesView } from './SeriesView.tsx';
import { SupremumView } from './SupremumView.tsx';

/** Sequences, bounds of sets, series and summation notation. */
export default function SequenceSeries({ params, title }: VisualizationProps) {
  const config = params as unknown as SequenceSeriesConfig;
  switch (config.modo) {
    case 'sucesion':
      return (
        <SequenceView
          title={title}
          sequence={config.sucesion}
          sequences={config.sucesiones ?? [config.sucesion]}
          epsilon={config.epsilon ?? 0.1}
          terms={config.terminos ?? 60}
        />
      );
    case 'supremo':
      return (
        <SupremumView
          title={title}
          set={config.conjunto}
          sets={config.conjuntos ?? [config.conjunto]}
          epsilon={config.epsilon ?? 0.05}
        />
      );
    case 'serie':
      return (
        <SeriesView
          title={title}
          series={config.serie}
          options={config.series ?? [config.serie]}
          terms={config.terminos ?? 80}
        />
      );
    case 'geometrica':
      return (
        <GeometricView title={title} ratio={config.razon ?? 0.5} first={config.primero ?? 1} />
      );
    case 'sumatoria':
      return (
        <NotationView
          title={title}
          expression={config.expresion}
          expressions={config.expresiones ?? [config.expresion]}
          n={config.n ?? 6}
        />
      );
    case 'datos':
      return <DataSumView title={title} values={config.valores} name={config.nombre ?? 'Datos'} />;
  }
}
