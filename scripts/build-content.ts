import { watch } from 'node:fs';
import { CONTENT_ROOT, runPipeline, writeOutput } from './content/pipeline.ts';
import { printIssues, summarize } from './content/report.ts';

const args = new Set(process.argv.slice(2));
const production = args.has('--production');
const strict = args.has('--strict');
const watchMode = args.has('--watch');

async function build(): Promise<boolean> {
  const started = performance.now();
  const result = await runPipeline({ production, strict });
  printIssues(result.issues, args.has('--detalle'));
  const { errors, warnings } = summarize(result.issues);
  if (!result.output) {
    console.error(`Contenido con ${errors} error(es); no se generaron archivos.`);
    return false;
  }
  writeOutput(result.output);
  const elapsed = Math.round(performance.now() - started);
  const mode = production ? 'producción' : 'desarrollo';
  console.log(
    `Contenido generado (${mode}): ${result.stats.published} publicadas, ${result.stats.drafts} en borrador, ${warnings} aviso(s), ${elapsed} ms.`,
  );
  return true;
}

const ok = await build();

if (watchMode) {
  let timer: NodeJS.Timeout | undefined;
  watch(CONTENT_ROOT, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      void build();
    }, 150);
  });
  console.log('Observando cambios en content/.');
} else if (!ok) {
  process.exit(1);
}
