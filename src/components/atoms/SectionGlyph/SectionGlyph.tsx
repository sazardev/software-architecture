import { cn } from '@/lib/utils/cn';

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
}

/**
Glifos de línea tipo plano. Añadir uno aquí lo deja disponible para `icon` en la taxonomía.
*/
const glyphs: Record<string, string> = {
  cloud: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 8.5 4.5 4.5 0 0 1 17.5 18H7Z',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4M13.5 5l-3 14',
  compass: `${circle(12, 12, 9)}m3.5-3.5-2 5-5 2 2-5 5-2Z`,
  cube: 'M12 3 4 7.5v9L12 21l8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9',
  database:
    'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  flask: 'M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3M7.5 15h9',
  gauge: 'M4 17a8 8 0 1 1 16 0M12 17l4-5M6 17h2M16 17h2',
  gear: `${circle(12, 12, 3)}M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1`,
  layers: 'M12 3 3 7.5 12 12l9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5',
  nodes: `${circle(5, 6, 2)}${circle(19, 6, 2)}${circle(12, 19, 2)}M7 6h10M6.3 7.6l4.4 9.3M17.7 7.6l-4.4 9.3`,
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Zm-3 9 2.2 2.2L15.5 9.8',
};

const glyphNames = Object.keys(glyphs);

function hashId(id: string): number {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash += id.codePointAt(index) ?? 0;
  }

  return hash;
}

// Sin `icon` válido, cada tema recibe siempre el mismo glifo derivado de su id.
function resolveGlyph(id: string, icon = ''): string {
  const fallbackName = glyphNames[hashId(id) % glyphNames.length] ?? 'layers';

  return glyphs[icon] ?? glyphs[fallbackName] ?? '';
}

type SectionGlyphProps = Readonly<{
  className?: string;
  icon?: string | undefined;
  id: string;
}>;

export function SectionGlyph({ className, icon, id }: SectionGlyphProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      viewBox="0 0 24 24"
    >
      <path d={resolveGlyph(id, icon)} />
    </svg>
  );
}
