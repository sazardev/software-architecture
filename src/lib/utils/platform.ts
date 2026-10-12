/**
Detecta plataformas Apple para mostrar `⌘` en vez de `Ctrl` en los atajos.
*/
export function isApplePlatform(): boolean {
  return typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
}
