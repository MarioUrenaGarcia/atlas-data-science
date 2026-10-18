import type { CorpusId } from './schema.ts';

export const STOP_WORDS = new Set([
  'el',
  'la',
  'los',
  'las',
  'y',
  'de',
  'en',
  'un',
  'una',
  'que',
  'fue',
  'es',
  'muy',
  'pero',
  'estaba',
  'del',
  'al',
  'por',
  'con',
  'se',
]);

export const CORPORA: Record<CorpusId, { name: string; documents: readonly string[] }> = {
  resenas: {
    name: 'Reseñas de un restaurante',
    documents: [
      'La comida estaba rica y el servicio rápido.',
      'El servicio fue lento pero la comida rica.',
      'Comida fría y servicio lento.',
      'Excelente comida, excelente servicio.',
    ],
  },
  noticias: {
    name: 'Titulares de noticias',
    documents: [
      'Sube el precio de la gasolina en el país',
      'El banco central sube la tasa de interés',
      'La selección gana el partido en casa',
      'El equipo local pierde el partido final',
    ],
  },
  negacion: {
    name: 'Opiniones con negaciones',
    documents: [
      'el servicio es bueno',
      'el servicio no es bueno',
      'la comida no es mala',
      'la comida es mala',
    ],
  },
  clima: {
    name: 'Avisos del clima',
    documents: [
      'Mañana habrá lluvia fuerte en la costa',
      'La lluvia seguirá durante el fin de semana',
      'Poca lluvia y calor en el norte',
      'Lluvia y viento en la capital',
    ],
  },
};
