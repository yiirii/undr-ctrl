import { build } from 'esbuild';
import fs from 'node:fs';
await build({ entryPoints: ['electron/main.ts', 'electron/preload.ts'], outdir: 'dist-electron', bundle: true, platform: 'node', format: 'cjs', target: 'node20', external: ['electron'], sourcemap: false, logLevel: 'warning' });
fs.copyFileSync('build/icon.png', 'dist-electron/icon.png');
fs.copyFileSync('build/tray.png', 'dist-electron/tray.png');
console.log('electron built');
