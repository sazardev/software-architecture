import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCommandPalette } from '@/lib/search/palette-context';
import { CommandPaletteProvider } from '@/lib/search/palette-provider';

function Probe() {
  const { initialQuery, isOpen, open } = useCommandPalette();

  return (
    <>
      <output>{isOpen ? `abierta:${initialQuery}` : 'cerrada'}</output>
      <input aria-label="campo" />
      <button
        onClick={() => {
          open('#solid');
        }}
        type="button"
      >
        abrir
      </button>
    </>
  );
}

function setup() {
  render(
    <CommandPaletteProvider>
      <Probe />
    </CommandPaletteProvider>,
  );
}

describe('CommandPaletteProvider', () => {
  it('empieza cerrada y se abre con una consulta inicial', () => {
    setup();

    expect(screen.getByRole('status')).toHaveTextContent('cerrada');

    fireEvent.click(screen.getByRole('button', { name: 'abrir' }));

    expect(screen.getByRole('status')).toHaveTextContent('abierta:#solid');
  });

  it('Ctrl+K y ⌘K alternan la paleta', () => {
    setup();

    fireEvent.keyDown(document, { ctrlKey: true, key: 'k' });
    expect(screen.getByRole('status')).toHaveTextContent('abierta:');

    fireEvent.keyDown(document, { key: 'K', metaKey: true });
    expect(screen.getByRole('status')).toHaveTextContent('cerrada');
  });

  it('la barra abre la paleta salvo que se esté escribiendo', () => {
    setup();

    fireEvent.keyDown(screen.getByLabelText('campo'), { key: '/' });
    expect(screen.getByRole('status')).toHaveTextContent('cerrada');

    fireEvent.keyDown(document.body, { key: '/' });
    expect(screen.getByRole('status')).toHaveTextContent('abierta:');
  });
});
