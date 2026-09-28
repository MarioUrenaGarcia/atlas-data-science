export interface ChartBox {
  width: number;
  height: number;
  /** Inner plotting area after margins. */
  inner: { left: number; top: number; width: number; height: number };
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGINS: Margins = { top: 16, right: 20, bottom: 40, left: 52 };
