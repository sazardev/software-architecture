export type DiagramContext = Readonly<{
  /**
  Último h2/h3 anterior al diagrama (la sección donde vive), si lo hay.
  */
  section: string | null;
  /**
  Título del artículo (el h1 de la página); cae al `document.title` si no hay.
  */
  title: string;
}>;

/**
Texto del encabezado sin el enlace ancla que le añade el pipeline (`#`).
*/
function headingText(heading: Element): string {
  const copy = heading.cloneNode(true) as Element;

  for (const anchor of copy.querySelectorAll('a[href^="#"]')) {
    anchor.remove();
  }

  const text = copy.textContent.replaceAll(/\s+/g, ' ').trim();

  return text.endsWith('#') ? text.slice(0, -1).trim() : text;
}

/**
Lee del DOM el contexto del diagrama (artículo y sección) para rotular el visor sin textos fijos.
*/
export function readDiagramContext(frame: Element): DiagramContext {
  const title = headingText(document.querySelector('article h1, main h1, h1') ?? document.body);
  let section: string | null = null;

  for (const heading of document.querySelectorAll('article h2, article h3, main h2, main h3')) {
    // Un encabezado nunca contiene al diagrama: si el diagrama lo sigue, la posición es exactamente FOLLOWING.
    if (heading.compareDocumentPosition(frame) !== Node.DOCUMENT_POSITION_FOLLOWING) {
      break;
    }

    section = headingText(heading);
  }

  return { section, title: title === '' ? document.title : title };
}
