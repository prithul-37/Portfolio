// "Selected work": one card per entry in content/games.js, plus one popup
// (<dialog>) per game. The popups are rendered here at build time, so their
// text is in the page for SEO and features/gallery.js only wires behaviour.
import { games } from '../content/games.js';
import { asset, esc, eyebrow, icon, join, splitLetters } from './html.js';

const STORES = [
  { key: 'play', label: 'Google Play', platform: 'Android', icon: 'google-play-logo', platformIcon: 'android-logo' },
  { key: 'appStore', label: 'App Store', platform: 'iOS', icon: 'app-store-logo', platformIcon: 'apple-logo' },
];

const storesOf = (game) => STORES.filter((s) => game.stores?.[s.key]);
const platformsOf = (game) => storesOf(game).map((s) => s.platform);
const statusOf = (game) => game.status || 'Live';

// Big centred logo over a soft, blurred copy of itself. Used on cards without
// a `cover` and in popups without `media`.
const logoPanel = (game, cls) => `
            <div class="logo-panel ${cls}">
              <img class="logo-panel-bg" src="${asset(game.logo)}" alt="" loading="lazy" decoding="async" />
              <img class="logo-panel-mark" src="${asset(game.logo)}" alt="${esc(game.title)} logo" loading="lazy" decoding="async" />
            </div>`;

// One full-bleed key art image (`art`), preferred over the logo panel
const artPanel = (game, cls) => `
            <div class="art-panel ${cls}">
              <img src="${asset(game.art)}" alt="${esc(game.title)} key art" loading="lazy" decoding="async" />
            </div>`;
const fallbackPanel = (game, cls) => (game.art ? artPanel(game, cls) : logoPanel(game, cls));

function renderCard(game) {
  const cover = game.cover
    ? `
            <div class="card-cover">
              ${join(game.cover.map((src) => `<img src="${asset(src)}" alt="" loading="lazy" decoding="async" />`), '\n              ')}
            </div>`
    : fallbackPanel(game, 'card-cover');

  const live = statusOf(game) === 'Live';

  return `
          <article class="${join(['game-card', game.featured && 'featured', 'reveal'], ' ')}">
            <div class="card-media">${cover}
              <span class="card-label">${esc(game.studio)}</span>
              <span class="card-arrow" aria-hidden="true">${icon('arrow-up-right')}</span>
            </div>
            <div class="card-body">
              <p class="card-kicker">${esc(game.genre)} · ${esc(platformsOf(game).join(' & '))}</p>
              <div class="card-titlerow">
                <h3 class="card-title">${splitLetters(game.title)}</h3>
                <span class="card-status${live ? ' is-live' : ''}">${esc(statusOf(game))}</span>
              </div>
              <p class="card-summary">${esc(game.summary)}</p>
              <button type="button" class="card-open" data-game="${esc(game.id)}" aria-haspopup="dialog"
                aria-label="${esc(game.title)}: view details">
                View details ${icon('arrow-up-right')}
              </button>
            </div>
          </article>`;
}

function renderSlide(game, m, i, total) {
  const label = `${i + 1} of ${total}`;
  // Trailers load nothing until played, so show the first screenshot (or the
  // key art) meanwhile. With neither, fetch enough of the video for frame one.
  const firstShot = game.media.find((x) => x.type === 'image');
  const poster = firstShot || (game.art && { src: game.art });
  const body = m.type === 'video'
    ? `<video controls muted playsinline ${poster ? `preload="none" poster="${asset(poster.src)}"` : 'preload="metadata"'} aria-label="${esc(game.title)} trailer">
                    <source src="${asset(m.src)}" type="video/mp4" />
                  </video>`
    : `<img src="${asset(m.src)}" alt="${esc(game.title)} screenshot ${i + 1}" loading="lazy" decoding="async" />`;
  return `
                <div class="gm-slide" role="group" aria-roledescription="slide" aria-label="${label}">
                  ${body}
                </div>`;
}

function renderModal(game) {
  const media = game.media || [];
  const titleId = `gm-title-${game.id}`;

  const gallery = media.length
    ? `
            <div class="gm-gallery" aria-roledescription="carousel" aria-label="${esc(game.title)} gallery">
              <div class="gm-track" tabindex="0">${media.map((m, i) => renderSlide(game, m, i, media.length)).join('')}
              </div>
              ${media.length > 1 ? `
              <button type="button" class="gm-step gm-prev" aria-label="Previous slide">${icon('caret-left')}</button>
              <button type="button" class="gm-step gm-next" aria-label="Next slide">${icon('caret-right')}</button>
              <div class="gm-dots">
                ${media.map((m, i) => `<button type="button" class="gm-dot" aria-label="Go to slide ${i + 1}${m.type === 'video' ? ' (trailer)' : ''}"></button>`).join('\n                ')}
              </div>` : ''}
            </div>`
    : fallbackPanel(game, 'gm-gallery');

  const platforms = storesOf(game).map((s) => `<li>${icon(s.platformIcon)}${s.platform}</li>`).join('');
  const stores = storesOf(game).map((s) => `
                <a href="${esc(game.stores[s.key])}" target="_blank" rel="noopener" class="store-btn">
                  ${icon(s.icon)}<span>${s.label}</span>
                </a>`).join('');

  return `
    <dialog class="game-modal" id="game-${esc(game.id)}" aria-labelledby="${titleId}">
      <div class="gm-panel">
        <button type="button" class="gm-close" aria-label="Close">${icon('x')}</button>
        <div class="gm-media">${gallery}
          <span class="card-label">${esc(game.studio)}</span>
        </div>
        <div class="gm-info">
          <ul class="gm-platforms" aria-label="Platforms">${platforms}</ul>
          <h2 class="gm-title" id="${titleId}">${splitLetters(game.title)}</h2>
          <p class="gm-genre">${esc(game.genre)} · ${esc(game.studio)}</p>
          <p class="gm-summary">${esc(game.about || game.summary)}</p>
          <h3 class="gm-heading">My contribution</h3>
          <ul class="gm-contrib">
            ${game.contribution.map((c) => `<li>${esc(c)}</li>`).join('\n            ')}
          </ul>
          ${game.note ? `<p class="gm-note">${esc(game.note)}</p>` : ''}
          <p class="gm-tech"><span>Built with</span> ${esc(game.tech.join(' · '))}</p>
          <div class="gm-links">${stores}
          </div>
        </div>
      </div>
    </dialog>`;
}

export function renderGameModals() {
  return games.map(renderModal).join('\n');
}

export function renderWork(n) {
  return `
    <section id="work" class="work">
      <div class="container">
        <div class="section-head reveal">
          ${eyebrow(n, 'Work')}
          <h2 class="section-title">Selected work</h2>
        </div>

        <div class="work-grid">${join(games.map(renderCard), '\n')}
        </div>
      </div>
    </section>`;
}
