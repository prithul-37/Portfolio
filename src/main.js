// Browser entry. Module scripts run after the document is parsed, so the
// rendered markup is already in place when these run.
import { initIntro } from './features/intro.js';
import { initTheme } from './features/theme.js';
import { initNav } from './features/nav.js';
import { initBands, initReveal } from './features/reveal.js';
import { initGallery } from './features/gallery.js';
import { initCopy, initCv } from './features/links.js';

initIntro();
initCv();
initTheme();
initNav();
initReveal();
initBands();
initGallery();
initCopy();
