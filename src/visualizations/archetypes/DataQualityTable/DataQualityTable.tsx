import { useMemo } from 'react';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import type { VisualizationProps } from '../../types.ts';
import { type Column, homesColumns } from './columns.ts';
import { MechanismView } from './MechanismView.tsx';
import { MissingMatrixView } from './MissingMatrixView.tsx';
import { ProfileView } from './ProfileView.tsx';
import type { DataQualityConfig } from './schema.ts';

const DEFAULT_PREVIEW_ROWS = 8;
const DEFAULT_SURVEY = 300;

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
  switch (config.modo) {
    case 'perfilado':
      return (
        <ProfileView title={title} columns={columns} rows={config.filas ?? DEFAULT_PREVIEW_ROWS} />
      );
    case 'faltantes':
      return <MissingMatrixView title={title} columns={columns} order={config.orden ?? 'original'} />;
    case 'mecanismo':
      return (
        <MechanismView
          title={title}
          mechanism={config.mecanismo}
          n={config.n ?? DEFAULT_SURVEY}
          seed={seed}
        />
      );
  }
}
