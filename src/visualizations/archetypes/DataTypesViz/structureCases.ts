/** The same information stored as a table, as tagged records and as free text. */

export interface StructureField {
  column: string;
  value: string;
  /** Exact fragment of the tagged record that holds the value, or null if absent. */
  json: string | null;
  /** Exact fragment of the free text that expresses the value, or null if absent. */
  text: string | null;
}

export interface StructureCase {
  name: string;
  fields: StructureField[];
  jsonLines: string[];
  text: string;
  textKind: string;
}

export type StructureCaseId = 'resenas' | 'sensores' | 'pedidos';

export const STRUCTURE_CASES: Record<StructureCaseId, StructureCase> = {
  resenas: {
    name: 'Reseña de un producto',
    fields: [
      { column: 'producto', value: 'Audífonos X2', json: '"Audífonos X2"', text: 'audífonos X2' },
      { column: 'calificación', value: '4', json: '"calificacion": 4', text: 'cuatro estrellas' },
      { column: 'mes', value: '3', json: '"2024-03-18"', text: 'en marzo' },
      {
        column: 'aspecto positivo',
        value: 'batería',
        json: '"bateria"',
        text: 'la batería dura todo el día',
      },
      { column: 'recomienda', value: 'sí', json: null, text: 'sí los recomendaría' },
    ],
    jsonLines: [
      '{',
      '  "producto": "Audífonos X2",',
      '  "calificacion": 4,',
      '  "fecha": "2024-03-18",',
      '  "autor": { "ciudad": "Puebla" },',
      '  "etiquetas": ["sonido", "bateria"]',
      '}',
    ],
    text:
      'Compré los audífonos X2 en marzo. El sonido es muy bueno y la batería dura todo el día, ' +
      'aunque la diadema aprieta un poco. Les daría cuatro estrellas y sí los recomendaría.',
    textKind: 'Texto libre de la reseña',
  },
  sensores: {
    name: 'Lectura de una estación meteorológica',
    fields: [
      { column: 'estación', value: 'E-14', json: '"E-14"', text: 'estación E-14' },
      { column: 'temperatura (°C)', value: '27.5', json: '"temp_c": 27.5', text: '27.5 grados' },
      {
        column: 'humedad (%)',
        value: '64',
        json: '"humedad": 64',
        text: 'humedad de 64 por ciento',
      },
      { column: 'lluvia (mm)', value: '0', json: null, text: 'sin lluvia' },
      { column: 'viento (km/h)', value: '12', json: '"vel": 12', text: 'viento ligero de 12 km/h' },
    ],
    jsonLines: [
      '{',
      '  "id": "E-14",',
      '  "hora": "14:00",',
      '  "temp_c": 27.5,',
      '  "humedad": 64,',
      '  "viento": { "vel": 12, "dir": "NE" }',
      '}',
    ],
    text:
      'Reporte de las 14 horas en la estación E-14: 27.5 grados, humedad de 64 por ciento, ' +
      'sin lluvia y viento ligero de 12 km/h del noreste.',
    textKind: 'Nota de voz transcrita',
  },
  pedidos: {
    name: 'Pedido de una tienda en línea',
    fields: [
      { column: 'cliente', value: 'C-2031', json: '"C-2031"', text: 'cliente C-2031' },
      { column: 'artículos', value: '3', json: '"items": [', text: 'tres artículos' },
      { column: 'total ($)', value: '1,250', json: '"total": 1250', text: '1,250 pesos' },
      { column: 'envío', value: 'exprés', json: '"envio": "expres"', text: 'envío exprés' },
      { column: 'queja', value: 'sí', json: null, text: 'llegó con la caja dañada' },
    ],
    jsonLines: [
      '{',
      '  "cliente": "C-2031",',
      '  "items": [',
      '    { "sku": "A1", "cant": 2 },',
      '    { "sku": "B7", "cant": 1 }',
      '  ],',
      '  "total": 1250,',
      '  "envio": "expres"',
      '}',
    ],
    text:
      'Hola, soy el cliente C-2031. Pedí tres artículos por 1,250 pesos con envío exprés, ' +
      'pero el paquete llegó con la caja dañada.',
    textKind: 'Correo del cliente',
  },
};
