export type CopyResult = 'copied' | 'failed';

/**
Copia texto al portapapeles (API asíncrona; requiere contexto seguro, como Pages).
*/
export async function copyText(text: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(text);

    return 'copied';
  } catch {
    return 'failed';
  }
}

/**
Copia y, si funcionó, muestra el aviso.
*/
export async function copyWithToast(text: string, onCopied: () => void): Promise<void> {
  if ((await copyText(text)) === 'copied') {
    onCopied();
  }
}
