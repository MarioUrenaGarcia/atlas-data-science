import type { CleaningStep, FieldSchema } from '../../../lib/dataprep/quality.ts';
import type {
  DimensionCaseId,
  DuplicateCaseId,
  QualityDimension,
  SchemaCaseId,
  StandardizeCaseId,
} from './schema.ts';

export const DIMENSION_NAMES: Record<QualityDimension, string> = {
  completitud: 'Completitud',
  validez: 'Validez',
  exactitud: 'Exactitud',
  consistencia: 'Consistencia',
  unicidad: 'Unicidad',
  oportunidad: 'Oportunidad',
};

export const DIMENSION_QUESTIONS: Record<QualityDimension, string> = {
  completitud: '¿Están todos los valores que deberían estar?',
  validez: '¿Cumple cada valor el formato y el rango permitidos?',
  exactitud: '¿Coincide el valor con la realidad o con una fuente confiable?',
  consistencia: '¿Concuerdan entre sí los campos de un mismo registro?',
  unicidad: '¿Aparece cada entidad una sola vez?',
  oportunidad: '¿Está el dato actualizado para el uso que se le dará?',
};

/** Whether a dimension is scored over cells or over rows. */
export const DIMENSION_UNIT: Record<QualityDimension, 'celdas' | 'filas'> = {
  completitud: 'celdas',
  validez: 'celdas',
  exactitud: 'celdas',
  consistencia: 'filas',
  unicidad: 'filas',
  oportunidad: 'filas',
};

export interface QualityIssue {
  row: number;
  /** Column index, or -1 when the issue concerns the whole row. */
  column: number;
  dimension: QualityDimension;
  note: string;
}

export interface DimensionCase {
  name: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  issues: readonly QualityIssue[];
  /** Columns that may be checked for completeness, validity and accuracy. */
  checkedColumns: number;
}

export const DIMENSION_CASES: Record<DimensionCaseId, DimensionCase> = {
  clientes: {
    name: 'Registro de clientes de una aseguradora (corte: 30 de junio de 2025)',
    columns: ['ID', 'Nombre', 'Edad', 'Correo', 'Alta', 'Última compra', 'Actualizado'],
    checkedColumns: 7,
    rows: [
      ['C01', 'Ana Ruiz', '34', 'ana.ruiz@correo.mx', '2019-03-02', '2025-05-10', '2025-06-01'],
      ['C02', 'Luis Pérez', '230', 'luisp@correo.mx', '2020-07-15', '2025-04-22', '2025-05-30'],
      ['C03', 'Marta Gil', '41', '', '2018-11-20', '2025-06-12', '2025-06-14'],
      ['C04', 'Jorge Lara', '29', 'jorge.lara@correo', '2021-01-09', '2025-02-03', '2025-02-05'],
      ['C05', 'Sofía Díaz', '52', 'sofia.diaz@correo.mx', '2024-08-30', '2023-12-01', '2025-06-20'],
      ['C02', 'Luis Pérez', '23', 'luisp@correo.mx', '2020-07-15', '2025-04-22', '2025-05-30'],
      ['C06', 'Raúl Soto', '', 'raul.soto@correo.mx', '2017-05-14', '2025-06-25', '2025-06-26'],
      ['C07', 'Elena Cruz', '38', 'elena.cruz@correo.mx', '2016-02-28', '2021-09-17', '2021-09-18'],
      ['C08', 'Iván Mora', '45', 'ivan.mora@correo.mx', '2022-10-01', '2025-06-02', '2025-06-03'],
      ['C09', 'Paula Vega', '61', 'paula.vega@correo.mx', '2015-06-11', '2025-03-30', '2025-04-01'],
    ],
    issues: [
      { row: 2, column: 3, dimension: 'completitud', note: 'Correo vacío' },
      { row: 6, column: 2, dimension: 'completitud', note: 'Edad vacía' },
      { row: 1, column: 2, dimension: 'validez', note: 'Edad de 230 años fuera del rango 0 a 120' },
      { row: 3, column: 3, dimension: 'validez', note: 'Correo sin dominio completo' },
      {
        row: 5,
        column: 2,
        dimension: 'exactitud',
        note: 'Edad 23 válida, pero el registro civil indica 32: dígitos invertidos',
      },
      {
        row: 4,
        column: -1,
        dimension: 'consistencia',
        note: 'Última compra anterior a la fecha de alta',
      },
      { row: 5, column: -1, dimension: 'unicidad', note: 'ID C02 repetido' },
      { row: 7, column: -1, dimension: 'oportunidad', note: 'Sin actualizar desde 2021' },
    ],
  },
  sensores: {
    name: 'Lecturas horarias de estaciones de calidad del aire (corte: 1 de mayo de 2025, 12:00)',
    columns: ['Estación', 'Hora', 'PM2.5 (µg/m³)', 'Temp. (°C)', 'Humedad (%)', 'Recibido'],
    checkedColumns: 6,
    rows: [
      ['EST-01', '2025-05-01 10:00', '18', '22.4', '41', '2025-05-01 10:01'],
      ['EST-02', '2025-05-01 10:00', '-4', '23.0', '39', '2025-05-01 10:02'],
      ['EST-03', '2025-05-01 10:00', '25', '', '44', '2025-05-01 10:01'],
      ['EST-04', '2025-05-01 10:00', '31', '21.8', '135', '2025-05-01 10:03'],
      ['EST-05', '2025-05-01 10:00', '22', '22.1', '40', '2025-05-01 10:00'],
      ['EST-05', '2025-05-01 10:00', '22', '22.1', '40', '2025-05-01 10:00'],
      ['EST-06', '2025-05-01 10:00', '0', '0.0', '0', '2025-05-01 10:01'],
      ['EST-07', '2025-04-28 10:00', '27', '19.5', '52', '2025-04-28 10:02'],
      ['EST-08', '2025-05-01 10:00', '', '22.9', '38', '2025-05-01 10:04'],
    ],
    issues: [
      { row: 2, column: 3, dimension: 'completitud', note: 'Temperatura vacía' },
      { row: 8, column: 2, dimension: 'completitud', note: 'PM2.5 vacío' },
      { row: 1, column: 2, dimension: 'validez', note: 'Concentración negativa' },
      { row: 3, column: 4, dimension: 'validez', note: 'Humedad mayor que 100 %' },
      {
        row: 6,
        column: 2,
        dimension: 'exactitud',
        note: 'Ceros válidos, pero el sensor estaba apagado según la bitácora',
      },
      {
        row: 6,
        column: -1,
        dimension: 'consistencia',
        note: 'Temperatura 0 °C con humedad 0 %: combinación imposible en la ciudad',
      },
      { row: 5, column: -1, dimension: 'unicidad', note: 'Lectura de EST-05 enviada dos veces' },
      { row: 7, column: -1, dimension: 'oportunidad', note: 'Última lectura de hace 3 días' },
    ],
  },
};

export interface DuplicateRecord {
  name: string;
  phone: string;
  city: string;
  /** True entity, used to count correct and wrong merges. */
  entity: number;
}

export interface DuplicateCase {
  name: string;
  columns: [string, string, string];
  records: readonly DuplicateRecord[];
}

export const DUPLICATE_CASES: Record<DuplicateCaseId, DuplicateCase> = {
  clientes: {
    name: 'Clientes capturados en tres sucursales',
    columns: ['Nombre', 'Teléfono', 'Ciudad'],
    records: [
      { name: 'María González López', phone: '5512345678', city: 'Toluca', entity: 1 },
      { name: 'Maria Gonzalez Lopez', phone: '5512345678', city: 'Toluca', entity: 1 },
      { name: 'José Hernández', phone: '3311223344', city: 'Zapopan', entity: 2 },
      { name: 'Jose Hernandes', phone: '3311223344', city: 'Zapopan', entity: 2 },
      { name: 'Ana Torres', phone: '8187654321', city: 'Monterrey', entity: 3 },
      { name: 'Ana Torres', phone: '8187654321', city: 'Monterrey', entity: 3 },
      { name: 'Juan Pérez Ramos', phone: '2229876543', city: 'Puebla', entity: 4 },
      { name: 'Juana Pérez Ramos', phone: '2229876543', city: 'Puebla', entity: 5 },
      { name: 'Luis Martínez', phone: '6641112233', city: 'Tijuana', entity: 6 },
      { name: 'Carlos Ruiz', phone: '9994445566', city: 'Mérida', entity: 7 },
    ],
  },
  productos: {
    name: 'Catálogo de productos de dos proveedores',
    columns: ['Descripción', 'Código', 'Presentación'],
    records: [
      { name: 'Leche entera 1 L', phone: '750100', city: 'Caja', entity: 1 },
      { name: 'LECHE ENTERA 1L', phone: '750100', city: 'Caja', entity: 1 },
      { name: 'Leche deslactosada 1 L', phone: '750101', city: 'Caja', entity: 2 },
      { name: 'Arroz blanco 1 kg', phone: '750200', city: 'Bolsa', entity: 3 },
      { name: 'Arroz blanco 1 kg.', phone: '750200', city: 'Bolsa', entity: 3 },
      { name: 'Arroz integral 1 kg', phone: '750201', city: 'Bolsa', entity: 4 },
      { name: 'Frijol negro 900 g', phone: '750300', city: 'Bolsa', entity: 5 },
      { name: 'Frijol negro  900 g', phone: '750300', city: 'Bolsa', entity: 5 },
      { name: 'Aceite de maíz 1 L', phone: '750400', city: 'Botella', entity: 6 },
    ],
  },
};

export interface StandardizeCase {
  name: string;
  column: string;
  values: readonly string[];
  /** Variants that only a dictionary can map, keyed by their cleaned form. */
  dictionary: Readonly<Record<string, string>>;
}

export const CLEANING_STEPS: readonly CleaningStep[] = [
  'espacios',
  'minusculas',
  'acentos',
  'puntuacion',
];
export const STEP_NAMES: Record<CleaningStep | 'diccionario', string> = {
  espacios: 'Quitar espacios sobrantes',
  minusculas: 'Pasar a minúsculas',
  acentos: 'Quitar acentos',
  puntuacion: 'Quitar puntuación',
  diccionario: 'Aplicar diccionario de equivalencias',
};

export const STANDARDIZE_CASES: Record<StandardizeCaseId, StandardizeCase> = {
  ciudades: {
    name: 'Ciudad de residencia escrita a mano en un formulario',
    column: 'Ciudad',
    values: [
      'Ciudad de México',
      'ciudad de mexico',
      ' Ciudad de México ',
      'CIUDAD DE MÉXICO',
      'CDMX',
      'Cd. de México',
      'Guadalajara',
      'guadalajara',
      'Guadalajara.',
      'GDL',
      'Monterrey',
      'monterrey ',
      'Mty',
      'Ciudad de México',
      'Guadalajara',
      'Monterrey',
    ],
    dictionary: {
      cdmx: 'ciudad de mexico',
      'cd de mexico': 'ciudad de mexico',
      gdl: 'guadalajara',
      mty: 'monterrey',
    },
  },
  escolaridad: {
    name: 'Escolaridad declarada en una encuesta',
    column: 'Escolaridad',
    values: [
      'Licenciatura',
      'licenciatura',
      'Lic.',
      'LICENCIATURA ',
      'Preparatoria',
      'Bachillerato',
      'preparatoria',
      'Prepa',
      'Secundaria',
      'secundaria.',
      'Sec.',
      'Maestría',
      'maestria',
      'Posgrado (maestría)',
      'Licenciatura',
      'Secundaria',
    ],
    dictionary: {
      lic: 'licenciatura',
      bachillerato: 'preparatoria',
      prepa: 'preparatoria',
      sec: 'secundaria',
      'posgrado (maestria)': 'maestria',
    },
  },
};

export interface SchemaCase {
  name: string;
  fields: readonly FieldSchema[];
  rows: readonly (readonly string[])[];
}

export const SCHEMA_CASES: Record<SchemaCaseId, SchemaCase> = {
  pacientes: {
    name: 'Registro de pacientes de una clínica',
    fields: [
      {
        name: 'Expediente',
        rules: [
          { kind: 'requerido' },
          { kind: 'patron', pattern: '^EXP-\\d{4}$', description: 'formato EXP-0000' },
        ],
      },
      {
        name: 'Edad',
        rules: [{ kind: 'requerido' }, { kind: 'entero' }, { kind: 'rango', min: 0, max: 120 }],
      },
      { name: 'Sexo', rules: [{ kind: 'requerido' }, { kind: 'valores', allowed: ['F', 'M'] }] },
      { name: 'Peso (kg)', rules: [{ kind: 'rango', min: 1, max: 300 }] },
      {
        name: 'Fecha de consulta',
        rules: [
          { kind: 'requerido' },
          { kind: 'patron', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'fecha AAAA-MM-DD' },
        ],
      },
    ],
    rows: [
      ['EXP-1021', '45', 'F', '68.5', '2025-03-14'],
      ['EXP-1022', '7', 'M', '24', '2025-03-14'],
      ['EXP-103', '52', 'F', '71', '2025-03-15'],
      ['EXP-1024', '38.5', 'M', '80', '2025-03-15'],
      ['EXP-1025', '61', 'Femenino', '59', '2025-03-16'],
      ['EXP-1026', '29', 'M', '', '15/03/2025'],
      ['EXP-1027', '134', 'F', '62', '2025-03-17'],
      ['', '33', 'M', '0.75', '2025-03-17'],
    ],
  },
  pedidos: {
    name: 'Pedidos de una tienda en línea',
    fields: [
      {
        name: 'Pedido',
        rules: [
          { kind: 'requerido' },
          { kind: 'patron', pattern: '^P\\d{5}$', description: 'formato P00000' },
        ],
      },
      {
        name: 'Cantidad',
        rules: [{ kind: 'requerido' }, { kind: 'entero' }, { kind: 'rango', min: 1, max: 50 }],
      },
      {
        name: 'Precio unitario',
        rules: [{ kind: 'requerido' }, { kind: 'rango', min: 0.01, max: 50000 }],
      },
      {
        name: 'Estado',
        rules: [
          { kind: 'requerido' },
          { kind: 'valores', allowed: ['pagado', 'enviado', 'entregado', 'cancelado'] },
        ],
      },
      {
        name: 'Código postal',
        rules: [
          { kind: 'requerido' },
          { kind: 'patron', pattern: '^\\d{5}$', description: '5 dígitos' },
        ],
      },
    ],
    rows: [
      ['P10231', '2', '349.90', 'pagado', '06700'],
      ['P10232', '0', '120.00', 'enviado', '44100'],
      ['P10233', '1', '-15.00', 'pagado', '64000'],
      ['P10234', '3', '89.50', 'Enviado', '72000'],
      ['P1023', '1', '1200.00', 'entregado', '6700'],
      ['P10236', 'dos', '75.00', 'pagado', '97000'],
      ['P10237', '1', '510.00', 'devuelto', '22000'],
      ['P10238', '4', '33.10', 'entregado', '80000'],
    ],
  },
};
