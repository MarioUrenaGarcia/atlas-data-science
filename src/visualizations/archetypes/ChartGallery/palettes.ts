import { interpolateRgb } from 'd3-interpolate';

export type PaletteId = 'secuencial' | 'divergente' | 'categorica' | 'arcoiris';

const SEQUENTIAL = interpolateRgb('#eef4fb', '#0b3d75');
const DIVERGING_LOW = interpolateRgb('#b2182b', '#f4f4f4');
const DIVERGING_HIGH = interpolateRgb('#f4f4f4', '#2166ac');
const CATEGORICAL = [
  'rgb(27, 158, 119)',
  'rgb(217, 95, 2)',
  'rgb(117, 112, 179)',
  'rgb(231, 41, 138)',
  'rgb(102, 166, 30)',
  'rgb(230, 171, 2)',
];

export const PALETTE_NAMES: Record<PaletteId, string> = {
  secuencial: 'Secuencial (un tono, de claro a oscuro)',
  divergente: 'Divergente (dos tonos desde un centro)',
  categorica: 'Categórica (tonos distintos sin orden)',
  arcoiris: 'Arcoíris (todo el espectro)',
};

function rgbString(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}

/**
 * Color for a value given the data range. Sequential and rainbow palettes map
 * the range linearly; the diverging palette is centered on `center`; the
 * categorical palette cuts the range into as many classes as it has hues.
 */
export function paletteColor(
  palette: PaletteId,
  value: number,
  min: number,
  max: number,
  center: number,
): string {
  const t = max > min ? (value - min) / (max - min) : 0.5;
  switch (palette) {
    case 'secuencial':
      return SEQUENTIAL(t);
    case 'divergente': {
      const span = Math.max(center - min, max - center) || 1;
      const u = (value - center) / span;
      return u < 0 ? DIVERGING_LOW(1 + u) : DIVERGING_HIGH(u);
    }
    case 'categorica':
      return (
        CATEGORICAL[Math.min(CATEGORICAL.length - 1, Math.floor(t * CATEGORICAL.length))] ?? '#888'
      );
    case 'arcoiris': {
      const [r, g, b] = hslToRgb(270 - 270 * t, 0.9, 0.5);
      return rgbString(r, g, b);
    }
  }
}

/** Gray with the same relative luminance, to check whether lightness follows the data. */
export function toGray(color: string): string {
  const match = /rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(color);
  if (!match) return color;
  const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return rgbString(y, y, y);
}

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (v: number) => {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return 255 * Math.max(0, Math.min(1, c));
};

/**
 * Approximate appearance for a person with deuteranopia, the most common form
 * of red and green color blindness, using the linear RGB projection of
 * Vienot, Brettel and Mollon (1999).
 */
export function toDeuteranopia(color: string): string {
  const match = /rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(color);
  if (!match) return color;
  const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])].map(toLinear) as [
    number,
    number,
    number,
  ];
  const rg = 0.29031 * r + 0.70969 * g;
  return rgbString(fromLinear(rg), fromLinear(rg), fromLinear(-0.02197 * r + 0.02197 * g + b));
}
