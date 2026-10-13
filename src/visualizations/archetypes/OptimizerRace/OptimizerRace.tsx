import type { VisualizationProps } from '../../types.ts';
import { ConstrainedView } from './ConstrainedView.tsx';
import { ConvexSetView } from './ConvexSetView.tsx';
import { DualityView } from './DualityView.tsx';
import { LinearProgramView } from './LinearProgramView.tsx';
import { LineSearchView } from './LineSearchView.tsx';
import { ParetoView } from './ParetoView.tsx';
import { PopulationView } from './PopulationView.tsx';
import { ProximalView } from './ProximalView.tsx';
import { RaceView } from './RaceView.tsx';
import { RateView } from './RateView.tsx';
import type { OptimizerRaceConfig } from './schema.ts';
import { StartsView } from './StartsView.tsx';
import { StochasticView } from './StochasticView.tsx';

const DEFAULT_SEED = 7;
const DEFAULT_RATE = 0.1;
const DEFAULT_ALPHA = 1;
const DEFAULT_C1 = 0.3;
const DEFAULT_RHO = 0.5;

/** Optimization algorithms on test functions, linear programs, duality and multiobjective problems. */
export default function OptimizerRace({ params, title }: VisualizationProps) {
  const config = params as unknown as OptimizerRaceConfig;
  switch (config.modo) {
    case 'carrera':
      return <RaceView title={title} ids={config.funciones} methods={config.metodos} start={config.inicio} rate={config.tasa ?? DEFAULT_RATE} />;
    case 'tasa':
      return <RateView title={title} ids={config.funciones} rates={config.tasas} start={config.inicio} />;
    case 'busqueda-lineal':
      return <LineSearchView title={title} ids={config.funciones} start={config.inicio} alpha0={config.alfa0 ?? DEFAULT_ALPHA} c1={config.c1 ?? DEFAULT_C1} rho={config.rho ?? DEFAULT_RHO} />;
    case 'inicios':
      return <StartsView title={title} ids={config.funciones} />;
    case 'poblacion':
      return (
        <PopulationView
          title={title}
          ids={config.funciones}
          method={config.metodo}
          start={config.inicio ?? [0, 0]}
          seed={config.semilla ?? DEFAULT_SEED}
          options={{ triangle: config.triangulo, cooling: config.enfriamiento, mutation: config.mutacion, inertia: config.inercia }}
        />
      );
    case 'lineal':
      return (
        <LinearProgramView
          title={title}
          lp={{ c: config.c, a: config.a, b: config.b }}
          method={config.metodo}
          variables={config.variables ?? ['x', 'y']}
        />
      );
    case 'dualidad':
      return <DualityView title={title} target={config.objetivo} normal={config.normal} bound={config.cota} />;
    case 'proximal':
      return <ProximalView title={title} matrix={config.matriz} center={config.centro} lambda={config.lambda} start={config.inicio} />;
    case 'estocastico':
      return <StochasticView title={title} batch={config.lote} rate={config.tasa} seed={config.semilla ?? DEFAULT_SEED} />;
    case 'pareto':
      return <ParetoView title={title} seed={config.semilla ?? DEFAULT_SEED} weight={config.peso} />;
    case 'convexo':
      return <ConvexSetView title={title} sets={config.conjuntos} seed={config.semilla ?? DEFAULT_SEED} />;
    case 'restricciones':
      return (
        <ConstrainedView
          title={title}
          ids={config.funciones}
          planes={config.restricciones.map((r) => ({ a: r.a, c: r.c, label: r.etiqueta }))}
          start={config.inicio}
          rate={config.tasa}
        />
      );
  }
}
