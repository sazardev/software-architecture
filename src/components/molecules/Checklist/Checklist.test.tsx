import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checklist } from '@/components/molecules/Checklist';

describe('Checklist', () => {
  it('renderiza la lista que recibe como hijos', () => {
    render(
      <Checklist>
        <ul>
          <li>Revisar el diff aditivo</li>
        </ul>
      </Checklist>,
    );

    expect(screen.getByText('Revisar el diff aditivo')).toBeDefined();
  });
});
