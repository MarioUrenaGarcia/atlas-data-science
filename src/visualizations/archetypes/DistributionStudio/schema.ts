import { z } from 'zod';
import { parametersSchema as continuousSchema } from '../ContinuousGenesis/schema.ts';
import { parametersSchema as explorerSchema } from '../DistributionExplorer/schema.ts';
import { parametersSchema as discreteSchema } from '../DistributionGenesis/schema.ts';

export const parametersSchema = z
  .object({
    /** Still view: mass or density, cdf, regions, cases and the worked example. */
    explorador: explorerSchema,
    /** Optional animated construction shown in the second tab. */
    genesis: z
      .discriminatedUnion('componente', [
        z
          .object({ componente: z.literal('DistributionGenesis'), parametros: discreteSchema })
          .strict(),
        z
          .object({ componente: z.literal('ContinuousGenesis'), parametros: continuousSchema })
          .strict(),
      ])
      .optional(),
    /** Tab shown when the page opens. */
    pestana: z.enum(['distribucion', 'genesis']).optional(),
  })
  .strict();

export type DistributionStudioConfig = z.infer<typeof parametersSchema>;
