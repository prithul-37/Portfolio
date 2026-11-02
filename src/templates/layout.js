// Page chrome: navbar, footer and the mobile CV button.
import { profile } from '../content/profile.js';
import { esc, icon, join } from './html.js';

// One span per letter (with --i for staggering), for the intro and the wordmark
const letters = (text) =>
  [...text].map((ch, i) => `<span aria-hidden="true" style="--i:${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');

// Label twice, stacked: on hover the first rolls up and the copy rolls in
const roll = (label) =>
  `<span class="roll"><span>${label}</span><span aria-hidden="true">${label}</span></span>`;

// Full-screen welcome overlay. Hidden unless the inline head script set
// data-intro on <html>; features/intro.js removes it once it has slid away.
export function renderIntro(word = 'Welcome') {
  return `
    <div class="intro" aria-hidden="true">
      <p class="intro-word">${letters(word)}</p>
    </div>`;
}

export function renderNav(sections) {
  const links = sections.map((s) => `<li><a href="#${s.id}">${roll(esc(s.nav))}</a></li>`);
  return `
    <!-- Drives the navbar's scrolled state via IntersectionObserver -->
    <span id="nav-sentinel" aria-hidden="true"></span>

    <nav class="navbar" id="navbar">
      <div class="nav-inner">
        <a href="#home" class="wordmark" aria-label="${esc(profile.shortName)}">${letters(`${profile.firstName} ${profile.lastName}`)}</a>
        <button class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
          <i class="ph-light ph-moon icon-moon" aria-hidden="true"></i>
          <i class="ph-light ph-sun icon-sun" aria-hidden="true"></i>
        </button>
        <button class="hamburger" type="button" aria-label="Menu" aria-expanded="false">
          <span></span><span></span>
        </button>
        <div class="nav-menu">
          <ul class="nav-links">
            ${join(links, '\n            ')}
          </ul>
          ${profile.cv.show ? `<a download data-cv class="cv-btn">${roll('Download CV')} ${icon('arrow-down')}</a>` : ''}
        </div>
      </div>
    </nav>
    <div class="nav-backdrop" id="nav-backdrop" aria-hidden="true"></div>`;
}

export function renderFooter() {
  return `
    <footer>
      <div class="container footer-inner">
        <span class="foot-mark" role="img" aria-label="${esc(profile.fullName)}">${letters(profile.fullName)}</span>
        <span class="foot-copy">&copy; ${new Date().getFullYear()} · ${esc(profile.tagline)}</span>
        <a href="#home" class="foot-top">Back to top ${icon('arrow-up')}</a>
      </div>
    </footer>
${profile.cv.show ? `
    <a download data-cv class="fab-cv" aria-label="Download CV">
      ${icon('download-simple')}<span>CV</span>
    </a>` : ''}`;
}
