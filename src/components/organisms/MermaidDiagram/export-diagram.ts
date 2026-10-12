const SVG_NS = 'http://www.w3.org/2000/svg';
const PADDING = 40;
const MAX_SIDE = 8192;

type ExportSvg = Readonly<{ height: number; width: number; xml: string }>;

/**
Resuelve cualquier color CSS (oklch, color-mix…) a `rgb(r, g, b)` pasando por un canvas.
*/
function toRgb(color: string): string {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });

  if (context === null) {
    return color;
  }

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;

  return `rgb(${red}, ${green}, ${blue})`;
}

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
El SVG exportado debe ser autónomo: sustituye las variables CSS del sitio por valores
concretos y convierte `color-mix()` (poco portable) en rgba.
*/
function inlineStyles(css: string): string {
  return css
    .replaceAll(/var\((--[\w-]+)\)/g, (_match, name: string) =>
      name.startsWith('--font-') ? readToken(name) : toRgb(readToken(name)),
    )
    .replaceAll(
      /color-mix\(in oklab, rgb\((\d+), (\d+), (\d+)\) (\d+)%, transparent\)/g,
      (_match, red: string, green: string, blue: string, percent: string) =>
        `rgba(${red}, ${green}, ${blue}, ${Number(percent) / 100})`,
    );
}

type Line = { top: number; words: string[] };

/**
Líneas de texto tal como las partió el navegador dentro de una etiqueta HTML (agrupa palabras por altura).
*/
function labelLines(label: SVGForeignObjectElement): { element: Element | null; lines: string[] } {
  const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
  const lines: Line[] = [];
  let element: Element | null = null;

  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    element ??= node.parentElement;

    const words = (node.textContent ?? '').matchAll(/\S+/g);

    for (const word of words) {
      const range = document.createRange();

      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);

      const { height, top } = range.getBoundingClientRect();
      const line = lines.find((candidate) => Math.abs(candidate.top - top) < height / 2);

      if (line === undefined) {
        lines.push({ top, words: [word[0]] });
      } else {
        line.words.push(word[0]);
      }
    }
  }

  return {
    element,
    lines: lines.toSorted((a, b) => a.top - b.top).map((line) => line.words.join(' ')),
  };
}

const LINE_HEIGHT = 1.25;

/**
Sustituye cada etiqueta `foreignObject` (HTML) por `<text>` SVG puro. Chrome marca como "tainted"
los canvas que dibujan SVG con foreignObject (PNG imposible) y los editores de vectores no los leen bien.
`live` y `clone` deben tener la misma estructura: se recorren en paralelo.
*/
function flattenLabels(live: SVGSVGElement, clone: SVGSVGElement): void {
  const originals = [...live.querySelectorAll('foreignObject')];
  const copies = [...clone.querySelectorAll('foreignObject')];

  for (const [index, copy] of copies.entries()) {
    const original = originals[index];

    if (original === undefined) {
      continue;
    }

    const { element, lines } = labelLines(original);
    const style = element === null ? null : getComputedStyle(element);
    const width = Number(copy.getAttribute('width')) || original.getBBox().width;
    const height = Number(copy.getAttribute('height')) || original.getBBox().height;
    const group = document.createElementNS(SVG_NS, 'g');

    if (copy.closest('.edgeLabel') !== null) {
      const background = document.createElementNS(SVG_NS, 'rect');

      background.setAttribute('width', String(width));
      background.setAttribute('height', String(height));
      background.setAttribute('fill', toRgb(readToken('--color-brand-900')));
      group.append(background);
    }

    const text = document.createElementNS(SVG_NS, 'text');

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', style?.color ?? '#fff');
    text.setAttribute('font-family', style?.fontFamily ?? 'sans-serif');
    text.setAttribute('font-size', style?.fontSize ?? '14px');
    text.setAttribute('letter-spacing', style?.letterSpacing ?? 'normal');
    text.setAttribute('x', String(width / 2));
    text.setAttribute('y', String(height / 2));

    for (const [lineIndex, value] of lines.entries()) {
      const span = document.createElementNS(SVG_NS, 'tspan');

      span.setAttribute('x', String(width / 2));
      span.setAttribute(
        'dy',
        `${lineIndex === 0 ? (-(lines.length - 1) / 2) * LINE_HEIGHT : LINE_HEIGHT}em`,
      );
      span.textContent = value;
      text.append(span);
    }

    group.append(text);
    copy.replaceWith(group);
  }
}

function backgroundLayer(box: DOMRect, id: string): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g');
  const grid = (size: number, opacity: number) => `
    <pattern height="${size}" id="${id}-${size}" patternUnits="userSpaceOnUse" width="${size}">
      <path d="M${size} 0H0V${size}" fill="none" stroke="#fff" stroke-opacity="${opacity}"/>
    </pattern>`;

  group.innerHTML = `
    <defs>${grid(24, 0.07)}${grid(96, 0.14)}</defs>
    <rect fill="${toRgb(readToken('--color-brand-900'))}" height="${box.height}" width="${box.width}" x="${box.x}" y="${box.y}"/>
    <rect fill="url(#${id}-24)" height="${box.height}" width="${box.width}" x="${box.x}" y="${box.y}"/>
    <rect fill="url(#${id}-96)" height="${box.height}" width="${box.width}" x="${box.x}" y="${box.y}"/>`;

  return group;
}

/**
Serializa el SVG vivo (con la disposición actual) como imagen autónoma con fondo de plano.
Debe llamarse con el SVG en el DOM: usa `getBBox()` para encuadrar lo que haya en pantalla.
*/
function buildExportSvg(svg: SVGSVGElement): ExportSvg {
  const content = svg.getBBox();
  const box = new DOMRect(
    content.x - PADDING,
    content.y - PADDING,
    content.width + PADDING * 2,
    content.height + PADDING * 2,
  );
  const clone = svg.cloneNode(true) as SVGSVGElement;

  flattenLabels(svg, clone);

  for (const flow of clone.querySelectorAll('path.animate-flow')) {
    flow.remove();
  }

  for (const animated of clone.querySelectorAll('.animate-fade')) {
    animated.classList.remove('animate-fade');
    animated.removeAttribute('style');
  }

  for (const style of clone.querySelectorAll('style')) {
    style.textContent = inlineStyles(style.textContent);
  }

  clone.removeAttribute('class');
  clone.removeAttribute('style');
  clone.setAttribute('xmlns', SVG_NS);
  clone.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
  clone.setAttribute('width', String(Math.ceil(box.width)));
  clone.setAttribute('height', String(Math.ceil(box.height)));
  clone.prepend(backgroundLayer(box, `bp-${crypto.randomUUID().slice(0, 8)}`));

  return {
    height: Math.ceil(box.height),
    width: Math.ceil(box.width),
    xml: new XMLSerializer().serializeToString(clone),
  };
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadSvg(svg: SVGSVGElement, filename: string): void {
  const { xml } = buildExportSvg(svg);

  download(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }), `${filename}.svg`);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('error', () => {
      reject(new Error('No se pudo rasterizar el SVG'));
    });
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('El navegador no permitió exportar el canvas'));
      } else {
        resolve(blob);
      }
    }, 'image/png');
  });
}

/**
PNG a 2× (o menos si el diagrama es enorme) para que se vea nítido al ampliarlo.
*/
export async function downloadPng(svg: SVGSVGElement, filename: string): Promise<void> {
  const { height, width, xml } = buildExportSvg(svg);
  const scale = Math.min(2, MAX_SIDE / Math.max(width, height));
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = await loadImage(url);
    const canvas = document.createElement('canvas');

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
    download(await canvasToBlob(canvas), `${filename}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}
