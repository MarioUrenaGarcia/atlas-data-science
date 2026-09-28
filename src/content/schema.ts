import { z } from 'zod';
import { BIBLIOGRAPHY_KEYS } from './bibliography.ts';

export const LEVELS = ['basico', 'intermedio', 'avanzado'] as const;
export type Level = (typeof LEVELS)[number];

export const RELATION_TYPES = [
  'relacionado',
  'generaliza',
  'caso-particular',
  'contrasta',
] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

/** Body sections of a concept page, in the required order. */
export const SECTION_TITLES = [
  'Intuición',
  'Definición',
  'Cómo usar la visualización',
  'Ejemplo',
  'Propiedades',
  'Errores comunes',
  'Conexiones',
] as const;

export const LIMITS = {
  maxPrerequisites: 5,
  minTags: 2,
  maxTags: 8,
  maxSummaryLength: 240,
  intuitionWords: { min: 80, max: 250 },
  visualizationGuideWords: { min: 60, max: 200 },
} as const;

const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SUBMODULE_KEY = /^\d{1,2}\.\d{1,2}$/;

export const conceptIdSchema = z.string().regex(KEBAB_ID, 'debe estar en kebab-case sin acentos');
export const submoduleKeySchema = z.string().regex(SUBMODULE_KEY, 'debe tener la forma N.M');
export const levelSchema = z.enum(LEVELS);

export const conceptFrontmatterSchema = z
  .object({
    id: conceptIdSchema,
    titulo: z.string().min(1),
    titulo_en: z.string().min(1),
    alias: z.array(z.string().min(1)).default([]),
    modulo: z.number().int().min(0).max(17),
    submodulo: submoduleKeySchema,
    orden: z.number().int().min(1),
    nivel: levelSchema,
    prerrequisitos: z.array(conceptIdSchema).max(LIMITS.maxPrerequisites),
    relaciones: z
      .array(z.object({ tipo: z.enum(RELATION_TYPES), id: conceptIdSchema }).strict())
      .default([]),
    etiquetas: z.array(z.string().min(1)).min(LIMITS.minTags).max(LIMITS.maxTags),
    resumen: z.string().trim().min(1).max(LIMITS.maxSummaryLength),
    formula: z.string().min(1).optional(),
    visualizacion: z
      .object({
        componente: z.string().regex(/^[A-Z][A-Za-z0-9]*$/, 'debe ser un nombre en PascalCase'),
        parametros: z.record(z.string(), z.unknown()).default({}),
      })
      .strict(),
    referencias: z
      .array(
        z
          .object({
            clave: z.enum(BIBLIOGRAPHY_KEYS),
            capitulo: z.string().min(1).optional(),
          })
          .strict(),
      )
      .min(1),
    publicado: z.boolean(),
  })
  .strict()
  .superRefine((value, context) => {
    const submoduleModule = Number(value.submodulo.split('.')[0]);
    if (submoduleModule !== value.modulo) {
      context.addIssue({
        code: 'custom',
        path: ['submodulo'],
        message: `el submódulo ${value.submodulo} no pertenece al módulo ${value.modulo}`,
      });
    }
    if (new Set(value.prerrequisitos).size !== value.prerrequisitos.length) {
      context.addIssue({ code: 'custom', path: ['prerrequisitos'], message: 'hay duplicados' });
    }
    if (value.prerrequisitos.includes(value.id)) {
      context.addIssue({
        code: 'custom',
        path: ['prerrequisitos'],
        message: 'un concepto no puede ser su propio prerrequisito',
      });
    }
  });

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;

const levelRangeSchema = z.array(levelSchema).min(1).max(3);

export const submoduleSchema = z
  .object({
    clave: submoduleKeySchema,
    titulo: z.string().min(1),
    nivel: levelRangeSchema,
    descripcion: z.string().min(1),
    /** Concepts that live in another submodule but are listed here as a link. */
    enlaces: z.array(conceptIdSchema).default([]),
  })
  .strict();

export const moduleSchema = z
  .object({
    numero: z.number().int().min(0).max(17),
    clave: conceptIdSchema,
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    /** Concept whose visualization serves as the module cover. */
    portada: conceptIdSchema,
    submodulos: z.array(submoduleSchema).min(1),
  })
  .strict();

export const modulesFileSchema = z.object({ modulos: z.array(moduleSchema).min(1) }).strict();
export type ModuleDefinition = z.infer<typeof moduleSchema>;
export type SubmoduleDefinition = z.infer<typeof submoduleSchema>;

export const routeSelectorSchema = z.union([
  z.object({ ruta: conceptIdSchema, hasta_submodulo: submoduleKeySchema.optional() }).strict(),
  z
    .object({ modulo: z.number().int().min(0).max(17), niveles: z.array(levelSchema).optional() })
    .strict(),
  z
    .object({
      submodulo: submoduleKeySchema,
      niveles: z.array(levelSchema).optional(),
      hasta: conceptIdSchema.optional(),
    })
    .strict(),
  z.object({ concepto: conceptIdSchema }).strict(),
]);
export type RouteSelector = z.infer<typeof routeSelectorSchema>;

export const routeDefinitionSchema = z
  .object({
    id: conceptIdSchema,
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    perfil: z.string().min(1),
    incluye: z.array(routeSelectorSchema).min(1),
  })
  .strict();
export const routesFileSchema = z.object({ rutas: z.array(routeDefinitionSchema).min(1) }).strict();
export type RouteDefinition = z.infer<typeof routeDefinitionSchema>;

export const notationFileSchema = z
  .object({
    macros: z.record(z.string().regex(/^\\[A-Za-z]+$/), z.string().min(1)),
    grupos: z
      .array(
        z
          .object({
            titulo: z.string().min(1),
            entradas: z
              .array(
                z
                  .object({
                    objeto: z.string().min(1),
                    notacion: z.string().min(1),
                    nota: z.string().min(1).optional(),
                  })
                  .strict(),
              )
              .min(1),
          })
          .strict(),
      )
      .min(1),
    convenciones: z.array(z.string().min(1)).default([]),
  })
  .strict();
export type NotationFile = z.infer<typeof notationFileSchema>;

export const synonymsFileSchema = z
  .object({ sinonimos: z.array(z.array(z.string().min(1)).min(2)).min(1) })
  .strict();
