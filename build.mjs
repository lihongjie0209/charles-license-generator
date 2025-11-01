import * as esbuild from 'esbuild';

// Build for browser
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  outfile: 'docs/bundle.js',
  format: 'iife',
  globalName: 'CharlesLicense',
  platform: 'browser',
});

console.log('✅ Build complete! Bundle created at docs/bundle.js');
