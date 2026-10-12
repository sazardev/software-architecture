const typingElementTags = new Set(['INPUT', 'SELECT', 'TEXTAREA']);

/**
Indica si el evento viene de un control donde se escribe (para no robar atajos de teclado).
*/
export function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || typingElementTags.has(target.tagName))
  );
}
