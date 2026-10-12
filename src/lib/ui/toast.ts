export const TOAST_EVENT = 'sa:toast';

/**
Muestra un aviso breve (lo pinta el componente Toaster del shell).
*/
export function showToast(message: string): void {
  dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}
