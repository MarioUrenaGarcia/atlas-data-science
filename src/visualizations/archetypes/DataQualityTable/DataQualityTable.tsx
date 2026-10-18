import { useMemo } from 'react';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import type { VisualizationProps } from '../../types.ts';
import { type Column, homesColumns } from './columns.ts';
import { MechanismView } from './MechanismView.tsx';
import { MissingMatrixView } from './MissingMatrixView.tsx';
import { ProfileView } from './ProfileView.tsx';
import { DeletionView } from './DeletionView.tsx';
import { DimensionsView } from './DimensionsView.tsx';
import { DuplicatesView } from './DuplicatesView.tsx';
import { IndicatorView } from './IndicatorView.tsx';
import { KnnView } from './KnnView.tsx';
import { MiceView } from './MiceView.tsx';
import { OutlierView } from './OutlierView.tsx';
import { RubinView } from './RubinView.tsx';
import { SchemaView } from './SchemaView.tsx';
import { SimpleImputationView } from './SimpleImputationView.tsx';
import { StandardizeView } from './StandardizeView.tsx';
import { WinsorView } from './WinsorView.tsx';
import { MissingMechanismView } from './MissingMechanismView.tsx';
import type { DataQualityConfig } from './schema.ts';

const DEFAULT_PREVIEW_ROWS = 8;
const DEFAULT_SURVEY = 300;
const DEFAULT_N = 120;
const DEFAULT_RATE = 0.3;
const DEFAULT_STRENGTH = 1.5;

/** Data tables seen through their quality: profiles, missing-value maps and missing mechanisms. */
export default function DataQualityTable({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DataQualityConfig;
  const seed = useSeed(defaultSeed(conceptId, 'semilla' in config ? config.semilla : undefined));
  const custom = 'columnas' in config ? config.columnas : undefined;
  const columns = useMemo<Column[]>(
    () =>
      custom ? custom.map((c) => ({ nombre: c.nombre, valores: [...c.valores] })) : homesColumns(),
    [custom],
  );
  const missing = (c: {
    mecanismo?: 'MCAR' | 'MAR' | 'MNAR';
    tasa?: number;
    fuerza?: number;
    n?: number;
    semilla?: number;
  }) => ({
    mechanism: c.mecanismo ?? 'MAR',
    rate: c.tasa ?? DEFAULT_RATE,
    strength: c.fuerza ?? DEFAULT_STRENGTH,
    n: c.n ?? DEFAULT_N,
    seed: defaultSeed(conceptId, c.semilla),
  });
  switch (config.modo) {
    case 'perfilado':
      return (
        <ProfileView title={title} columns={columns} rows={config.filas ?? DEFAULT_PREVIEW_ROWS} />
      );
    case 'faltantes':
      return (
        <MissingMatrixView title={title} columns={columns} order={config.orden ?? 'original'} />
      );
    case 'mecanismo':
      return (
        <MechanismView
          title={title}
          mechanism={config.mecanismo}
          n={config.n ?? DEFAULT_SURVEY}
          seed={seed}
        />
      );
    case 'dimensiones':
      return (
        <DimensionsView
          title={title}
          caseId={config.caso}
          {...(config.enfoque ? { focus: config.enfoque } : {})}
        />
      );
    case 'duplicados':
      return (
        <DuplicatesView
          title={title}
          caseId={config.caso}
          threshold={config.umbral ?? 0.85}
          normalize={config.normalizar ?? false}
        />
      );
    case 'estandarizacion':
      return <StandardizeView title={title} caseId={config.caso} steps={config.pasos ?? 5} />;
    case 'esquema':
      return (
        <SchemaView title={title} caseId={config.caso} typesOnly={config.soloTipos ?? false} />
      );
    case 'mecanismos':
      return (
        <MissingMechanismView title={title} {...missing(config)} hidden={config.ocultos ?? true} />
      );
    case 'eliminacion':
      return (
        <DeletionView
          title={title}
          method={config.metodo}
          rate={config.tasa ?? 0.1}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'imputacion':
      return <SimpleImputationView title={title} method={config.metodo} {...missing(config)} />;
    case 'knn':
      return <KnnView title={title} k={config.k ?? 5} {...missing(config)} />;
    case 'mice':
      return (
        <MiceView
          title={title}
          m={config.m ?? 5}
          iterations={config.iteraciones ?? 10}
          {...missing(config)}
        />
      );
    case 'rubin':
      return <RubinView title={title} m={config.m ?? 5} {...missing(config)} />;
    case 'indicador':
      return (
        <IndicatorView
          title={title}
          rate={config.tasa ?? 0.25}
          effect={config.efecto ?? 0.25}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
    case 'atipicos':
      return <OutlierView title={title} caseId={config.caso} rule={config.regla ?? 'iqr'} />;
    case 'winsorizacion':
      return (
        <WinsorView
          title={title}
          p={config.p ?? 0.05}
          seed={defaultSeed(conceptId, config.semilla)}
        />
      );
  }
}
