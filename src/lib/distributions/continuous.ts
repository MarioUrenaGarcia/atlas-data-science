import type { Random } from '../random/index.ts';
import {
  invertMonotone,
  logBeta,
  logGamma,
  regularizedBeta,
  regularizedGammaP,
  standardNormalCdf,
  standardNormalQuantile,
} from './special.ts';
import type { ContinuousDistribution } from './types.ts';

function check(condition: boolean, message: string): void {
  if (!condition) throw new RangeError(message);
}

export function normal(mean = 0, sd = 1): ContinuousDistribution {
  check(sd > 0, 'sd must be positive');
  return {
    kind: 'continuous',
    name: 'Normal',
    mean,
    variance: sd * sd,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI)),
    cdf: (x) => standardNormalCdf((x - mean) / sd),
    quantile: (p) => mean + sd * standardNormalQuantile(p),
    sample: (random: Random) => random.normal(mean, sd),
  };
}

export function uniform(min = 0, max = 1): ContinuousDistribution {
  check(max > min, 'max must exceed min');
  const width = max - min;
  return {
    kind: 'continuous',
    name: 'Uniforme',
    mean: (min + max) / 2,
    variance: (width * width) / 12,
    support: [min, max],
    pdf: (x) => (x >= min && x <= max ? 1 / width : 0),
    cdf: (x) => (x <= min ? 0 : x >= max ? 1 : (x - min) / width),
    quantile: (p) => min + p * width,
    sample: (random) => random.uniform(min, max),
  };
}

/** Exponential distribution parameterized by its rate; the mean is 1 / rate. */
export function exponential(rate = 1): ContinuousDistribution {
  check(rate > 0, 'rate must be positive');
  return {
    kind: 'continuous',
    name: 'Exponencial',
    mean: 1 / rate,
    variance: 1 / (rate * rate),
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) => (x < 0 ? 0 : rate * Math.exp(-rate * x)),
    cdf: (x) => (x < 0 ? 0 : 1 - Math.exp(-rate * x)),
    quantile: (p) => -Math.log(1 - p) / rate,
    sample: (random) => random.exponential(rate),
  };
}

/** Gamma distribution with shape alpha and rate beta; the mean is alpha / beta. */
export function gamma(shape: number, rate = 1): ContinuousDistribution {
  check(shape > 0 && rate > 0, 'shape and rate must be positive');
  const logNormalizer = shape * Math.log(rate) - logGamma(shape);
  const cdf = (x: number) => (x <= 0 ? 0 : regularizedGammaP(shape, rate * x));
  return {
    kind: 'continuous',
    name: 'Gamma',
    mean: shape / rate,
    variance: shape / (rate * rate),
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      if (x < 0) return 0;
      if (x === 0) return shape < 1 ? Number.POSITIVE_INFINITY : shape === 1 ? rate : 0;
      return Math.exp(logNormalizer + (shape - 1) * Math.log(x) - rate * x);
    },
    cdf,
    quantile: (p) => invertMonotone(cdf, p, 0, Number.POSITIVE_INFINITY),
    sample: (random) => random.gamma(shape, rate),
  };
}

export function chiSquare(degrees: number): ContinuousDistribution {
  return { ...gamma(degrees / 2, 0.5), name: 'Chi-cuadrada' };
}

export function beta(a: number, b: number): ContinuousDistribution {
  check(a > 0 && b > 0, 'a and b must be positive');
  const logB = logBeta(a, b);
  const cdf = (x: number) => regularizedBeta(x, a, b);
  return {
    kind: 'continuous',
    name: 'Beta',
    mean: a / (a + b),
    variance: (a * b) / ((a + b) ** 2 * (a + b + 1)),
    support: [0, 1],
    pdf: (x) => {
      if (x < 0 || x > 1) return 0;
      if (x === 0) return a < 1 ? Number.POSITIVE_INFINITY : a === 1 ? b : 0;
      if (x === 1) return b < 1 ? Number.POSITIVE_INFINITY : b === 1 ? a : 0;
      return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
    },
    cdf,
    quantile: (p) => invertMonotone(cdf, p, 0, 1),
    sample: (random) => random.beta(a, b),
  };
}

export function studentT(degrees: number): ContinuousDistribution {
  check(degrees > 0, 'degrees must be positive');
  const logNormalizer =
    logGamma((degrees + 1) / 2) - logGamma(degrees / 2) - 0.5 * Math.log(degrees * Math.PI);
  const cdf = (x: number) => {
    const x2 = x * x;
    // Near zero, degrees / (degrees + x^2) rounds to 1; the complementary form keeps precision.
    if (x2 < degrees) {
      const central = 0.5 * regularizedBeta(x2 / (degrees + x2), 0.5, degrees / 2);
      return x >= 0 ? 0.5 + central : 0.5 - central;
    }
    const tail = 0.5 * regularizedBeta(degrees / (degrees + x2), degrees / 2, 0.5);
    return x >= 0 ? 1 - tail : tail;
  };
  return {
    kind: 'continuous',
    name: 't de Student',
    mean: degrees > 1 ? 0 : Number.NaN,
    variance:
      degrees > 2 ? degrees / (degrees - 2) : degrees > 1 ? Number.POSITIVE_INFINITY : Number.NaN,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => Math.exp(logNormalizer - ((degrees + 1) / 2) * Math.log(1 + (x * x) / degrees)),
    cdf,
    quantile: (p) => invertMonotone(cdf, p, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    sample: (random) => random.studentT(degrees),
  };
}

/** Snedecor's F distribution with numerator and denominator degrees of freedom. */
export function fisherF(d1: number, d2: number): ContinuousDistribution {
  check(d1 > 0 && d2 > 0, 'degrees must be positive');
  const logB = logBeta(d1 / 2, d2 / 2);
  const cdf = (x: number) =>
    x <= 0 ? 0 : regularizedBeta((d1 * x) / (d1 * x + d2), d1 / 2, d2 / 2);
  return {
    kind: 'continuous',
    name: 'F de Snedecor',
    mean: d2 > 2 ? d2 / (d2 - 2) : Number.NaN,
    variance: d2 > 4 ? (2 * d2 * d2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) ** 2 * (d2 - 4)) : Number.NaN,
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      if (x <= 0) return x === 0 && d1 < 2 ? Number.POSITIVE_INFINITY : 0;
      return Math.exp(
        0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2)) -
          Math.log(x) -
          logB,
      );
    },
    cdf,
    quantile: (p) => invertMonotone(cdf, p, 0, Number.POSITIVE_INFINITY),
    sample: (random) => random.chiSquare(d1) / d1 / (random.chiSquare(d2) / d2),
  };
}

export function lognormal(mu = 0, sigma = 1): ContinuousDistribution {
  check(sigma > 0, 'sigma must be positive');
  return {
    kind: 'continuous',
    name: 'Lognormal',
    mean: Math.exp(mu + (sigma * sigma) / 2),
    variance: (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma),
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) =>
      x <= 0
        ? 0
        : Math.exp(-((Math.log(x) - mu) ** 2) / (2 * sigma * sigma)) /
          (x * sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x) => (x <= 0 ? 0 : standardNormalCdf((Math.log(x) - mu) / sigma)),
    quantile: (p) => Math.exp(mu + sigma * standardNormalQuantile(p)),
    sample: (random) => Math.exp(random.normal(mu, sigma)),
  };
}

/** Weibull distribution with shape k and scale lambda. */
export function weibull(shape: number, scale = 1): ContinuousDistribution {
  check(shape > 0 && scale > 0, 'shape and scale must be positive');
  const g1 = Math.exp(logGamma(1 + 1 / shape));
  const g2 = Math.exp(logGamma(1 + 2 / shape));
  return {
    kind: 'continuous',
    name: 'Weibull',
    mean: scale * g1,
    variance: scale * scale * (g2 - g1 * g1),
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) =>
      x < 0 ? 0 : (shape / scale) * (x / scale) ** (shape - 1) * Math.exp(-((x / scale) ** shape)),
    cdf: (x) => (x <= 0 ? 0 : 1 - Math.exp(-((x / scale) ** shape))),
    quantile: (p) => scale * (-Math.log(1 - p)) ** (1 / shape),
    sample: (random) => scale * (-Math.log(1 - random.next())) ** (1 / shape),
  };
}

export function cauchy(location = 0, scale = 1): ContinuousDistribution {
  check(scale > 0, 'scale must be positive');
  return {
    kind: 'continuous',
    name: 'Cauchy',
    mean: Number.NaN,
    variance: Number.NaN,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => 1 / (Math.PI * scale * (1 + ((x - location) / scale) ** 2)),
    cdf: (x) => 0.5 + Math.atan((x - location) / scale) / Math.PI,
    quantile: (p) => location + scale * Math.tan(Math.PI * (p - 0.5)),
    sample: (random) => location + scale * Math.tan(Math.PI * (random.next() - 0.5)),
  };
}

export function laplace(location = 0, scale = 1): ContinuousDistribution {
  check(scale > 0, 'scale must be positive');
  const quantile = (p: number) =>
    p < 0.5 ? location + scale * Math.log(2 * p) : location - scale * Math.log(2 - 2 * p);
  return {
    kind: 'continuous',
    name: 'Laplace',
    mean: location,
    variance: 2 * scale * scale,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => Math.exp(-Math.abs(x - location) / scale) / (2 * scale),
    cdf: (x) =>
      x < location
        ? 0.5 * Math.exp((x - location) / scale)
        : 1 - 0.5 * Math.exp(-(x - location) / scale),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

export function logistic(location = 0, scale = 1): ContinuousDistribution {
  check(scale > 0, 'scale must be positive');
  const quantile = (p: number) => location + scale * Math.log(p / (1 - p));
  return {
    kind: 'continuous',
    name: 'Logística',
    mean: location,
    variance: (scale * scale * Math.PI * Math.PI) / 3,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      const e = Math.exp(-(x - location) / scale);
      return e / (scale * (1 + e) ** 2);
    },
    cdf: (x) => 1 / (1 + Math.exp(-(x - location) / scale)),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

/** Pareto (type I) distribution with minimum x_m and tail index alpha. */
export function pareto(minimum: number, alpha: number): ContinuousDistribution {
  check(minimum > 0 && alpha > 0, 'minimum and alpha must be positive');
  const quantile = (p: number) => minimum / (1 - p) ** (1 / alpha);
  return {
    kind: 'continuous',
    name: 'Pareto',
    mean: alpha > 1 ? (alpha * minimum) / (alpha - 1) : Number.POSITIVE_INFINITY,
    variance:
      alpha > 2
        ? (minimum * minimum * alpha) / ((alpha - 1) ** 2 * (alpha - 2))
        : Number.POSITIVE_INFINITY,
    support: [minimum, Number.POSITIVE_INFINITY],
    pdf: (x) => (x < minimum ? 0 : (alpha * minimum ** alpha) / x ** (alpha + 1)),
    cdf: (x) => (x < minimum ? 0 : 1 - (minimum / x) ** alpha),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

export function triangular(min: number, mode: number, max: number): ContinuousDistribution {
  check(min < max && mode >= min && mode <= max, 'requires min <= mode <= max and min < max');
  const width = max - min;
  const split = (mode - min) / width;
  const quantile = (p: number) =>
    p < split
      ? min + Math.sqrt(p * width * (mode - min))
      : max - Math.sqrt((1 - p) * width * (max - mode));
  return {
    kind: 'continuous',
    name: 'Triangular',
    mean: (min + mode + max) / 3,
    variance: (min * min + mode * mode + max * max - min * mode - min * max - mode * max) / 18,
    support: [min, max],
    pdf: (x) => {
      if (x < min || x > max) return 0;
      if (x < mode) return (2 * (x - min)) / (width * (mode - min));
      if (x === mode) return 2 / width;
      return (2 * (max - x)) / (width * (max - mode));
    },
    cdf: (x) => {
      if (x <= min) return 0;
      if (x >= max) return 1;
      if (x <= mode) return (x - min) ** 2 / (width * (mode - min));
      return 1 - (max - x) ** 2 / (width * (max - mode));
    },
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

export function rayleigh(sigma = 1): ContinuousDistribution {
  check(sigma > 0, 'sigma must be positive');
  const quantile = (p: number) => sigma * Math.sqrt(-2 * Math.log(1 - p));
  return {
    kind: 'continuous',
    name: 'Rayleigh',
    mean: sigma * Math.sqrt(Math.PI / 2),
    variance: ((4 - Math.PI) / 2) * sigma * sigma,
    support: [0, Number.POSITIVE_INFINITY],
    pdf: (x) => (x < 0 ? 0 : (x / (sigma * sigma)) * Math.exp(-(x * x) / (2 * sigma * sigma))),
    cdf: (x) => (x < 0 ? 0 : 1 - Math.exp(-(x * x) / (2 * sigma * sigma))),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}

/** Gumbel (maximum) distribution with location mu and scale beta. */
export function gumbel(location = 0, scale = 1): ContinuousDistribution {
  check(scale > 0, 'scale must be positive');
  const EULER_MASCHERONI = 0.5772156649015329;
  const quantile = (p: number) => location - scale * Math.log(-Math.log(p));
  return {
    kind: 'continuous',
    name: 'Gumbel',
    mean: location + scale * EULER_MASCHERONI,
    variance: (Math.PI * Math.PI * scale * scale) / 6,
    support: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
    pdf: (x) => {
      const z = (x - location) / scale;
      return Math.exp(-(z + Math.exp(-z))) / scale;
    },
    cdf: (x) => Math.exp(-Math.exp(-(x - location) / scale)),
    quantile,
    sample: (random) => quantile(random.next()),
  };
}
