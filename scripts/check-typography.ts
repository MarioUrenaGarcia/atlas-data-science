import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

interface Rule {
  name: string;
  pattern: RegExp;
}

// Patterns are built from numeric code points so this file never contains the characters it forbids.
function charClass(...ranges: [number, number][]): RegExp {
  const body = ranges
    .map(([from, to]) =>
      from === to
        ? String.fromCodePoint(from)
        : `${String.fromCodePoint(from)}-${String.fromCodePoint(to)}`,
    )
    .join('');
  return new RegExp(`[${body}]`, 'u');
}

const RULES: Rule[] = [
  { name: 'guion largo (U+2014)', pattern: charClass([0x2014, 0x2014]) },
  { name: 'guion medio (U+2013)', pattern: charClass([0x2013, 0x2013]) },
  {
    name: 'flecha decorativa',
    pattern: charClass([0x2190, 0x21ff], [0x27f0, 0x27ff], [0x2900, 0x297f]),
  },
  { name: 'figura geométrica decorativa', pattern: charClass([0x25a0, 0x25ff]) },
  { name: 'símbolo o dingbat', pattern: charClass([0x2600, 0x27bf], [0x2b00, 0x2bff]) },
  { name: 'emoji o pictograma', pattern: charClass([0x1f000, 0x1faff]) },
  { name: 'unión o selector de emoji', pattern: charClass([0xfe0e, 0xfe0f], [0x200d, 0x200d]) },
];

const EXCLUDED_PREFIXES = ['node_modules/', 'dist/', 'src/generated/'];
const BINARY_EXTENSIONS = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|pdf|zip)$/i;

function listFiles(): string[] {
  // Tracked, staged and new non-ignored files: everything that is or will be versioned.
  const output = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { encoding: 'utf8' },
  );
  const files = output.split('\0').filter((file) => file.length > 0);
  return [...new Set(files)].filter(
    (file) =>
      !EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix)) &&
      !BINARY_EXTENSIONS.test(file) &&
      existsSync(file),
  );
}

interface Finding {
  file: string;
  line: number;
  column: number;
  rule: string;
}

function scanFile(file: string): Finding[] {
  const buffer = readFileSync(file);
  if (buffer.includes(0)) {
    return [];
  }
  const findings: Finding[] = [];
  const lines = buffer.toString('utf8').split(/\r?\n/);
  lines.forEach((text, index) => {
    for (const rule of RULES) {
      const match = rule.pattern.exec(text);
      if (match) {
        findings.push({ file, line: index + 1, column: match.index + 1, rule: rule.name });
      }
    }
  });
  return findings;
}

const findings = listFiles().flatMap(scanFile);

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line}:${finding.column}  ${finding.rule}`);
  }
  console.error(`\n${findings.length} problema(s) tipográfico(s) encontrado(s).`);
  process.exit(1);
}

console.log('Tipografía correcta: sin guiones largos, guiones medios ni emojis.');
