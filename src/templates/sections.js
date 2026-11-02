// About, Stack, Path and Contact.
import { about, contact, profile } from '../content/profile.js';
import { stack } from '../content/stack.js';
import { path } from '../content/path.js';
import { asset, brandIcon, esc, eyebrow, icon, join } from './html.js';

export function renderAbout(n) {
  const paragraphs = about.paragraphsHtml.map((p) => `<p class="prose">\n            ${p}\n          </p>`);
  const meta = about.meta.map((m) => `
            <div class="meta-item">
              <dt class="meta-key">${esc(m.key)}</dt>
              <dd class="meta-val">${m.valueHtml}</dd>
            </div>`);

  return `
    <section id="about" class="about">
      <div class="container about-inner">
        <figure class="about-portrait reveal">
          <img src="${asset(profile.portrait)}" alt="${esc(profile.fullName)}" class="portrait-img"
               width="600" height="600" loading="lazy" decoding="async" />
          <figcaption class="portrait-caption">
            <span class="dot-live"></span> ${esc(about.caption)}
          </figcaption>
        </figure>

        <div class="about-body reveal">
          ${eyebrow(n, 'About')}
          <h2 class="section-title">${about.titleHtml}</h2>

          ${join(paragraphs, '\n          ')}

          <dl class="about-meta">${meta.join('')}
          </dl>

          <a href="mailto:${esc(profile.email)}" class="about-email">
            ${esc(profile.email)} ${icon('arrow-right')}
          </a>
        </div>
      </div>
    </section>`;
}

export function renderStack(n) {
  const rows = stack.map((row) => `
          <div class="craft-row${row.also ? ' also' : ''} reveal">
            <h3 class="craft-label">${esc(row.label)}</h3>
            <div class="tags">
              ${row.tags.map((t) => `<span>${esc(t)}</span>`).join('')}
            </div>
          </div>`);

  return `
    <section id="skills" class="skills">
      <div class="container">
        <div class="section-head reveal">
          ${eyebrow(n, 'Stack')}
          <h2 class="section-title">The <em>stack</em></h2>
        </div>

        <div class="craft-rows">${rows.join('')}
        </div>
      </div>
    </section>`;
}

export function renderPath(n) {
  const rows = path.map((row) => {
    // Only the rows that differ get a chip; "Work" on every job said nothing
    const label = row.now ? 'Now' : row.kind === 'edu' ? 'Education' : '';
    return `
          <li class="path-card${row.now ? ' now' : ''} reveal">
            <span class="path-year">${esc(row.years)}</span>
            <div class="path-main">
              <h3 class="path-role">${esc(row.role)}</h3>
              <p class="path-org">${esc(row.org)}</p>
            </div>
            ${label ? `<span class="path-kind ${esc(row.kind)}">${label}</span>` : ''}
          </li>`;
  });

  return `
    <section id="experience" class="experience">
      <div class="container">
        <div class="section-head reveal">
          ${eyebrow(n, 'Path')}
          <h2 class="section-title">The <em>path</em></h2>
        </div>

        <ol class="path-list">${rows.join('')}
        </ol>
      </div>
    </section>`;
}

function renderContactButton(b) {
  const inner = `
            ${b.brand ? brandIcon(b.brand) : icon(b.icon)}
            <span class="cb-label">${esc(b.label)}</span>
            ${b.copy
              ? `<span class="cb-sub"><span class="copy-label" aria-live="polite">${esc(b.sub)}</span> ${icon('copy')}</span>`
              : `<span class="cb-sub">${esc(b.sub)}</span>`}`;
  if (b.copy) {
    return `
          <button type="button" class="contact-btn" data-copy="${esc(b.copy)}" aria-label="${esc(b.ariaLabel || b.label)}">${inner}
          </button>`;
  }
  const ext = b.external ? ' target="_blank" rel="noopener"' : '';
  return `
          <a href="${esc(b.href)}"${ext} class="contact-btn">${inner}
          </a>`;
}

export function renderContact(n) {
  return `
    <section id="contact" class="contact">
      <div class="container contact-inner reveal">
        ${eyebrow(n, 'Contact')}
        <h2 class="contact-title">${contact.titleHtml}</h2>
        <p class="contact-lede">${esc(contact.lede)}</p>

        <div class="contact-btns">${contact.buttons.map(renderContactButton).join('')}
        </div>

        <p class="contact-now">
          <span class="dot-live"></span>
          ${contact.nowHtml}
        </p>
      </div>
    </section>`;
}
