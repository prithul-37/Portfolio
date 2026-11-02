import { defineConfig } from 'vite';
import renderHtml from './plugins/render-html.js';

export default defineConfig({
  // Relative asset URLs, so the build works both on the custom domain
  // (prithul.lol, via public/CNAME) and under the github.io /Portfolio/ subpath.
  base: './',
  plugins: [renderHtml()],
  build: {
    outDir: 'dist',
    // Keep every asset a real file: gallery thumbnails are reused across
    // entries, and inlining them as base64 would repeat them in the JS.
    assetsInlineLimit: 0,
  },
  server: {
    // Exclude vendored skill folders from the dev server's file watcher
    watch: { ignored: ['**/.claude/**', '**/.agents/**'] },
  },
});
