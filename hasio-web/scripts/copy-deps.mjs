/**
 * Prebuild script: copies shared files from parent project into hasio-web
 * so Vercel builds work (Vercel can't access files outside project root).
 *
 * Copies:
 *   ../convex/_generated/ → ./convex-local/_generated/
 *   ../constants/         → ./constants-local/
 */

import { cpSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const copies = [
  {
    src: resolve(root, '../convex/_generated'),
    dest: resolve(root, 'convex-local/_generated'),
  },
  {
    src: resolve(root, '../constants'),
    dest: resolve(root, 'constants-local'),
  },
];

for (const { src, dest } of copies) {
  if (existsSync(src)) {
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
    console.log(`Copied ${src} → ${dest}`);
  } else {
    console.warn(`Warning: ${src} not found, skipping`);
  }
}

console.log('Prebuild copy complete.');
