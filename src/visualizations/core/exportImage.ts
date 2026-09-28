const STYLE_PROPERTIES = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-dasharray',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'text-anchor',
  'dominant-baseline',
] as const;

function triggerDownload(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

/**
 * Serializes an SVG with its computed styles inlined, so colors defined with
 * CSS variables and theme classes survive outside the page.
 */
export function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const sourceNodes = [svg, ...svg.querySelectorAll('*')];
  const targetNodes = [clone, ...clone.querySelectorAll('*')];
  sourceNodes.forEach((source, index) => {
    const target = targetNodes[index];
    if (!(target instanceof SVGElement) || !(source instanceof SVGElement)) return;
    const computed = getComputedStyle(source);
    const declarations = STYLE_PROPERTIES.map(
      (property) => `${property}:${computed.getPropertyValue(property)}`,
    );
    target.setAttribute('style', declarations.join(';'));
  });
  const { width, height } = svg.getBoundingClientRect();
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(Math.round(width)));
  clone.setAttribute('height', String(Math.round(height)));
  const background = getComputedStyle(document.body).backgroundColor;
  clone.insertAdjacentHTML('afterbegin', `<rect width="100%" height="100%" fill="${background}"/>`);
  return new XMLSerializer().serializeToString(clone);
}

export function downloadSvg(svg: SVGSVGElement, fileName: string): void {
  const blob = new Blob([serializeSvg(svg)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, fileName);
  URL.revokeObjectURL(url);
}

/** Renders the visualization (SVG or canvas) to a PNG at twice the screen resolution. */
export async function downloadPng(
  element: SVGSVGElement | HTMLCanvasElement,
  fileName: string,
): Promise<void> {
  if (element instanceof HTMLCanvasElement) {
    triggerDownload(element.toDataURL('image/png'), fileName);
    return;
  }
  const { width, height } = element.getBoundingClientRect();
  const scale = 2;
  const image = new Image();
  const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serializeSvg(element))}`;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('image'));
    image.src = source;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext('2d');
  if (!context) return;
  context.scale(scale, scale);
  context.drawImage(image, 0, 0, width, height);
  triggerDownload(canvas.toDataURL('image/png'), fileName);
}
