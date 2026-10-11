import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExerciseCard } from '@/components/molecules/ExerciseCard';

describe('ExerciseCard', () => {
  it('renderiza título, meta y contenido', () => {
    render(
      <ExerciseCard meta="15 minutos" title="Ejercicio 1: separa una responsabilidad">
        Extrae el cálculo puro a una función del dominio.
      </ExerciseCard>,
    );

    expect(screen.getByText('Ejercicio 1: separa una responsabilidad')).toBeDefined();
    expect(screen.getByText('15 minutos')).toBeDefined();
    expect(screen.getByText(/Extrae el cálculo puro/)).toBeDefined();
  });
});
