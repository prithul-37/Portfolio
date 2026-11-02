// Vite plugin: renders the page from src/templates + src/content into
// index.html, at the <!--app:head--> and <!--app:body--> markers.
//
// It runs as a `pre` HTML transform, i.e. before Vite processes the HTML, so
// every asset URL the templates emit (/src/assets/...) is still picked up,
// bundled and rewritten to its hashed name, exactly as if it were hand-written.
//
// Dev: templates are loaded through the dev server's module graph, so editing
// any content or template file re-renders on the next request; the plugin
// forces a full page reload when one changes.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ENTRY = '/src/templates/page.js';
const WATCHED = ['/src/templates/', '/src/content/'];

export default function renderHtml() {
  let server = null;
  let root = process.cwd();

  async function loadPage() {
    if (server) return server.ssrLoadModule(ENTRY);
    // Build: plain Node import (the project is "type": "module")
    return import(pathToFileURL(path.join(root, ENTRY)).href);
  }

  return {
    name: 'render-html',

    configResolved(config) { root = config.root; },
    configureServer(s) { server = s; },

    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const page = await loadPage();
        const missing = ['<!--app:head-->', '<!--app:body-->'].filter((m) => !html.includes(m));
        if (missing.length) throw new Error(`[render-html] index.html is missing ${missing.join(' and ')}`);
        return html
          .replace('<!--app:head-->', () => page.renderHead())
          .replace('<!--app:body-->', () => page.renderBody());
      },
    },

    // Content/template edits change the HTML itself, which HMR can't patch
    handleHotUpdate({ file, server: s }) {
      const rel = '/' + path.relative(root, file).split(path.sep).join('/');
      if (WATCHED.some((dir) => rel.startsWith(dir))) {
        s.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}
