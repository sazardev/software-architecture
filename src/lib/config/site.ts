const fallbackUrl = 'https://software-architecture.example.com';

function readSiteUrl(): string {
  const fromEnv: unknown = import.meta.env.VITE_SITE_URL;

  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : fallbackUrl;
}

export const site = {
  name: 'Software Architecture',
  url: readSiteUrl(),
} as const;
