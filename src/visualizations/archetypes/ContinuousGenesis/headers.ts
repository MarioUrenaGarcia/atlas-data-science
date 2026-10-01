import {
  processSpec,
  value,
  type ContinuousExperiment,
  type ContinuousSettings,
} from './processes.ts';

/** Number in LaTeX with a few decimals and no trailing zeros. */
export function tex(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return x > 0 ? '\\infty' : '-\\infty';
  if (x !== 0 && Math.abs(x) < 1e-3) {
    const [mantissa = '0', exponent = '0'] = x.toExponential(2).split('e');
    return `${mantissa} \\times 10^{${Number(exponent)}}`;
  }
  return String(Number(x.toFixed(digits)));
}

const text = (s: string) => `\\text{${s}}`;
const paren = (x: number) => (x < 0 ? `(${tex(x)})` : tex(x));

/**
 * Formula above the scene. While an experiment unfolds it shows the running
 * computation with the current numbers; when it ends it shows the value and
 * the density of the target distribution at that value.
 */
export function continuousHeader(
  settings: ContinuousSettings,
  experiment: ContinuousExperiment | null,
  shown: number,
): string {
  const spec = processSpec(settings.process);
  const theory = spec.theory(settings);
  const events = experiment ? experiment.events.slice(0, shown) : [];
  const done = experiment !== null && shown >= experiment.events.length;
  const draws = (row: number) =>
    events.flatMap((event) => (event.kind === 'draw' && event.row === row ? [event] : []));
  const last = (row: number) => draws(row).at(-1)?.value;
  const v = (key: string, fallback: number) => value(settings, key, fallback);
  const density = (x: number) => `,\\quad f(${tex(x, 2)}) = ${tex(theory.pdf(x))}`;
  const x = experiment?.value ?? 0;

  switch (settings.process) {
    case 'punto-uniforme': {
      const a = v('a', 0);
      const b = Math.max(a + 0.1, v('b', 10));
      if (!done)
        return `X \\sim U(${tex(a)}, ${tex(b)}),\\quad f(x) = \\frac{1}{b - a} = ${tex(1 / (b - a))}`;
      return `X = ${tex(x)},\\quad P(X \\le ${tex(x, 2)}) = \\frac{${tex(x, 2)} - ${paren(a)}}{${tex(b - a)}} = ${tex(theory.cdf(x))}`;
    }
    case 'suma-uniformes': {
      const n = Math.round(v('n', 12));
      const count = draws(0).length;
      if (!done)
        return count === 0
          ? `S = U_1 + \\dots + U_{${n}}`
          : `S_{${count}} = ${tex(last(1) ?? 0)}\\quad(${count}\\ ${text('de')}\\ ${n})`;
      return `S = ${tex(x)},\\quad \\mathbb{E}[S] = \\tfrac{n}{2} = ${tex(n / 2)},\\quad \\operatorname{Var}(S) = \\tfrac{n}{12} = ${tex(n / 12)}`;
    }
    case 'llegadas': {
      const k = Math.round(v('k', 1));
      const rate = v('lambda', 1);
      const arrivals = events.filter((event) => event.kind === 'arrival');
      const time = arrivals.at(-1);
      if (!done)
        return arrivals.length === 0
          ? `T_k = E_1 + \\dots + E_k,\\quad E_i \\sim \\operatorname{Exp}(${tex(rate)})`
          : `${text('llegada')}\\ ${arrivals.length}\\ ${text('de')}\\ ${k}\\ ${text('en')}\\ t = ${tex(time?.kind === 'arrival' ? time.time : 0)}`;
      return k === 1
        ? `T = ${tex(x)},\\quad f(t) = \\lambda e^{-\\lambda t} = ${tex(rate)}\\,e^{-${tex(rate)} \\cdot ${tex(x, 2)}} = ${tex(theory.pdf(x))}`
        : `T = ${tex(x)},\\quad f(t) = \\frac{\\lambda^{k} t^{k-1} e^{-\\lambda t}}{(k-1)!} = ${tex(theory.pdf(x))}`;
    }
    case 'suma-cuadrados': {
      const k = Math.round(v('k', 3));
      const zs = draws(0).map((event) => event.value);
      if (!done)
        return zs.length === 0
          ? `Q = Z_1^2 + \\dots + Z_{${k}}^2`
          : `Q_{${zs.length}} = ${zs.map((z) => `${paren(z)}^2`).join(' + ')} = ${tex(last(1) ?? 0)}`;
      return `Q = ${tex(x)}${density(x)}`;
    }
    case 'cociente-t': {
      const z = last(0);
      const vv = last(1);
      if (!done) {
        if (z === undefined)
          return `T = \\frac{Z}{\\sqrt{V/\\nu}},\\quad \\nu = ${Math.round(v('nu', 3))}`;
        if (vv === undefined) return `Z = ${tex(z)}`;
      }
      if (z === undefined || vv === undefined) return '';
      return `T = \\frac{${tex(z)}}{\\sqrt{${tex(vv)}}} = ${tex(z / Math.sqrt(vv))}${done ? density(x) : ''}`;
    }
    case 'cociente-f': {
      const a = last(0);
      const b = last(1);
      if (a === undefined) return `F = \\frac{V_1/d_1}{V_2/d_2}`;
      if (b === undefined) return `V_1/d_1 = ${tex(a)}`;
      return `F = \\frac{${tex(a)}}{${tex(b)}} = ${tex(a / b)}${done ? density(x) : ''}`;
    }
    case 'producto': {
      const n = Math.round(v('n', 12));
      const count = draws(0).length;
      if (!done)
        return count === 0
          ? `X = F_1 F_2 \\cdots F_{${n}},\\quad \\log X = \\sum \\log F_i`
          : `X_{${count}} = ${tex(last(1) ?? 1)},\\quad \\log X_{${count}} = ${tex(Math.log(last(1) ?? 1))}`;
      return `X = ${tex(x)},\\quad \\log X = ${tex(Math.log(x))}${density(x)}`;
    }
    case 'maximo': {
      const n = Math.round(v('n', 20));
      if (!done) return `M = \\max(E_1, \\dots, E_{${n}}) - \\log ${n}`;
      const best = Math.max(...draws(0).map((event) => event.value));
      return `M = ${tex(best)} - ${tex(Math.log(n))} = ${tex(x)}${density(x)}`;
    }
    case 'minimo': {
      const n = Math.round(v('n', 20));
      const k = v('k', 2);
      if (!done) return `W = ${n}^{1/${tex(k)}} \\min(R_1, \\dots, R_{${n}})`;
      const weakest = Math.min(...draws(0).map((event) => event.value));
      return `W = ${tex(n ** (1 / k))} \\cdot ${tex(weakest)} = ${tex(x)}${density(x)}`;
    }
    case 'maximo-pareto': {
      const n = Math.round(v('n', 20));
      const alpha = v('alpha', 3);
      if (!done) return `M = \\max(X_1, \\dots, X_{${n}}) / ${n}^{1/${tex(alpha)}}`;
      const best = Math.max(...draws(0).map((event) => event.value));
      return `M = \\frac{${tex(best)}}{${tex(n ** (1 / alpha))}} = ${tex(x)}${density(x)}`;
    }
    case 'distancia': {
      const point = events.find((event) => event.kind === 'point');
      if (!point || point.kind !== 'point')
        return `R = \\sqrt{X^2 + Y^2},\\quad X \\sim \\mathcal{N}(${tex(v('nu', 0))}, ${tex(v('sigma', 1) ** 2)})`;
      return `R = \\sqrt{${paren(point.x)}^2 + ${paren(point.y)}^2} = ${tex(Math.hypot(point.x, point.y))}${done ? density(x) : ''}`;
    }
    case 'faro': {
      const angle = events.find((event) => event.kind === 'angle');
      if (!angle || angle.kind !== 'angle')
        return `X = x_0 + \\gamma \\tan\\theta,\\quad \\theta \\sim U(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})`;
      return `X = ${tex(v('x0', 0))} + ${tex(v('gamma', 1))} \\tan(${tex(angle.theta)}) = ${tex(x)}${density(x)}`;
    }
    case 'diferencia-exponenciales': {
      const e1 = last(0);
      const e2 = last(1);
      if (e1 === undefined) return `X = \\mu + E_1 - E_2`;
      if (e2 === undefined) return `E_1 = ${tex(e1)}`;
      return `X = ${tex(v('mu', 0))} + ${tex(e1)} - ${tex(e2)} = ${tex(v('mu', 0) + e1 - e2)}${done ? density(x) : ''}`;
    }
    case 'estadistico-de-orden': {
      const n = Math.round(v('n', 5));
      const k = Math.min(n, Math.round(v('k', 2)));
      if (!done)
        return `U_{(${k})} = ${text('el menor número')}\\ ${k}\\ ${text('de')}\\ ${n}\\ ${text('uniformes')}`;
      return `U_{(${k})} = ${tex(x)}${density(x)}`;
    }
    case 'log-momios': {
      const u = last(0);
      if (u === undefined) return `X = \\mu + s\\log\\frac{U}{1 - U}`;
      return `X = ${tex(v('mu', 0))} + ${tex(v('s', 1))}\\log\\frac{${tex(u)}}{${tex(1 - u)}} = ${tex(v('mu', 0) + v('s', 1) * Math.log(u / (1 - u)))}${done ? density(x) : ''}`;
    }
    case 'potencia-de-uniforme': {
      const u = last(0);
      const alpha = v('alpha', 1.5);
      if (u === undefined) return `X = x_m\\,U^{-1/\\alpha}`;
      return `X = ${tex(v('xm', 1))} \\cdot ${tex(u)}^{-1/${tex(alpha)}} = ${tex(v('xm', 1) * u ** (-1 / alpha))}${done ? density(x) : ''}`;
    }
    case 'minimo-de-maximos': {
      const maxima = draws(1).map((event) => event.value);
      if (!done)
        return maxima.length === 0
          ? `X = \\min_{g} \\max_{i} U_{g,i}`
          : `${text('máximos de los grupos')}: ${maxima.map((m) => tex(m)).join(',\\ ')}`;
      return `X = \\min(${maxima.map((m) => tex(m)).join(', ')}) = ${tex(x)}${density(x)}`;
    }
    case 'truncamiento': {
      const a = v('a', 0);
      const b = Math.max(a + 0.1, v('b', 5));
      const attempts = draws(0);
      const current = attempts.at(-1);
      if (!current) return `X = Z \\mid ${tex(a)} \\le Z \\le ${tex(b)}`;
      const rejected = attempts.filter((event) => event.tone === 'rejected').length;
      return current.tone === 'rejected'
        ? `Z = ${tex(current.value)} \\notin [${tex(a)}, ${tex(b)}]:\\ ${text('se descarta')}\\ (${rejected})`
        : `Z = ${tex(current.value)} \\in [${tex(a)}, ${tex(b)}]:\\ ${text('se acepta')}${done ? density(x) : ''}`;
    }
    case 'seleccion': {
      const z1 = last(0);
      const z0 = last(1);
      const alpha = v('alpha', 3);
      if (z1 === undefined)
        return `X = Z_1\\ ${text('si')}\\ Z_0 \\le \\alpha Z_1,\\quad X = -Z_1\\ ${text('si no')}`;
      if (z0 === undefined) return `Z_1 = ${tex(z1)},\\quad \\alpha Z_1 = ${tex(alpha * z1)}`;
      const keep = z0 <= alpha * z1;
      return `Z_0 = ${tex(z0)}\\ ${keep ? '\\le' : '>'}\\ \\alpha Z_1 = ${tex(alpha * z1)}:\\ X = ${keep ? '' : '-'}Z_1 = ${tex(keep ? z1 : -z1)}${done ? density(x) : ''}`;
    }
    case 'inverso-gamma': {
      const g = last(0);
      if (g === undefined)
        return `X = 1/G,\\quad G \\sim \\operatorname{Gamma}(${tex(v('alpha', 3))}, ${tex(v('beta', 2))})`;
      return `X = \\frac{1}{${tex(g)}} = ${tex(1 / g)}${done ? density(x) : ''}`;
    }
    case 'inverso-cuadrado': {
      const z = last(0);
      if (z === undefined) return `X = \\mu + c/Z^2`;
      return `X = ${tex(v('mu', 0))} + \\frac{${tex(v('c', 1))}}{${paren(z)}^2} = ${tex(v('mu', 0) + v('c', 1) / (z * z))}${done ? density(x) : ''}`;
    }
    case 'direccion': {
      if (!done)
        return `f(\\theta) = \\frac{e^{\\kappa\\cos(\\theta - \\mu)}}{2\\pi I_0(\\kappa)},\\quad \\kappa = ${tex(v('kappa', 2))}`;
      return `\\Theta = ${tex(x)}\\ ${text('rad')}${density(x)}`;
    }
    case 'suma-colas-pesadas': {
      const n = Math.round(v('n', 30));
      const alpha = v('alpha', 1.5);
      const count = draws(0).length;
      if (!done)
        return count === 0
          ? `S = \\frac{X_1 + \\dots + X_{${n}}}{${n}^{1/${tex(alpha)}}}`
          : `S_{${count}} = ${tex(last(1) ?? 0)}\\quad(${count}\\ ${text('de')}\\ ${n})`;
      return `S = ${tex(x)}${density(x)}`;
    }
  }
}
