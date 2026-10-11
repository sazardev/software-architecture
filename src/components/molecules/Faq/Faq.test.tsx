import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Faq, FaqItem } from '@/components/molecules/Faq';

describe('Faq', () => {
  it('renderiza preguntas y respuestas colapsables', () => {
    render(
      <Faq>
        <FaqItem question="¿Tengo que aplicar los cinco principios siempre?">
          No. Aplica el que alivie el dolor actual.
        </FaqItem>
      </Faq>,
    );

    expect(screen.getByText('¿Tengo que aplicar los cinco principios siempre?')).toBeDefined();
    expect(screen.getByText(/Aplica el que alivie/)).toBeDefined();
  });
});
