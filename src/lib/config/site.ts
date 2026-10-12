const fallbackUrl = 'https://software-architecture.example.com';

function readSiteUrl(): string {
  const fromEnv: unknown = import.meta.env.VITE_SITE_URL;

  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : fallbackUrl;
}

export const site = {
  name: 'Software Architecture',
  /**
  Repositorio público: origen de "Editar en GitHub" y de los comentarios.
  */
  repo: 'https://github.com/sazardev/software-architecture',
  url: readSiteUrl(),
} as const;
