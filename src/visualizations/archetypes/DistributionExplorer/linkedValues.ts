import type { ReferenceLink } from './schema.ts';

/**
 * Values of reference parameters tied to the main ones. Each is a product
 * factor * a^pa * b^pb ..., enough for relations such as λ = n p (Poisson
 * against binomial), λ = 1/θ or k = ν/2 without an expression parser.
 */
export function linkedValues(
  links: Readonly<Record<string, ReferenceLink>> | undefined,
  main: Readonly<Record<string, number>>,
): Record<string, number> {
  if (!links) return {};
  return Object.fromEntries(
    Object.entries(links).map(([key, link]) => [
      key,
      link.de.reduce(
        (product, name, index) =>
          product * (main[name] ?? Number.NaN) ** (link.potencias?.[index] ?? 1),
        link.factor ?? 1,
      ),
    ]),
  );
}
