import { multinomialPmf } from '../../../lib/distributions/index.ts';
import {
  categoryProbabilities,
  diceCount,
  dieRange,
  processSpec,
  slotCount,
  slotProbability,
  urnSizes,
  type Experiment,
  type GenesisEvent,
  type GenesisSettings,
} from './processes.ts';

/** Number in LaTeX: fixed decimals without trailing zeros, scientific notation when tiny. */
export function texNumber(value: number, digits = 4): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 1e-4) {
    const [mantissa = '0', exponent = '0'] = value.toExponential(2).split('e');
    return `${mantissa} \\times 10^{${Number(exponent)}}`;
  }
  return String(Number(value.toFixed(digits)));
}

const text = (value: string) => `\\text{${value.replace(/([%$#&_{}])/g, '\\$1')}}`;

function sumTrials(events: readonly GenesisEvent[]) {
  let successes = 0;
  let total = 0;
  for (const event of events) {
    if (event.kind !== 'trial') continue;
    total += 1;
    if (event.success) successes += 1;
  }
  return { successes, failures: total - successes, total };
}

/**
 * Formula shown above the stage. It follows the animation: while an
 * experiment unfolds it shows the running count, and once it ends it shows
 * the probability of the value obtained with the current numbers.
 */
export function genesisHeader(
  settings: GenesisSettings,
  experiment: Experiment | null,
  shown: number,
): string {
  const values = settings.values;
  const get = (key: string, fallback: number) => values[key] ?? fallback;
  const events = experiment ? experiment.events.slice(0, shown) : [];
  const done = experiment !== null && shown >= experiment.events.length;
  const theory = processSpec(settings.process).theory(settings);
  const probabilityOf = (value: number) => texNumber(theory.pmf(value));
  const { successes, failures, total } = sumTrials(events);

  switch (settings.process) {
    case 'dado': {
      const { low, high } = dieRange(settings);
      const faces = high - low + 1;
      const dice = diceCount(settings);
      const rolls = events.flatMap((event) => (event.kind === 'roll' ? [event.value] : []));
      if (dice === 1) {
        if (!done || !experiment)
          return `X \\sim U\\{${low}, \\dots, ${high}\\},\\quad P(X = k) = \\frac{1}{${faces}}`;
        return `X = ${experiment.value},\\quad P(X = ${experiment.value}) = \\frac{1}{${faces}} = ${texNumber(1 / faces)}`;
      }
      if (!done || !experiment)
        return rolls.length === 0
          ? `X = D_1 + \\dots + D_{${dice}}`
          : `${rolls.join(' + ')}${rolls.length < dice ? ' + \\dots' : ''}`;
      const total = faces ** dice;
      const ways = Math.round(theory.pmf(experiment.value) * total);
      return `X = ${rolls.join(' + ')} = ${experiment.value},\\quad P(X = ${experiment.value}) = \\frac{${ways}}{${total}} = ${probabilityOf(experiment.value)}`;
    }
    case 'moneda': {
      const p = get('p', 0.3);
      if (!done || !experiment) return `X \\sim \\operatorname{Bernoulli}(${texNumber(p)})`;
      return experiment.value === 1
        ? `X = 1\\ (${text(settings.success)}),\\quad P(X = 1) = p = ${texNumber(p)}`
        : `X = 0\\ (${text(settings.failure)}),\\quad P(X = 0) = 1 - p = ${texNumber(1 - p)}`;
    }
    case 'ensayos': {
      const n = Math.round(get('n', 10));
      const p = get('p', 0.5);
      if (!done || !experiment)
        return `${successes}\\ ${text('éxitos en')}\\ ${total}\\ ${text('de')}\\ ${n}\\ ${text('ensayos')}`;
      const k = experiment.value;
      return `P(X = ${k}) = \\binom{${n}}{${k}} (${texNumber(p)})^{${k}} (${texNumber(1 - p)})^{${n - k}} = ${probabilityOf(k)}`;
    }
    case 'primer-exito': {
      const p = get('p', 0.25);
      if (!done || !experiment)
        return `${total}\\ ${text(total === 1 ? 'ensayo' : 'ensayos')}${successes === 0 ? `,\\ ${text('sin éxito todavía')}` : ''}`;
      const x = experiment.value;
      return settings.countTrials
        ? `X = ${x},\\quad P(X = ${x}) = (1 - p)^{${x - 1}}\\,p = (${texNumber(1 - p)})^{${x - 1}}(${texNumber(p)}) = ${probabilityOf(x)}`
        : `X = ${x},\\quad P(X = ${x}) = (1 - p)^{${x}}\\,p = (${texNumber(1 - p)})^{${x}}(${texNumber(p)}) = ${probabilityOf(x)}`;
    }
    case 'r-exitos': {
      const r = Math.round(get('r', 3));
      const p = get('p', 0.4);
      if (!done || !experiment)
        return `${successes}\\ ${text('de')}\\ ${r}\\ ${text('éxitos')},\\quad ${failures}\\ ${text('fracasos')}`;
      const x = experiment.value;
      return settings.countTrials
        ? `X = ${x},\\quad P(X = ${x}) = \\binom{${x - 1}}{${r - 1}} (${texNumber(p)})^{${r}} (${texNumber(1 - p)})^{${x - r}} = ${probabilityOf(x)}`
        : `X = ${x},\\quad P(X = ${x}) = \\binom{${x + r - 1}}{${x}} (${texNumber(p)})^{${r}} (${texNumber(1 - p)})^{${x}} = ${probabilityOf(x)}`;
    }
    case 'urna': {
      const { population, marked, draws } = urnSizes(settings);
      const hits = events.filter((event) => event.kind === 'draw' && event.success).length;
      const drawn = events.filter((event) => event.kind === 'draw').length;
      if (!done || !experiment)
        return `${hits}\\ ${text('marcadas en')}\\ ${drawn}\\ ${text('de')}\\ ${draws}\\ ${text('extracciones')}`;
      const k = experiment.value;
      if (settings.replacement)
        return `P(X = ${k}) = \\binom{${draws}}{${k}} \\left(\\tfrac{${marked}}{${population}}\\right)^{${k}} \\left(\\tfrac{${population - marked}}{${population}}\\right)^{${draws - k}} = ${probabilityOf(k)}`;
      return `P(X = ${k}) = \\frac{\\binom{${marked}}{${k}}\\binom{${population - marked}}{${draws - k}}}{\\binom{${population}}{${draws}}} = ${probabilityOf(k)}`;
    }
    case 'llegadas': {
      const lambda = get('lambda', 3);
      const slots = slotCount(settings);
      const arrived = events.filter(
        (event) => event.kind === 'arrival' || event.kind === 'slot',
      ).length;
      if (!done || !experiment) {
        const last = events[events.length - 1];
        if (slots) {
          const position = last?.kind === 'slot' ? last.index + 1 : 0;
          return `${arrived}\\ ${text(arrived === 1 ? 'rendija ocupada de' : 'rendijas ocupadas de')}\\ ${position}\\ ${text(position === 1 ? 'revisada' : 'revisadas')},\\quad p = \\frac{\\lambda}{m} = ${texNumber(slotProbability(settings))}`;
        }
        const time = last?.kind === 'arrival' ? last.time : 0;
        return `N(${texNumber(time, 2)}) = ${arrived}`;
      }
      const k = experiment.value;
      if (slots) {
        const p = slotProbability(settings);
        return `P(X = ${k}) = \\binom{${slots}}{${k}} (${texNumber(p)})^{${k}} (${texNumber(1 - p)})^{${slots - k}} = ${probabilityOf(k)}`;
      }
      return `P(N = ${k}) = \\frac{e^{-${texNumber(lambda)}}\\,${texNumber(lambda)}^{${k}}}{${k}!} = ${probabilityOf(k)}`;
    }
    case 'ruleta': {
      const probabilities = categoryProbabilities(settings);
      if (!done || !experiment) return `P(X = j) = p_j,\\quad \\textstyle\\sum_j p_j = 1`;
      const j = experiment.value;
      const label = settings.categories[j]?.label ?? String(j + 1);
      return `X = ${text(label)},\\quad P(X = ${text(label)}) = p_{${j + 1}} = ${texNumber(probabilities[j] ?? 0)}`;
    }
    case 'bolas-en-cajas': {
      const probabilities = categoryProbabilities(settings);
      const counts = probabilities.map(() => 0);
      for (const event of events)
        if (event.kind === 'ball') counts[event.category] = (counts[event.category] ?? 0) + 1;
      if (!done || !experiment)
        return `(${counts.join(', ')}),\\quad ${counts.reduce((a, b) => a + b, 0)}\\ ${text('de')}\\ ${Math.round(get('n', 8))}\\ ${text('bolas')}`;
      const n = Math.round(get('n', 8));
      const final = experiment.counts ?? counts;
      const factorials = final.map((c) => `${c}!`).join('\\,');
      const powers = final.map((c, i) => `(${texNumber(probabilities[i] ?? 0)})^{${c}}`).join('');
      return `P(\\mathbf{X} = (${final.join(', ')})) = \\frac{${n}!}{${factorials}}\\,${powers} = ${texNumber(multinomialPmf(final, probabilities))}`;
    }
    case 'beta-binomial': {
      const n = Math.round(get('n', 12));
      const alpha = get('alpha', 1.5);
      const beta = get('beta', 1.5);
      const bias = events.find((event) => event.kind === 'bias');
      if (!bias || bias.kind !== 'bias')
        return `p \\sim \\operatorname{Beta}(${texNumber(alpha)}, ${texNumber(beta)})`;
      if (!done || !experiment)
        return `p = ${texNumber(bias.p, 3)},\\quad ${successes}\\ ${text('éxitos en')}\\ ${total}\\ ${text('de')}\\ ${n}`;
      const k = experiment.value;
      return `P(X = ${k}) = \\binom{${n}}{${k}} \\frac{B(${k} + ${texNumber(alpha)},\\ ${n - k} + ${texNumber(beta)})}{B(${texNumber(alpha)}, ${texNumber(beta)})} = ${probabilityOf(k)}`;
    }
    case 'ranking': {
      const count = Math.round(get('N', 30));
      const s = get('s', 1);
      if (!done || !experiment) return `P(K = k) = \\frac{k^{-s}}{H_{${count},\\,${texNumber(s)}}}`;
      const k = experiment.value;
      const harmonic = theory.pmf(1) > 0 ? 1 / theory.pmf(1) : 1;
      return `P(K = ${k}) = \\frac{${k}^{-${texNumber(s)}}}{${texNumber(harmonic, 3)}} = ${probabilityOf(k)}`;
    }
    case 'mezcla-geometrica': {
      const p = get('p', 0.8);
      const bias = events.find((event) => event.kind === 'bias');
      if (!bias || bias.kind !== 'bias')
        return `${text('se sortea la probabilidad de éxito')}\\ s = (1 - p)^{U},\\quad U \\sim U(0, 1)`;
      const head = `${text('probabilidad sorteada')}\\ s = (${texNumber(1 - p)})^{${texNumber(bias.u ?? 0, 2)}} = ${texNumber(bias.p, 3)}`;
      if (!done || !experiment)
        return `${head},\\quad ${total}\\ ${text(total === 1 ? 'ensayo' : 'ensayos')}`;
      const x = experiment.value;
      const s = bias.p;
      return `P(X = ${x} \\mid s) = (1 - s)^{${x - 1}} s = ${texNumber((1 - s) ** (x - 1) * s)},\\quad P(X = ${x}) = \\frac{-(${texNumber(p)})^{${x}}}{${x}\\log(${texNumber(1 - p)})} = ${probabilityOf(x)}`;
    }
    case 'ceros-inflados': {
      const pi = get('pi', 0.35);
      const lambda = get('lambda', 3);
      const gate = events.find((event) => event.kind === 'gate');
      if (!gate || gate.kind !== 'gate')
        return `${text('primer sorteo: cero estructural con probabilidad')}\\ \\pi = ${texNumber(pi)}`;
      const arrived = events.filter((event) => event.kind === 'arrival').length;
      if (!done || !experiment)
        return gate.structural
          ? `${text('cero estructural (probabilidad')}\\ \\pi = ${texNumber(pi)}${text(')')}`
          : `${text('rama Poisson (probabilidad')}\\ 1 - \\pi = ${texNumber(1 - pi)}${text('):')}\\ N = ${arrived}`;
      const k = experiment.value;
      if (k === 0)
        return `P(X = 0) = \\pi + (1 - \\pi)e^{-\\lambda} = ${texNumber(pi)} + ${texNumber(1 - pi)}\\,e^{-${texNumber(lambda)}} = ${probabilityOf(0)}`;
      return `P(X = ${k}) = (1 - \\pi)\\frac{e^{-\\lambda}\\lambda^{${k}}}{${k}!} = ${probabilityOf(k)}`;
    }
    case 'diferencia-de-llegadas': {
      const first = events.filter((event) => event.kind === 'arrival' && event.stream === 0).length;
      const second = events.filter(
        (event) => event.kind === 'arrival' && event.stream === 1,
      ).length;
      if (!done || !experiment)
        return `N_1 = ${first},\\quad N_2 = ${second},\\quad X = N_1 - N_2 = ${first - second}`;
      const d = experiment.value;
      return `X = N_1 - N_2 = ${first} - ${second} = ${d},\\quad P(X = ${d}) = ${probabilityOf(d)}`;
    }
    case 'signos': {
      const n = Math.round(get('n', 1));
      const partial = events.reduce(
        (sum, event) => sum + (event.kind === 'sign' ? event.value : 0),
        0,
      );
      const count = events.filter((event) => event.kind === 'sign').length;
      if (!done || !experiment) return `S_{${count}} = ${partial}`;
      const s = experiment.value;
      if (n === 1)
        return `X = ${s > 0 ? '+1' : '-1'},\\quad P(X = ${s > 0 ? '+1' : '-1'}) = \\tfrac{1}{2}`;
      return `S_{${n}} = ${s},\\quad P(S_{${n}} = ${s}) = \\binom{${n}}{${(n + s) / 2}} 2^{-${n}} = ${probabilityOf(s)}`;
    }
  }
}
