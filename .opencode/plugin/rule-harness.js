// Harness agresivo del repositorio: bloquea en seco las violaciones que la buena
// voluntad no puede impedir. Lanzar un Error dentro de `tool.execute.before`
// aborta la llamada a la herramienta en curso.

const GENERATED_FILES = ['src/routeTree.gen.ts', 'src/content/index.gen.json'];

const FORBIDDEN_BASH = [
  {
    pattern: /(^|[;&|]\s*|\s+)(npm|yarn|pnpm|npx)(\s|$)/,
    reason: 'prohibido npm/yarn/pnpm/npx: este repo usa Bun. Usa `bun` o `bunx`.',
  },
  {
    pattern: /--no-verify/,
    reason:
      'prohibido --no-verify: los hooks (lint-staged, commitlint, pre-push) son obligatorios.',
  },
  {
    pattern: /git\s+push[^&;|]*--force/,
    reason: 'prohibido force-push: repara el historial con commits nuevos.',
  },
  {
    pattern: /\brm\s+-rf?\s+(\/(\s|$|\*)|~(\s|$|\/))/,
    reason: 'prohibido borrado destructivo en raíz o home.',
  },
  {
    test: hasInvalidCommitMessage,
    reason:
      'commit no convencional: usa `tipo(scope): descripción` con feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert.',
  },
];

function isGeneratedFile(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) return false;
  const normalized = filePath.replaceAll('\\', '/');
  return GENERATED_FILES.some(
    (generated) => normalized === generated || normalized.endsWith(`/${generated}`),
  );
}

function hasInvalidCommitMessage(command) {
  const quoted = /(^|[;&|]\s*)git\s+commit\b[^&;|]*?-m\s+("([^"]*)"|'([^']*)')/.exec(command);
  if (!quoted) return false;
  const text = quoted[3] ?? quoted[4] ?? '';
  return !/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: .+/.test(
    text,
  );
}

export const RuleHarness = async () => {
  return {
    'tool.execute.before': async (input, output) => {
      const args = output.args ?? {};
      if ((input.tool === 'edit' || input.tool === 'write') && isGeneratedFile(args.filePath)) {
        throw new Error(
          `HARNESS: ${args.filePath} es un archivo generado y no se edita a mano. ` +
            `Regenéralo (bun run content:index / build del router) en lugar de modificarlo.`,
        );
      }
      if (input.tool === 'bash' && typeof args.command === 'string') {
        for (const rule of FORBIDDEN_BASH) {
          const hit =
            typeof rule.test === 'function'
              ? rule.test(args.command)
              : rule.pattern.test(args.command);
          if (hit) {
            throw new Error(`HARNESS: ${rule.reason}`);
          }
        }
      }
    },
  };
};
