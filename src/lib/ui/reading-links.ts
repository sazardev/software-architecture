const MAX_FRAGMENT_WORDS = 8;
const EDGE_WORDS = 4;

/**
URL actual sin hash, para construir enlaces compartibles.
*/
export function pageUrl(location: Pick<Location, 'origin' | 'pathname'>): string {
  return `${location.origin}${location.pathname}`;
}

function encodeFragmentPart(value: string): string {
  return encodeURIComponent(value).replaceAll('-', '%2D');
}

/**
Enlace con "text fragment" (#:~:text=): el navegador resalta y desplaza hasta la
selección. Si es larga se usa la forma inicio,fin con las primeras y últimas palabras.
*/
export function textFragmentUrl(baseUrl: string, selection: string): string {
  const words = selection.trim().split(/\s+/);

  if (words.length <= MAX_FRAGMENT_WORDS) {
    return `${baseUrl}#:~:text=${encodeFragmentPart(words.join(' '))}`;
  }

  const start = words.slice(0, EDGE_WORDS).join(' ');
  const end = words.slice(-EDGE_WORDS).join(' ');

  return `${baseUrl}#:~:text=${encodeFragmentPart(start)},${encodeFragmentPart(end)}`;
}

type QuoteSource = Readonly<{
  siteName: string;
  title: string;
  url: string;
}>;

/**
Cita lista para pegar: texto entrecomillado, fuente y enlace al fragmento.
*/
export function buildQuote(selection: string, source: QuoteSource): string {
  const text = selection.trim().replaceAll(/\s+/g, ' ');

  return `“${text}”\n— ${source.title}, ${source.siteName}\n${textFragmentUrl(source.url, text)}`;
}

/**
Enlace para abrir un issue de GitHub con la selección citada.
*/
export function commentIssueUrl(repo: string, selection: string, source: QuoteSource): string {
  const text = selection.trim().replaceAll(/\s+/g, ' ');
  const body = `> ${text}\n\n${textFragmentUrl(source.url, text)}\n\n`;
  const params = new URLSearchParams({ body, title: `Comentario: ${source.title}` });

  return `${repo}/issues/new?${params.toString()}`;
}

type ShareTarget = 'email' | 'linkedin' | 'x';

/**
URLs de compartir en redes; abren en pestaña nueva (sin SDKs ni trackers).
*/
export function shareUrl(target: ShareTarget, url: string, title: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (target) {
    case 'x': {
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    }
    case 'linkedin': {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    case 'email': {
      return `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`;
    }
  }
}

/**
Ruta del archivo MDX en el repositorio, para "Editar en GitHub".
*/
export function editUrl(repo: string, locale: string, slug: string): string {
  return `${repo}/edit/main/src/content/docs/${locale}/${slug}.mdx`;
}
