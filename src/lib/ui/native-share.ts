/**
Hoja nativa de compartir; cancelar el diálogo no es un error.
*/
export async function nativeShare(data: ShareData): Promise<void> {
  try {
    await navigator.share(data);
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      throw error;
    }
  }
}
