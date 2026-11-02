// Small helpers shared by the section templates. These run in Node (at build
// time and in the dev server), never in the browser.
import { readFileSync } from 'node:fs';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape plain text for use in HTML content or a quoted attribute. */
export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * URL for a file under src/assets/. Written root-absolute so Vite resolves it
 * from the project root, then copies it into dist/ with a hashed name.
 */
export const asset = (path) => `/src/assets/${path}`;

/** Phosphor Light icon. Decorative, so hidden from screen readers. */
export const icon = (name) => `<i class="ph-light ph-${name}" aria-hidden="true"></i>`;

/**
 * Brand logo from src/assets/Icons/brands/<name>.svg, inlined so CSS can
 * colour it (fill follows `color`). Decorative: the button carries the label.
 */
export const brandIcon = (name) => {
  const svg = readFileSync(new URL(`../assets/Icons/brands/${name}.svg`, import.meta.url), 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const paths = svg.match(/<path[^>]*\/>/g).join('');
  return `<svg class="brand-icon brand-icon--${name}" viewBox="${viewBox}" fill="currentColor" aria-hidden="true" focusable="false">${paths}</svg>`;
};

/** Join rendered fragments, skipping empty ones. */
export const join = (parts, sep = '\n') => parts.filter(Boolean).join(sep);

/** "01 · Work": section numbers come from section order, so they never drift. */
export const eyebrow = (n, label) => `<p class="eyebrow">${String(n).padStart(2, '0')} · ${esc(label)}</p>`;

/**
 * Text split for a letter-by-letter entrance: a screen-reader copy, then the
 * visible letters (aria-hidden), one span each with a running --i. Each word
 * is its own nowrap clip box, so lines still break between words.
 */
export const splitLetters = (text) => {
  let i = 0;
  const words = String(text).split(' ').map((word) =>
    `<span class="split-word">${[...word].map((ch) => `<span style="--i:${i++}">${esc(ch)}</span>`).join('')}</span>`);
  return `<span class="sr-only">${esc(text)}</span><span class="split" aria-hidden="true">${words.join(' ')}</span>`;
};
