/*
 * URL of the generated file of each concept. Only the concept page imports this
 * module, so the map (one entry per concept) travels in that lazy chunk and not
 * in the initial bundle.
 */
const urls = import.meta.glob<string>('../generated/concepts/*.json', {
  query: '?url',
  import: 'default',
  eager: true,
});

export function conceptContentUrl(id: string): string | undefined {
  return urls[`../generated/concepts/${id}.json`];
}
