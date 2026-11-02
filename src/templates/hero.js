// Hero: type only, plus the stat row pinned to the fold.
// The statband sits inside <header class="hero"> on purpose (see CLAUDE.md).
import { hero, profile, stats } from '../content/profile.js';
import { esc, icon, join } from './html.js';

function renderStat(stat) {
  const value = stat.count != null ? `${stat.count}${stat.suffix || ''}` : stat.text;
  const num = `<dt class="stat-num">${esc(value)}</dt>`;
  return `
            <div class="stat">
              ${num}
              <dd class="stat-label">${esc(stat.label)}</dd>
            </div>`;
}

// The eyebrow's parts after the first " · " drop on phones (see responsive.css):
// the full line can't fit one row there, and the lede repeats it right below.
function renderEyebrow(text) {
  const [first, ...rest] = text.split(' · ');
  return rest.length
    ? `${esc(first)}<span class="eyebrow-more"> · ${esc(rest.join(' · '))}</span>`
    : esc(first);
}

export function renderHero() {
  return `
    <header id="home" class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">
            <span class="dot-live"></span> ${renderEyebrow(hero.eyebrow)}
          </p>

          <h1 class="hero-title">
            <span class="line"><span class="line-in">${esc(profile.firstName)}</span></span>
            <span class="line"><span class="line-in">${esc(profile.lastName)} <em>${esc(profile.nickname)}</em></span></span>
          </h1>

          <p class="hero-lede">
            ${hero.ledeHtml}
          </p>

          <div class="hero-actions">
            <a href="#work" class="btn primary">See the games <span class="btn-icon">${icon('arrow-right')}</span></a>
            ${profile.cv.show ? `<a download data-cv class="btn ghost">Download CV <span class="btn-icon">${icon('download-simple')}</span></a>` : ''}
          </div>
        </div>
      </div>

      <section class="statband">
        <div class="container">
          <dl class="hero-stats">${join(stats.map(renderStat), '')}
          </dl>
        </div>
      </section>
    </header>`;
}
