import { z } from 'zod';

export interface TreeBranch {
  etiqueta: string;
  prob: number;
  ramas?: TreeBranch[];
}

const branchSchema: z.ZodType<TreeBranch> = z.lazy(() =>
  z
    .object({
      etiqueta: z.string().min(1),
      prob: z.number().min(0).max(1),
      // A single branch with probability 1 models a forced step, such as a host with one choice.
      ramas: z.array(branchSchema).min(1).max(4).optional(),
    })
    .strict(),
);

const TOLERANCE = 1e-6;

const querySchema = z
  .object({
    nombre: z.string().min(1),
    /** Leaves given as the labels along the path joined by "/", such as "Enfermo/Positivo". */
    hojas: z.array(z.string().min(1)).min(1),
    /** Leaves of the conditioning event; when present the query is P(hojas | condicion). */
    condicion: z.array(z.string().min(1)).min(1).optional(),
  })
  .strict();

function collectLeaves(branches: readonly TreeBranch[], prefix: string, out: string[]): void {
  for (const branch of branches) {
    const path = prefix ? `${prefix}/${branch.etiqueta}` : branch.etiqueta;
    if (branch.ramas) collectLeaves(branch.ramas, path, out);
    else out.push(path);
  }
}

function checkSums(branches: readonly TreeBranch[], path: string, context: z.RefinementCtx): void {
  const total = branches.reduce((sum, branch) => sum + branch.prob, 0);
  if (Math.abs(total - 1) > TOLERANCE) {
    context.addIssue({
      code: 'custom',
      path: ['ramas'],
      message: `las ramas de "${path || 'la raíz'}" deben sumar 1 (suman ${total})`,
    });
  }
  for (const branch of branches) {
    if (branch.ramas)
      checkSums(branch.ramas, path ? `${path}/${branch.etiqueta}` : branch.etiqueta, context);
  }
}

export const parametersSchema = z
  .object({
    ramas: z.array(branchSchema).min(2).max(4),
    consultas: z.array(querySchema).min(1).optional(),
    /** Name of each level of the tree, such as "Urna" and "Bola". */
    niveles: z.array(z.string().min(1)).optional(),
    contexto: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    checkSums(value.ramas, '', context);
    const leaves: string[] = [];
    collectLeaves(value.ramas, '', leaves);
    if (leaves.length > 16) {
      context.addIssue({ code: 'custom', path: ['ramas'], message: 'a lo más 16 hojas' });
    }
    const known = new Set(leaves);
    value.consultas?.forEach((query, index) => {
      for (const leaf of [...query.hojas, ...(query.condicion ?? [])]) {
        if (!known.has(leaf)) {
          context.addIssue({
            code: 'custom',
            path: ['consultas', index],
            message: `hoja "${leaf}" inexistente`,
          });
        }
      }
    });
  });

export type ProbabilityTreeConfig = z.infer<typeof parametersSchema>;
