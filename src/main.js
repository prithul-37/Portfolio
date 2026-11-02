// Browser entry. Module scripts run after the document is parsed, so the
// rendered markup is already in place when these run.
import { initIntro } from './features/intro.js';
import { initTheme } from './features/theme.js';
import { initNav } from './features/nav.js';
import { initBands, initReveal } from './features/reveal.js';
import { initGallery } from './features/gallery.js';
import { initCopy, initCv } from './features/links.js';

// Release the load-in animations (held by html.anim-wait, set in index.html)
// once the faces they show have loaded, or after 2.5s at most, so a slow
// first visit still sees the intro and hero choreography from the start.
const fontsReady = Promise.all([
  document.fonts.load("320 1em 'Fraunces'"),
  document.fonts.load("italic 300 1em 'Fraunces'"),
  document.fonts.load("400 1em 'Familjen Grotesk'"),
]).catch(() => {});
const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
Promise.race([fontsReady, timeout]).then(() => {
  // Two frames: let the browser paint the swapped-in fonts before motion starts
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('anim-wait');
  }));
});

initIntro();
initCv();
initTheme();
initNav();
initReveal();
initBands();
initGallery();
initCopy();
