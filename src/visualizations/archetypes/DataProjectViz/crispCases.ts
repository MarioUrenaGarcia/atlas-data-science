import type { CrispCaseId } from './schema.ts';

export const PHASES = [
  'negocio',
  'datos',
  'preparacion',
  'modelado',
  'evaluacion',
  'despliegue',
] as const;
export type Phase = (typeof PHASES)[number];

export const PHASE_NAMES: Record<Phase, string> = {
  negocio: 'Comprensión del negocio',
  datos: 'Comprensión de los datos',
  preparacion: 'Preparación de los datos',
  modelado: 'Modelado',
  evaluacion: 'Evaluación',
  despliegue: 'Despliegue',
};

/** Generic tasks of each phase in the CRISP-DM reference model. */
export const PHASE_TASKS: Record<Phase, readonly string[]> = {
  negocio: [
    'Determinar los objetivos del negocio',
    'Evaluar la situación: recursos, riesgos y restricciones',
    'Traducir el objetivo a metas analíticas',
    'Elaborar el plan del proyecto',
  ],
  datos: [
    'Recolectar los datos iniciales',
    'Describir los datos',
    'Explorar los datos',
    'Verificar la calidad de los datos',
  ],
  preparacion: [
    'Seleccionar registros y variables',
    'Limpiar los datos',
    'Construir variables nuevas',
    'Integrar fuentes',
    'Dar formato para el modelo',
  ],
  modelado: [
    'Seleccionar la técnica de modelado',
    'Diseñar la prueba del modelo',
    'Construir el modelo',
    'Evaluar el modelo en términos técnicos',
  ],
  evaluacion: [
    'Evaluar los resultados contra el objetivo del negocio',
    'Revisar el proceso completo',
    'Decidir los siguientes pasos',
  ],
  despliegue: [
    'Planear el despliegue',
    'Planear el monitoreo y el mantenimiento',
    'Elaborar el informe final',
    'Revisar el proyecto',
  ],
};

/**
 * Transitions drawn in the reference diagram: the main cycle plus the
 * returns business-data, modeling-preparation and evaluation-business.
 */
export const RETURN_EDGES: readonly [Phase, Phase][] = [
  ['datos', 'negocio'],
  ['modelado', 'preparacion'],
  ['evaluacion', 'negocio'],
];

export interface CrispStep {
  phase: Phase;
  activity: string;
  artifact: string;
  weeks: number;
}

export interface CrispCase {
  name: string;
  goal: string;
  steps: readonly CrispStep[];
}

export const CRISP_CASES: Record<CrispCaseId, CrispCase> = {
  abandono: {
    name: 'Abandono de clientes de telefonía de prepago',
    goal: 'Reducir 1 % la cancelación trimestral con una campaña de retención.',
    steps: [
      {
        phase: 'negocio',
        activity:
          'El área comercial pide anticipar qué clientes cancelarán el siguiente trimestre.',
        artifact: 'Objetivo y criterio de éxito: 1 % menos cancelaciones',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity:
          'Se exploran 18 meses de recargas y llamadas a soporte. No existe un campo de cancelación.',
        artifact: 'Informe de exploración',
        weeks: 2,
      },
      {
        phase: 'negocio',
        activity: 'Se acuerda que un cliente abandonó si pasa 60 días sin recargar.',
        artifact: 'Definición operativa de abandono',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity: 'Con esa definición, la tasa de abandono trimestral es 7. %.',
        artifact: 'Etiqueta calculada y verificada',
        weeks: 1,
      },
      {
        phase: 'preparacion',
        activity:
          'Se unen recargas, quejas y plan; se crean variables de uso de los últimos 90 días.',
        artifact: 'Tabla de modelado, una fila por cliente',
        weeks: 3,
      },
      {
        phase: 'modelado',
        activity: 'Una regresión logística muestra que falta la antigüedad del cliente.',
        artifact: 'Primer modelo y diagnóstico',
        weeks: 2,
      },
      {
        phase: 'preparacion',
        activity: 'Se agregan antigüedad en meses y número de quejas del último trimestre.',
        artifact: 'Tabla de modelado ampliada',
        weeks: 1,
      },
      {
        phase: 'modelado',
        activity: 'El modelo reentrenado detecta 7 % de los abandonos marcando a 2 % de clientes.',
        artifact: 'Modelo candidato',
        weeks: 1,
      },
      {
        phase: 'evaluacion',
        activity:
          'Con un trimestre posterior se estima que la campaña evitaría 1 % de cancelaciones.',
        artifact: 'Evaluación contra el criterio de éxito',
        weeks: 2,
      },
      {
        phase: 'despliegue',
        activity: 'El puntaje se calcula cada semana y alimenta el sistema de campañas.',
        artifact: 'Proceso en producción con monitoreo mensual',
        weeks: 2,
      },
    ],
  },
  inventario: {
    name: 'Pronóstico de demanda en una cadena de farmacias',
    goal: 'Reducir los faltantes sin aumentar más de  % el inventario.',
    steps: [
      {
        phase: 'negocio',
        activity: 'Compras quiere pedir mejor: hoy hay faltantes en  % de los días.',
        artifact: 'Objetivo: faltantes por debajo de  %',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity: 'Ventas diarias por sucursal y producto de 3 años, con huecos por cierres.',
        artifact: 'Inventario de fuentes y huecos',
        weeks: 2,
      },
      {
        phase: 'preparacion',
        activity: 'Se agregan las ventas por semana, se marcan cierres y semanas de promoción.',
        artifact: 'Serie semanal por producto',
        weeks: 2,
      },
      {
        phase: 'modelado',
        activity: 'Se ajusta un pronóstico con tendencia y estacionalidad por producto.',
        artifact: 'Pronósticos a 4 semanas',
        weeks: 2,
      },
      {
        phase: 'evaluacion',
        activity: 'El error medio es 1 %, pero en productos de temporada llega a 4 %.',
        artifact: 'Criterio no cumplido en productos de temporada',
        weeks: 1,
      },
      {
        phase: 'negocio',
        activity: 'Se acuerda planear aparte los antigripales y bloqueadores solares.',
        artifact: 'Alcance redefinido',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity: 'Se identifican 120 productos de temporada y su calendario.',
        artifact: 'Catálogo de productos de temporada',
        weeks: 1,
      },
      {
        phase: 'preparacion',
        activity: 'Se separan las series y se agregan variables de semana del año.',
        artifact: 'Dos tablas de modelado',
        weeks: 1,
      },
      {
        phase: 'modelado',
        activity: 'Se ajusta un modelo por grupo de productos.',
        artifact: 'Pronósticos por grupo',
        weeks: 2,
      },
      {
        phase: 'evaluacion',
        activity: 'Simulando 12 semanas de pedidos, los faltantes bajan a 2. %.',
        artifact: 'Criterio de éxito cumplido',
        weeks: 1,
      },
      {
        phase: 'despliegue',
        activity: 'El sistema propone el pedido semanal y el comprador lo ajusta.',
        artifact: 'Pedido sugerido en producción',
        weeks: 2,
      },
    ],
  },
  mantenimiento: {
    name: 'Mantenimiento predictivo de bombas en una planta de agua',
    goal: 'Anticipar fallas con al menos 7 días para programar reparaciones.',
    steps: [
      {
        phase: 'negocio',
        activity: 'Las fallas no programadas detienen el bombeo 30 horas en promedio.',
        artifact: 'Objetivo: avisar 7 días antes de una falla',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity: 'Sensores de vibración cada minuto y una bitácora de fallas en texto libre.',
        artifact: 'Descripción de fuentes',
        weeks: 2,
      },
      {
        phase: 'preparacion',
        activity:
          'Se extraen las fechas de falla de la bitácora y se resumen los sensores por día.',
        artifact: 'Tabla diaria por bomba con la etiqueta "falla en 7 días"',
        weeks: 3,
      },
      {
        phase: 'modelado',
        activity: 'Un clasificador detecta 8 % de las fallas.',
        artifact: 'Modelo candidato',
        weeks: 2,
      },
      {
        phase: 'evaluacion',
        activity: 'Genera 9 alarmas por semana; el equipo solo puede revisar 2.',
        artifact: 'Criterio operativo no cumplido',
        weeks: 1,
      },
      {
        phase: 'negocio',
        activity: 'Se fija la restricción: como máximo 2 alarmas por semana.',
        artifact: 'Restricción de capacidad',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity: 'Se revisa cuántas fallas hubo por bomba: 4 bombas concentran la mitad.',
        artifact: 'Perfil de fallas por bomba',
        weeks: 1,
      },
      {
        phase: 'preparacion',
        activity: 'Se agregan horas de operación desde la última reparación.',
        artifact: 'Tabla ampliada',
        weeks: 1,
      },
      {
        phase: 'modelado',
        activity: 'Con el umbral elegido para 2 alarmas semanales se detecta 5 % de las fallas.',
        artifact: 'Modelo y umbral',
        weeks: 1,
      },
      {
        phase: 'evaluacion',
        activity: 'Las horas de paro estimadas bajan 3 %.',
        artifact: 'Beneficio estimado',
        weeks: 1,
      },
      {
        phase: 'despliegue',
        activity: 'Cada lunes se envía la lista de bombas a revisar.',
        artifact: 'Alarma semanal en producción',
        weeks: 1,
      },
    ],
  },
  readmision: {
    name: 'Readmisión hospitalaria a 30 días',
    goal: 'Dar seguimiento telefónico a los pacientes con mayor riesgo de volver.',
    steps: [
      {
        phase: 'negocio',
        activity: 'El hospital puede llamar a 50 pacientes por semana después del alta.',
        artifact: 'Objetivo y capacidad de seguimiento',
        weeks: 1,
      },
      {
        phase: 'datos',
        activity:
          'Expedientes de 4 años: diagnósticos, estancia, laboratorios y consultas previas.',
        artifact: 'Diccionario de datos',
        weeks: 2,
      },
      {
        phase: 'preparacion',
        activity: 'Se usan solo datos disponibles al momento del alta para evitar fugas.',
        artifact: 'Tabla por egreso',
        weeks: 3,
      },
      {
        phase: 'modelado',
        activity: 'Se comparan dos modelos; el más simple pierde poco y es explicable.',
        artifact: 'Modelo elegido',
        weeks: 2,
      },
      {
        phase: 'evaluacion',
        activity:
          'Los 50 pacientes de mayor riesgo concentran 3 veces más readmisiones que el promedio.',
        artifact: 'Evaluación con capacidad real',
        weeks: 1,
      },
      {
        phase: 'despliegue',
        activity: 'La lista semanal se entrega al equipo de enfermería.',
        artifact: 'Lista de seguimiento en producción',
        weeks: 1,
      },
      {
        phase: 'negocio',
        activity: 'Tras 6 meses se revisa el efecto de las llamadas y se inicia un nuevo ciclo.',
        artifact: 'Revisión y nuevo objetivo',
        weeks: 1,
      },
    ],
  },
};
