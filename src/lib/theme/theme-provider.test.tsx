import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTheme } from '@/lib/theme/theme-context';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { THEME_STORAGE_KEY } from '@/lib/theme/themes';

function Probe() {
  const { preference, resolvedTheme, setPreference } = useTheme();

  return (
    <button
      onClick={() => {
        setPreference('dark');
      }}
      type="button"
    >
      {preference}:{resolvedTheme}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    localStorage.clear();
  });

  it('aplica y persiste el tema elegido', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(document.documentElement).not.toHaveClass('dark');

    fireEvent.click(screen.getByRole('button'));

    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('lee la preferencia persistida al montar', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('light:light');
  });
});
