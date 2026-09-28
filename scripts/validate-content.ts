import { runPipeline } from './content/pipeline.ts';
import { printIssues, summarize } from './content/report.ts';

const args = new Set(process.argv.slice(2));
const result = await runPipeline({ production: true, strict: args.has('--strict') });
printIssues(result.issues, args.has('--detalle'));
const { errors, warnings } = summarize(result.issues);
console.log(
  `\n${result.stats.concepts} ficha(s): ${result.stats.published} publicadas, ${result.stats.drafts} en borrador.`,
);
console.log(`${errors} error(es), ${warnings} aviso(s).`);
if (errors > 0) process.exit(1);
