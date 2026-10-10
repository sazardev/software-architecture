import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{ts,tsx}': ['eslint --fix --max-warnings 0 --no-warn-ignored', 'prettier --write'],
  '*.{css,md,mdx,html,json,jsonc,yml,yaml}': ['prettier --write'],
};

export default config;
