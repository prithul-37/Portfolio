// Assembles the page. Loaded by plugins/render-html.js, which injects these
// strings into index.html at the <!--app:head--> and <!--app:body--> markers.
import { renderHead } from './head.js';
import { renderFooter, renderIntro, renderNav } from './layout.js';
import { renderHero } from './hero.js';
import { renderGameModals, renderWork } from './work.js';
import { renderAbout, renderContact, renderPath, renderStack } from './sections.js';

// Section order drives the nav, the anchors and the "01 · …" eyebrow numbers.
// Nav labels differ from the anchor ids on purpose (Stack → #skills, Path → #experience).
const SECTIONS = [
  { id: 'work', nav: 'Work', render: renderWork },
  { id: 'about', nav: 'About', render: renderAbout },
  { id: 'skills', nav: 'Stack', render: renderStack },
  { id: 'experience', nav: 'Path', render: renderPath },
  { id: 'contact', nav: 'Contact', render: renderContact },
];

export { renderHead };

export function renderBody() {
  return [
    renderIntro(),
    renderNav(SECTIONS),
    renderHero(),
    ...SECTIONS.map((s, i) => s.render(i + 1)),
    renderFooter(),
    renderGameModals(),
  ].join('\n');
}
