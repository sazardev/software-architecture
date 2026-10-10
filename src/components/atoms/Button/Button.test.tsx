import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/atoms';

describe('Button', () => {
  it('renderiza el contenido y dispara onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Guardar</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('aplica la variante solicitada', () => {
    render(<Button variant="secondary">Secundario</Button>);

    expect(screen.getByRole('button', { name: 'Secundario' })).toHaveClass('bg-neutral-200');
  });
});
