import eslint from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import checkFile from 'eslint-plugin-check-file';
import { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { configs as tseslintConfigs } from 'typescript-eslint';

const architectureZones = [
  {
    target: './src/components/atoms',
    from: [
      './src/components/molecules',
      './src/components/organisms',
      './src/components/templates',
    ],
    message: 'Los átomos no pueden depender de capas superiores.',
  },
  {
    target: './src/components/molecules',
    from: ['./src/components/organisms', './src/components/templates'],
    message: 'Las moléculas solo pueden depender de átomos, moléculas y lib.',
  },
  {
    target: './src/components/organisms',
    from: ['./src/components/templates'],
    message: 'Los organismos no pueden depender de plantillas.',
  },
  {
    target: './src/lib',
    from: ['./src/components', './src/features', './src/mdx', './src/app', './src/routes'],
    message: 'lib debe permanecer independiente de cualquier capa superior.',
  },
  {
    target: './src/components',
    from: ['./src/features', './src/mdx', './src/app', './src/routes'],
    message: 'Los componentes son solo presentación; features, mdx, app y routes los componen.',
  },
  {
    target: './src/features',
    from: ['./src/app', './src/routes'],
    message: 'Las features no pueden depender de app ni routes.',
  },
  {
    target: './src/mdx',
    from: ['./src/app', './src/routes'],
    message: 'mdx no puede depender de app ni routes.',
  },
];

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'reports/**', 'src/routeTree.gen.ts'],
  },
  eslint.configs.recommended,
  ...tseslintConfigs.strictTypeChecked,
  ...tseslintConfigs.stylisticTypeChecked,
  importXFlatConfigs.recommended,
  importXFlatConfigs.typescript,
  unicorn.configs.recommended,
  sonarjsConfigs.recommended,
  react.configs['strict-type-checked'],
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/internal-regex': '^@/',
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
        }),
      ],
    },
    rules: {
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../*'],
              message: 'Usa el alias @/ en lugar de rutas relativas profundas.',
            },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'import-x/no-restricted-paths': [
        'error',
        {
          basePath: import.meta.dirname,
          zones: architectureZones,
        },
      ],
      'import-x/no-unresolved': ['error', { ignore: [String.raw`\.css$`, String.raw`\.mdx$`] }],
      'import-x/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'always',
          pathGroups: [{ group: 'internal', pattern: '@/**', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'unicorn/filename-case': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-null': 'off',
      '@eslint-react/naming-convention-ref-name': 'off',
    },
  },
  {
    files: ['*.config.ts', 'tools/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/super-linear-regex': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-top-level-side-effects': 'off',
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.ts'],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
    },
  },
  {
    files: ['src/app/router.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },
  {
    files: ['src/routes/**/*.tsx'],
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
  {
    files: ['src/components/**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*.tsx': 'PASCAL_CASE' }],
    },
  },
  {
    files: ['src/lib/**/*.ts'],
    ignores: ['**/*.test.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*.ts': 'KEBAB_CASE' }],
    },
  },
]);
