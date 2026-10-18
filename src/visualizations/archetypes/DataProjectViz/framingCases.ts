import type { FramingCaseId } from './schema.ts';

export const FRAMING_FIELDS = [
  'decision',
  'responsable',
  'unidad',
  'objetivo',
  'horizonte',
  'metrica',
  'restricciones',
  'datos',
] as const;
export type FramingField = (typeof FRAMING_FIELDS)[number];

export const FIELD_NAMES: Record<FramingField, string> = {
  decision: 'Decisión que se apoya',
  responsable: 'Quién decide',
  unidad: 'Unidad de análisis',
  objetivo: 'Variable objetivo',
  horizonte: 'Momento y horizonte',
  metrica: 'Métrica de éxito y línea base',
  restricciones: 'Restricciones',
  datos: 'Datos disponibles al decidir',
};

export interface FramingEntry {
  good: string;
  /** What the deficient framing says (or omits) for the same field. */
  bad: string;
}

/** Time windows in days relative to the moment the prediction is made. */
export interface FramingWindows {
  observation: number;
  gap: number;
  outcome: number;
  /** Labels for the three windows. */
  labels: [string, string, string];
}

export interface FramingCase {
  request: string;
  statement: string;
  fields: Record<FramingField, FramingEntry>;
  windows: FramingWindows;
}

export const FRAMING_CASES: Record<FramingCaseId, FramingCase> = {
  abandono: {
    request: '"Queremos usar inteligencia de datos para que los clientes no se vayan."',
    statement:
      'Cada lunes, ordenar a los clientes de prepago por su probabilidad de pasar 60 días sin recargar en los próximos 90 días, para que el centro de llamadas ofrezca retención a los 2000 primeros; éxito: 1 % menos cancelaciones que el grupo de control.',
    fields: {
      decision: {
        good: 'A qué clientes llamar con una oferta de retención cada semana.',
        bad: 'No se dice qué se hará con el resultado.',
      },
      responsable: {
        good: 'Gerencia de retención, con el centro de llamadas.',
        bad: '"El área comercial", sin un responsable concreto.',
      },
      unidad: {
        good: 'Línea de prepago activa al inicio de la semana.',
        bad: 'Cliente, sin aclarar si es la persona o cada línea.',
      },
      objetivo: {
        good: 'Pasar 60 días seguidos sin recarga.',
        bad: '"Que se vaya", sin definición medible.',
      },
      horizonte: {
        good: 'Predicción el lunes; abandono en los 90 días siguientes.',
        bad: 'Sin fecha de corte ni horizonte.',
      },
      metrica: {
        good: 'Cancelaciones evitadas frente a un grupo de control; hoy 7. % trimestral.',
        bad: '"Que el modelo sea preciso."',
      },
      restricciones: {
        good: '2000 llamadas por semana y una oferta de 50 pesos.',
        bad: 'Sin capacidad ni presupuesto.',
      },
      datos: {
        good: 'Recargas, quejas y antigüedad hasta el domingo anterior.',
        bad: 'Todos los datos del cliente, incluidos los posteriores al abandono.',
      },
    },
    windows: {
      observation: 90,
      gap: 0,
      outcome: 90,
      labels: ['Historial de 90 días', 'Lunes de la predicción', 'Ventana de abandono'],
    },
  },
  inventario: {
    request: '"Necesitamos un modelo de ventas para las farmacias."',
    statement:
      'Cada jueves, pronosticar la venta de la semana siguiente por sucursal y producto para fijar el pedido; éxito: faltantes por debajo de  % sin subir más de  % el inventario promedio.',
    fields: {
      decision: {
        good: 'Cuántas piezas pedir de cada producto para cada sucursal.',
        bad: '"Entender las ventas."',
      },
      responsable: {
        good: 'Compradores regionales.',
        bad: 'Sin usuario identificado.',
      },
      unidad: {
        good: 'Producto por sucursal por semana.',
        bad: 'Ventas totales de la cadena por mes.',
      },
      objetivo: {
        good: 'Piezas vendidas en la semana siguiente.',
        bad: 'Ventas en pesos, que mezclan precio y cantidad.',
      },
      horizonte: {
        good: 'Pronóstico el jueves para la semana que inicia 4 días después.',
        bad: 'Sin horizonte: un pronóstico del mismo día no sirve para pedir.',
      },
      metrica: {
        good: 'Días con faltante e inventario promedio; hoy  % de días con faltante.',
        bad: 'Error del pronóstico sin relación con faltantes.',
      },
      restricciones: {
        good: 'Proveedor entrega solo los lunes; espacio de almacén limitado.',
        bad: 'No se mencionan.',
      },
      datos: {
        good: 'Ventas hasta el miércoles y calendario de promociones ya aprobadas.',
        bad: 'Ventas de la propia semana a pronosticar.',
      },
    },
    windows: {
      observation: 365,
      gap: 4,
      outcome: 7,
      labels: ['Un año de ventas', 'Jueves del pedido', 'Semana pronosticada'],
    },
  },
  becas: {
    request: '"Queremos saber qué estudiantes van a desertar."',
    statement:
      'Al cierre de la semana 6 de cada semestre, estimar para cada estudiante de primer ingreso la probabilidad de no inscribirse al semestre siguiente, para asignar 300 tutorías; éxito: reducir la deserción de primer año de 1 % a 1 %.',
    fields: {
      decision: {
        good: 'A quién asignar una de las 300 tutorías disponibles.',
        bad: 'Publicar un reporte de deserción.',
      },
      responsable: {
        good: 'Coordinación de tutorías.',
        bad: 'Rectoría en general.',
      },
      unidad: {
        good: 'Estudiante de primer ingreso en un semestre.',
        bad: 'Grupo o carrera completa.',
      },
      objetivo: {
        good: 'No inscribirse al semestre siguiente.',
        bad: '"Desertar", que incluye cambios de carrera y bajas temporales.',
      },
      horizonte: {
        good: 'Predicción en la semana 6; resultado al inicio del semestre siguiente.',
        bad: 'Predicción al final del semestre, cuando ya no hay tiempo para la tutoría.',
      },
      metrica: {
        good: 'Deserción de primer año; hoy 1 %.',
        bad: 'Exactitud del modelo.',
      },
      restricciones: {
        good: '300 tutorías; no usar datos socioeconómicos sin consentimiento.',
        bad: 'No se mencionan.',
      },
      datos: {
        good: 'Asistencia y calificaciones parciales hasta la semana 6.',
        bad: 'Calificaciones finales del semestre.',
      },
    },
    windows: {
      observation: 42,
      gap: 90,
      outcome: 14,
      labels: ['Semanas 1 a 6', 'Semana 6', 'Inscripción siguiente'],
    },
  },
  mantenimiento: {
    request: '"Que el sistema avise antes de que fallen las bombas."',
    statement:
      'Cada lunes, ordenar las bombas por probabilidad de falla en los próximos 7 días para revisar las 2 primeras; éxito: 3 % menos horas de paro no programado que el año anterior.',
    fields: {
      decision: {
        good: 'Qué 2 bombas revisar cada semana.',
        bad: 'Encender una alarma, sin decir quién la atiende.',
      },
      responsable: {
        good: 'Jefe de mantenimiento de la planta.',
        bad: 'El sistema de monitoreo.',
      },
      unidad: {
        good: 'Bomba por semana.',
        bad: 'Lectura de sensor por minuto.',
      },
      objetivo: {
        good: 'Falla registrada en bitácora en los 7 días siguientes.',
        bad: '"Comportamiento anormal" sin definición.',
      },
      horizonte: {
        good: 'Predicción el lunes; falla durante esa semana.',
        bad: 'Detección en el momento de la falla.',
      },
      metrica: {
        good: 'Horas de paro no programado; el año anterior 1240 horas.',
        bad: 'Área bajo la curva ROC.',
      },
      restricciones: {
        good: 'Dos revisiones por semana; refacciones con 3 días de entrega.',
        bad: 'Capacidad ilimitada de revisión.',
      },
      datos: {
        good: 'Vibración, temperatura y horas de operación hasta el domingo.',
        bad: 'Notas del técnico escritas después de la reparación.',
      },
    },
    windows: {
      observation: 30,
      gap: 0,
      outcome: 7,
      labels: ['30 días de sensores', 'Lunes de la revisión', 'Semana de riesgo'],
    },
  },
};
