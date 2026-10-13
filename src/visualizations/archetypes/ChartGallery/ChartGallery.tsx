import { defaultSeed } from '../../core/defaultSeed.ts';
import type { VisualizationProps } from '../../types.ts';
import { BarsPieView } from './BarsPieView.tsx';
import { BoxGroupsView } from './BoxGroupsView.tsx';
import { DensityView } from './DensityView.tsx';
import { EcdfView } from './EcdfView.tsx';
import { HeatmapView } from './HeatmapView.tsx';
import { HistogramView } from './HistogramView.tsx';
import { InkView } from './InkView.tsx';
import { LinesView } from './LinesView.tsx';
import { MisleadingView } from './MisleadingView.tsx';
import { MosaicView } from './MosaicView.tsx';
import { ParallelView } from './ParallelView.tsx';
import { PerceptionView } from './PerceptionView.tsx';
import { ProbabilityPlotView } from './ProbabilityPlotView.tsx';
import { RidgelineView } from './RidgelineView.tsx';
import { axisLabel, resolvePairs, resolveSample } from './samples.ts';
import { ScatterView } from './ScatterView.tsx';
import type { ChartGalleryConfig } from './schema.ts';
import { SplomView } from './SplomView.tsx';
import { StemLeafView } from './StemLeafView.tsx';
import { SwarmView } from './SwarmView.tsx';

/** Kinds of charts for one or several variables, with the choices that change how they read. */
export default function ChartGallery({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as ChartGalleryConfig;
  const seed = defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined);
  const samples = (groups: Parameters<typeof resolveSample>[0][]) =>
    groups.map((g, i) => ({ name: g.nombre, values: resolveSample(g, seed, i) }));
  switch (config.grafico) {
    case 'histograma':
      return (
        <HistogramView
          title={title}
          values={resolveSample(config.muestra, seed)}
          label={axisLabel(config.eje)}
          {...(config.intervalos === undefined ? {} : { bins: config.intervalos })}
          rules={config.reglas ?? false}
        />
      );
    case 'cajas':
      return (
        <BoxGroupsView
          title={title}
          groups={samples(config.grupos)}
          label={axisLabel(config.eje)}
          violin={config.violin ?? false}
          points={config.puntos ?? false}
        />
      );
    case 'tallo':
      return (
        <StemLeafView
          title={title}
          values={config.valores}
          label={axisLabel(config.eje)}
          leafUnit={config.hoja ?? 1}
        />
      );
    case 'densidad':
      return (
        <DensityView
          title={title}
          values={resolveSample(config.muestra, seed)}
          label={axisLabel(config.eje)}
          kernel={config.nucleo ?? 'gaussian'}
          {...(config.ancho === undefined ? {} : { bandwidth: config.ancho })}
        />
      );
    case 'ecdf':
      return (
        <EcdfView title={title} groups={samples(config.grupos)} label={axisLabel(config.eje)} />
      );
    case 'probabilidad':
      return (
        <ProbabilityPlotView
          title={title}
          kind={config.tipo}
          values={resolveSample(config.muestra, seed)}
          label={axisLabel(config.eje)}
        />
      );
    case 'dispersion':
      return (
        <ScatterView
          title={title}
          points={
            config.puntos
              ? config.puntos.map(([x, y]) => [x, y] as [number, number])
              : config.generador
                ? resolvePairs(config.generador, seed)
                : []
          }
          xLabel={axisLabel(config.ejes.x)}
          yLabel={axisLabel(config.ejes.y)}
          mode={config.vista ?? 'puntos'}
          {...(config.generador?.redondeo === undefined
            ? {}
            : { rounding: config.generador.redondeo })}
          {...(config.radio === undefined ? {} : { radius: config.radio })}
        />
      );
    case 'matriz-dispersion':
      return (
        <SplomView
          title={title}
          variables={config.variables}
          {...(config.grupos ? { groups: config.grupos } : {})}
          {...(config.nombresGrupos ? { groupNames: config.nombresGrupos } : {})}
        />
      );
    case 'calor':
      return (
        <HeatmapView
          title={title}
          rows={config.filas}
          columns={config.columnas}
          values={config.valores}
          palette={config.paleta}
          {...(config.centro === undefined ? {} : { center: config.centro })}
          variable={config.variable}
          comparePalettes={config.compararPaletas ?? false}
        />
      );
    case 'barras':
      return (
        <BarsPieView
          title={title}
          categories={config.categorias}
          values={config.valores}
          variable={config.variable}
          view={config.vista}
          sort={config.ordenar ?? false}
          horizontal={config.horizontal ?? false}
        />
      );
    case 'lineas':
      return (
        <LinesView
          title={title}
          periods={config.periodos}
          series={config.series}
          variable={config.variable}
          scale={config.escala ?? 'lineal'}
          pointsOnly={config.soloPuntos ?? false}
        />
      );
    case 'paralelas':
      return <ParallelView title={title} variables={config.variables} rows={config.filas} />;
    case 'mosaico':
      return (
        <MosaicView
          title={title}
          rows={config.filas}
          columns={config.columnas}
          counts={config.conteos}
        />
      );
    case 'enjambre':
      return (
        <SwarmView
          title={title}
          groups={samples(config.grupos)}
          label={axisLabel(config.eje)}
          mode={config.modo}
        />
      );
    case 'ridgeline':
      return (
        <RidgelineView
          title={title}
          groups={samples(config.grupos)}
          label={axisLabel(config.eje)}
          overlap={config.solapamiento ?? 1}
        />
      );
    case 'tinta':
      return (
        <InkView
          title={title}
          categories={config.categorias}
          values={config.valores}
          variable={config.variable}
        />
      );
    case 'enganoso':
      return (
        <MisleadingView
          title={title}
          trick={config.truco}
          labels={config.etiquetas}
          values={config.valores}
          variable={config.variable}
        />
      );
    case 'percepcion':
      return <PerceptionView title={title} a={config.a} b={config.b} />;
  }
}
