import { join } from 'node:path';

type IconTarget = {
  input: string;
  output: string;
  size: number;
};

const projectRoot = join(import.meta.dir, '..', '..');
const iconsDir = join(projectRoot, 'public', 'icons');
const publicDir = join(projectRoot, 'public');

const targets: IconTarget[] = [
  { input: 'icon.svg', output: 'icon-192.png', size: 192 },
  { input: 'icon.svg', output: 'icon-512.png', size: 512 },
  { input: 'icon-maskable.svg', output: 'icon-maskable-512.png', size: 512 },
  { input: 'icon-maskable.svg', output: 'apple-touch-icon.png', size: 180 },
];

for (const target of targets) {
  const outputPath = target.output === 'apple-touch-icon.png' ? publicDir : iconsDir;
  const result = Bun.spawnSync([
    'rsvg-convert',
    '--width',
    String(target.size),
    '--height',
    String(target.size),
    '--output',
    join(outputPath, target.output),
    join(iconsDir, target.input),
  ]);

  if (result.exitCode !== 0) {
    throw new Error(`rsvg-convert falló para ${target.output}: ${result.stderr.toString()}`);
  }

  console.log(`✔ ${target.output} (${target.size}px)`);
}
