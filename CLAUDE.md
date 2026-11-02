# CLAUDE.md





This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.





## Project Overview





Personal portfolio for Prithul Biswas, a Unity game developer. Vanilla HTML, CSS, and JavaScript (no framework), built and served with **Vite**. The page HTML is generated from data at build time, so the shipped site is plain static HTML with full SEO and only ~14 KB of JS.





```


index.html                 thin shell: <head> links + <!--app:head--> / <!--app:body--> markers


vite.config.js


plugins/render-html.js     Vite plugin that renders src/templates into those markers


src/


  content/                 ALL copy and lists: profile.js, games.js, stack.js, path.js


  templates/               HTML structure (Node-only): page.js assembles head/body from one file per section


  features/                browser JS, one job per file: theme, nav, reveal, gallery, links (CV + copy)


  main.js                  browser entry; imports and starts the features


  styles/                  index.css imports the partials (tokens, base, nav, hero, work, ...) in cascade order


  assets/                  Icons/, Res/, GameMedia/, Fonts/, CV/ (bundled with hashed names)


public/                    copied to dist/ verbatim: CNAME, Res/og-image.jpg


```





**To change what the site says, edit `src/content/`.** Templates only hold structure. In content files, fields named `html` / `...Html` are inserted raw (so they can carry links, `<em>`, `<strong>`); every other string is HTML-escaped by the templates.





Design system is called **"SOFT EDITORIAL"**: calm, magazine-like, easy on the eyes. Warm paper background, deep green-black ink, one muted sage accent; Fraunces serif for display over a quiet grotesk body; hairline rules, soft radii, low diffuse shadows, slow small motion. A later polish pass (Nov 2026, from the `high-end-visual-design` skill) layered on premium detail without changing the palette or type: double-bezel surfaces, pill eyebrows, button-in-button CTAs, a faint paper grain, and Phosphor Light icons. It replaced an earlier loud brutalist system ("PLAYSET": thick borders, hard offset shadows, coral/yellow/blue) in Nov 2026 — don't reintroduce those.





## Running & Deploying





```


npm install        # once


npm run dev        # dev server with live reload (http://localhost:5173)


npm run build      # production build into dist/


npm run preview    # serve dist/ locally to check the build


```





There is no lint or test step, and no build is needed to work on the site: `npm run dev` renders and serves straight from `src/`. Opening `index.html` from disk shows nothing useful (it's only the shell; the body is rendered by the plugin), and `dist/index.html` from disk won't run its module script either. Use `npm run preview` to look at a build.





**How rendering works.** `plugins/render-html.js` is a `transformIndexHtml` hook with `order: 'pre'`: it replaces the two markers in `index.html` with `renderHead()` / `renderBody()` from `src/templates/page.js` *before* Vite processes the HTML, so every `/src/assets/...` URL a template emits is bundled and rewritten exactly like hand-written markup. In dev it loads templates through `server.ssrLoadModule`, so edits under `src/content/` or `src/templates/` show up on the next request, and its `handleHotUpdate` forces a full page reload for them. Templates run in Node: they must not touch `window`/`document`.





`.github/workflows/deploy.yml` runs `npm ci && npm run build` (Node 24) and publishes **`dist/`** to GitHub Pages on every push to `master`. `vite.config.js` sets `base: './'`, so every built URL is relative and the same build works on the custom domain and under the github.io `/Portfolio/` subpath. Note the two URLs in play: `public/CNAME` points the site at `prithul.lol`, while the `canonical`/OG tags (`seo.siteUrl` in `src/content/profile.js`) still say `https://prithul-37.github.io/Portfolio/` — if you touch SEO metadata, decide deliberately which one is canonical.





## Architecture





### Theming (the part that bites)





Light/dark is driven by `data-theme` on `<html>`, persisted in `localStorage` under `pb-theme`.





- An **inline script in `index.html`'s `<head>`** sets the attribute before paint to avoid a flash. It must stay inline and come before the stylesheets.


- `src/features/theme.js` flips the attribute on `.theme-toggle` click, syncs `<meta name="theme-color">`, and briefly adds `.theme-anim` to `<html>` (~450 ms) to cross-fade surfaces.


- Colour tokens live in `:root` and are overridden wholesale in `:root[data-theme="dark"]` in `src/styles/tokens.css`. `--bg` and `--ink` **swap**: `--ink` is near-black in light mode and near-white in dark.





Because of that swap, never pair an `--ink` (or `--accent`) fill with a hardcoded white — use `--on-ink`, which flips with the theme. Primary buttons, store-button hover, the gallery nav hover, the mobile CV pill and the "Now" path chip all rely on it. `--accent` is the text-safe sage; `--accent-2` is lighter and for decoration only (dots, underlines, outlines) — it fails contrast as body text on paper. Always check a change in both themes.





**Double bezel.** Work cards, contact buttons, the portrait and the gallery panel sit in a faint outer "tray": `box-shadow: var(--bezel)` (inner top highlight + a 6px `--shell` spread) plus `outline: 1px solid var(--line-soft); outline-offset: 6px` for the tray's outer edge. Spread shadows and outlines both follow `border-radius`, so the curves stay concentric with no wrapper markup. Don't add the outer edge as a second spread shadow: spread shadows are filled shapes, so it would tint the whole tray and look heavy. A hover shadow must be written as `var(--bezel), var(--shadow)` or the tray disappears. The grid gaps (`2rem` in Work, `1.6rem` in Contact) leave room for the tray.





**Grain.** `body::after` is a fixed, `pointer-events: none` SVG-noise layer at `--grain` opacity (z-index 95, below the nav and modal). Keep it fixed; never put noise on a scrolling element.





### Sections





Nav labels differ from the anchor IDs: Work → `#work`, About → `#about`, Stack → `#skills`, Path → `#experience`, Contact → `#contact`. Hero is `#home`.





**Welcome intro.** On every load a full-screen `--accent` sheet (`.intro`, rendered first in the body by `renderIntro()` in `src/templates/layout.js`) builds the word "Welcome" letter by letter, holds, then slides up (about 2.1s in all). The entrance direction (`right`, `top` or `bottom`) is picked at random by the inline script in `index.html`'s `<head>`, which sets `data-intro` on `<html>` before paint; it skips the attribute under `prefers-reduced-motion`, and without it the intro stays `display: none`. All motion is CSS in `src/styles/intro.css`; `src/features/intro.js` only removes the element after it leaves. `html[data-intro]` sets `--intro-delay`, which every load-in delay in `src/styles/entrance.css` adds, so the page choreography starts as the sheet clears. Every load-in animation is held paused at its first frame while `html.anim-wait` is set: the inline head script adds it, and `src/main.js` removes it once Fraunces and Familjen Grotesk have loaded (2.5s cap; the head script also drops it after 4s in case the module never runs). Without that, a cold first visit played the intro and hero choreography while the fonts were still downloading, so most of it was missed.





**Section bands** (`src/styles/bands.css`): each top-level `body > section` is a band of its own green, `--band-1` … `--band-5` in page order (tokens in `tokens.css`, alternating lighter/deeper sage, with deep-green dark-mode equivalents). When a section's top is 15% into the viewport, `initBands()` in `features/reveal.js` adds `.band-in` and the band slides in sideways: odd sections from the left, even ones from the right. The `<section>` box never moves (that is what the observer watches); its background is on `::before`, and `::before` plus the direct `.container` child slide together. `overflow-x: clip` (not `hidden`, so the sticky portrait still works) prevents sideways page scroll. The off-screen start state only applies under `html.js` (set by the inline head script), so the bands are never stuck off-screen without JS. A new section needs a `.container` as its direct child and, past five sections, a `--band-6`.





**Load-in choreography** (`src/styles/entrance.css`, all CSS): the wordmark's letters (one span each, from `letters()` in `layout.js`) drop in one by one while the nav pill, its links, the CV button and the theme toggle pop up in turn; the eyebrow slides in from the left and each name line slides out from behind its own left edge (`.line` is a `clip-path` mask, `.line-in` moves; the line-mask reveal from chichingo.com); once the name lands, the lede unrolls downward out of it and the CTAs pop up, while the stat row rises in parallel. There are no opacity fades or blurs (by request): each element is `opacity: 0` until its delay ends, then shows solid and moves in from off-screen, from behind a mask, or from `scale: 0`. Keyframes animate the individual `translate`/`scale` properties, never `transform`, because a forwards-filled `transform` would permanently override the buttons' `:hover`/`:active` transforms. The nav link and CV pops are desktop-only (`min-width: 769px`): below that they live in the mobile sheet, whose own stagger a filled animation would override. Anything added to the choreography also goes in the opacity reset in `reduced-motion.css`. The intro is a deliberate exception to the 24px motion limit below.





The hero is type only — `.hero-copy` (eyebrow, name, lede, CTAs) with no imagery beside it, a single static sage glow (`.hero::before`), and a `.statband` row of four stats separated by hairlines. A fanned stack of game screenshots used to sit to its right and was removed deliberately; the work is shown in `#work`, not the hero.





**The statband lives inside `<header class="hero">` on purpose.** The hero reserves `100svh`; `.hero-inner` takes `flex: 1` and centres its content in whatever height is free, so the stat row lands on the fold rather than floating mid-screen. Below 900px the hero drops `min-height` and `.hero-inner` stops flexing — stacked, there is no free height worth centring in. Because the hero ends on `</header>`, `section + section` can't draw the divider above Selected Work; `.hero + section` covers it.





Every section opens with a numbered `.eyebrow` ("01 · Work" … "05 · Contact") above a Fraunces `.section-title`; an `<em>` inside a title renders in italic sage. Section order, nav links, anchor ids and the eyebrow numbers all come from the `SECTIONS` array in `src/templates/page.js`, so reordering or adding a section there renumbers everything.





Work cards (Nov 2026 redesign) are a cover on top (a three-screenshot `.card-cover` strip, or the logo on a blurred copy of itself via `.logo-panel`), then a kicker (genre · platforms), title with a Live / In development chip, a one-line summary, and "View details". Each opens a popup: gallery left, details right.





**Employment status is stated in several places**, nearly all in `src/content/profile.js`. `profile.role` and `profile.company` feed the JSON-LD and the `now: true` row in `content/path.js` automatically. The rest is prose and must be changed by hand, together: `hero.eyebrow` and `hero.ledeHtml`, the About "Now" `meta` row, the second About paragraph (which also says what Chichingo makes), `contact.nowHtml`, the `seo` descriptions, and the dates of the `now` row in `path.js`. As of Nov 2026 the headline role is Co-Founder & Lead Game Developer at Chichingo (Sep 2026 – present); Riseup Labs is past tense.





The Path is an `<ol class="path-list">` of `li.path-card` rows (year · role/org · kind chip), not a card grid.





### Browser JavaScript (`src/features/`)





Small, framework-free ES modules, each exporting an `init...()` that `src/main.js` calls once (module scripts run after the document is parsed, so no `DOMContentLoaded` is needed). There are no inline `onclick` handlers and no globals: features attach their own listeners. Data attributes drive behaviour:





| Attribute | Behaviour |


|---|---|


| `data-cv` | `features/links.js` sets the href to the bundled CV (imported with `?url`) and `download` to `profile.cv.downloadName`. To swap the CV, replace the PDF or change that one import |


| `.reveal` | glides up 24px into place via `IntersectionObserver` (no fade: always fully visible), staggered by `(index % 4) * 0.06s` |


| `data-game="<id>"` on `.card-open` | opens `<dialog id="game-<id>">`, the game's popup |


| `data-copy="<value>"` | copies to clipboard, flashes "Copied!" in the child `.copy-label` |





**Nothing listens on scroll, and nothing should.** The navbar follows chichingo.com: a full-width fixed bar holding the wordmark (bold Fraunces, 1.6rem), the section links grouped in one `.nav-links` pill, a dark `.cv-btn`, and the theme toggle. Nav labels use a `.roll` text roll on hover (two stacked copies of the label, the second `aria-hidden`), built by `roll()` in `src/templates/layout.js`. The bar is transparent at the top so the hero glow shows through; its `.scrolled` state paints it `--bg` with a hairline under it. Never give the bar (or any ancestor of `.nav-menu`) a `backdrop-filter`, `filter` or `transform`: that makes it the containing block for `position: fixed` descendants and traps the full-screen mobile sheet inside the bar. That state comes from an `IntersectionObserver` watching `#nav-sentinel`, a 1px marker positioned 40px down the page. Reveals use `IntersectionObserver` too. If you need a new scroll effect, extend one of those mechanisms or use a CSS scroll-driven animation behind `@supports (animation-timeline: scroll())`.





Hover transitions on `.game-card` and `.path-card` are declared under a higher-specificity selector (`.work-grid .game-card`, `.path-list .path-card`) that also lists `transform`, so the `.reveal` glide keeps working — a plain `transition:` on the card would silently kill it.





**No fade-ins anywhere on the site** (by request): nothing animates from `opacity: 0` or from a blur. Things appear solid and move (`.reveal` glides up 24px; the mobile menu sheet appears at once and its items rise; the gallery modal opens instantly; the intro letters fly in from a full screen away). Keep it that way when adding motion.





Below 768px the menu is a full-screen glass sheet (`.nav-menu.open`) whose `li`s and CV button rise in with staggered `transition-delay`s (the label roll is switched off there); the hamburger morphs into an X. The old dimming `.nav-backdrop` is still rendered and wired up in `features/nav.js`, but is `display: none`, because it would sit above the sheet. Escape also closes the menu.





The theme cross-fade and all motion bail out on `prefers-reduced-motion: reduce`; the CSS side lives in `src/styles/reduced-motion.css`, imported last. Keep new motion behind the same check.





**CSS** is split per component under `src/styles/`; `index.css` imports the partials in the original cascade order (fonts, tokens, base, buttons, nav, hero, work, about, stack, path, contact, footer, reveal, gallery, responsive, reduced-motion) and Vite inlines them into one file. The 900px/768px overrides stay together in `responsive.css` because they rely on coming after every component; add a component's breakpoint rules there.





### Game popups

Every game gets a native `<dialog class="game-modal" id="game-<id>">`, rendered at build time by `renderGameModals()` in `src/templates/work.js` (so the text is in the page for SEO) and opened with `showModal()`, which puts it in the top layer above the nav. It opens instantly, with no fade. The dialog box itself is the dimmed full-screen backdrop; `.gm-panel` inside it is two columns: `.gm-media` (gallery) and `.gm-info` (platforms, title, genre · studio, summary, "My contribution" bullets, optional `note`, "Built with", store links). Below 900px it stacks and the panel scrolls; below 768px it goes full screen and `.gm-close` is pinned with `position: fixed`.

The card is clickable everywhere because the "View details" `<button class="card-open">` stretches its `::after` over the card; its focus ring is drawn on the card with `:has(.card-open:focus-visible)`. Cards have no other interactive elements, so don't add links inside them.

The gallery is a horizontal scroll-snap `.gm-track` of `.gm-slide`s, so touch swipe is native. `src/features/gallery.js` watches the slides with an `IntersectionObserver` (root: the track), never a scroll listener, to light the matching `.gm-dot` (`aria-current`), disable the arrow at either end and pause a trailer that slides away. Arrows and dots call `scrollTo`; arrow keys step, Escape closes (native), clicking the backdrop closes, and closing pauses video. `html.modal-open` locks page scroll. Slide images fill the slide with `object-fit: contain` (never `max-height: 100%`, which doesn't resolve in a grid cell and lets tall phone screenshots overflow). Trailers are `preload="none"` with the game's first screenshot as `poster`. A game without `media` shows its logo panel instead.

Media paths are emitted by the template like any other `/src/assets/...` URL, so Vite bundles them; a wrong path fails the build rather than 404ing.

### Assets





Everything lives in `src/assets/`: `Icons/` (game logos), `Res/` (portrait, favicon), `GameMedia/<GameName>/` (screenshots + `Thumb`), `Fonts/` (self-hosted woff2 + OFL), `CV/` (PDF). Content files give paths relative to `src/assets/` (`'Icons/AntGameLogo-160.jpg'`); templates turn them into `/src/assets/...` with the `asset()` helper.





**How assets reach the build.** Vite copies an asset into `dist/assets/` (with a content-hashed name) only if it can *see* the reference: in rendered HTML (`src`, `href`, preload links), in CSS `url()`, through an `import x from '...?url'`, or via `import.meta.glob`. Browser code that builds a path string at runtime is not bundled and 404s in production while still working under `npm run dev`. Always check a new asset with `npm run build && npm run preview`. Asset inlining is off (`assetsInlineLimit: 0`) so gallery thumbnails stay files instead of being repeated as base64 in the JS.





**`public/`** holds the few files that must keep a fixed, unhashed URL and are copied to `dist/` as-is: `CNAME` (custom domain) and `Res/og-image.jpg` (the OG/Twitter tags and the JSON-LD `image` point at it by absolute URL). Put a file there only if something outside the page needs its exact path. `public` was previously in `.gitignore` (a Gatsby leftover) and was removed.





**Nothing on the page points at an original image.** The source files are enormous — several screenshots are 2–4 MB, one is 3785×8192, and two gallery thumbnails rendered at 70×70 px were 1 MB PNGs. Sized derivatives are committed alongside them and the markup references only those:





| Derivative | Size | Used by |


|---|---|---|


| `screenshotN-sm.jpg` | 480 w | `.card-cover` strips on cards |


| `screenshotN-md.jpg` | 720 w | gallery modal (`gallery.media` in `games.js`) |


| `Thumb-sm.jpg` | 160 w | gallery modal thumbnail rail |


| `<Logo>-160.jpg` / `.png` | 160×160 | `.game-logo` on work cards |





Originals stay as the source of truth but never ship to the browser.





**Video:** trailers are referenced straight from `games.js` with no derivative, and load only when the modal opens. Encode them **faststart** (`ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4`) so the `moov` atom sits before `mdat`; otherwise the browser must download the entire file before it can show a single frame. `PopnSort/trailer.mp4`, `ColorFarm/gameplay.mp4` and `ZenMerge/Zen_Merg_trailer.mp4` are faststart (the last two remuxed in Python, since ffmpeg isn't installed here: move `moov` before `mdat` and add its size to every `stco`/`co64` offset). Logos are JPEG unless the artwork has real transparency (only `FrogGamelogo` did, and Leaping Frog is no longer shown) — the `.game-logo` container supplies the rounded corners and background, so an alpha channel is usually dead weight. When you add or swap art, generate the derivatives and point `games.js` at them; a raw `screenshot1.jpg` reference is a bug. `Res/Bg.jpg` (7001×4001, 1.5 MB) is unreferenced. Unreferenced files and the large originals never reach `dist/`, because Vite only ships what the page references.





### Fonts





Self-hosted from `src/assets/Fonts/`, declared in `src/styles/fonts.css`, with no Google Fonts request at runtime. **Fraunces** (display; variable `wght` 300–700 plus an `opsz` axis, with separate normal and italic files) and **Familjen Grotesk** (body; variable 400–700). Display text sets `font-variation-settings: 'opsz' …` high for the big headings so Fraunces uses its fine display cut. Only `latin` and `latin-ext` subsets are included. The two render-critical latin faces (Fraunces normal, Familjen) are preloaded in `index.html`'s `<head>`; `crossorigin` on those `<link rel="preload">` tags is required even though they are same-origin, because font fetches are CORS-mode and omitting it causes a double download. Both families are OFL-1.1 — `Fonts/OFL.txt` must stay with the font files. The Bricolage Grotesque and Space Mono files left in `Fonts/` are from the old design and are no longer referenced.





## Common Tasks





### Adding a game card

Add an entry to the `games` array in `src/content/games.js` (array order is display order) and drop its media into `src/assets/GameMedia/<Folder>/`:

```js
{
  id: 'game-id',                        // card data-game and popup id; must be unique
  title: 'Game Name',
  featured: false,                      // spans both columns, cover left and text right
  logo: 'Icons/GameLogo-160.jpg',
  genre: 'Puzzle',
  studio: 'Studio Name',                // pill on the cover; "Freelance for X" for client work
  status: 'In development',             // optional; defaults to Live
  summary: 'One sentence about the game.',           // card text; popup too unless `about` is set
  about: 'Optional longer description for the popup.',
  art: 'GameMedia/Folder/cover-md.jpg', // optional key art: fills the cover and, without media, the popup's left side
  contribution: ['What I built.', 'Another thing I built.'],   // popup bullets
  note: 'Optional small print in the popup.',
  tech: ['Unity', 'C#'],
  stores: { play: 'https://...', appStore: 'https://...' },   // also give the platforms
  cover: coverShots('Folder'),          // optional 3-shot card strip (-sm.jpg); else the logo
  media: [{ type: 'video', src: 'GameMedia/Folder/trailer.mp4' }, ...screens('Folder', 4)],  // optional popup gallery
},
```

Platforms (Android, iOS) are derived from `stores`. Color Farm (first) and Pop'n Sort (after the first pair) are `featured` (order: featured, pair, featured, pairs); the other six sit two-up, so keep the count of non-featured games even or the grid ends on a lone card. Ant March, Zen Merge and Color Craft were made at Nagorik Technologies; Pop'n Sort, Supermarket Sort Factory and Churchill Solitaire at Riseup Labs (Churchill is a Flutter to Unity migration, unreleased); Sanam is freelance for 101-Dev; Color Farm (Android, live) is Chichingo. Pop'n Sort's card shows its logo and its popup only the trailer: its screenshots were dropped on purpose. Leaping Frog and the Tic Tac Toe side project were removed in Nov 2026 (Leaping Frog's media is still in `GameMedia/LeapingFrog/` but unreferenced); the hero's "Titles shipped" stat reads 10+ (it counts work beyond the cards shown). The contribution bullets for the Nagorik games were split out of older one-line descriptions, so check them against what was actually built before relying on them.

### Buttons and icons





Icons are **Phosphor Light** (`<i class="ph-light ph-NAME"></i>`), loaded from jsDelivr at a pinned version. Brand marks use the `-logo` names (`ph-google-play-logo`, `ph-app-store-logo`, `ph-linkedin-logo`, `ph-discord-logo`). Font Awesome was removed; don't mix the two.





**Brand logos** (the Gmail, LinkedIn and Discord marks on the contact buttons) are the one exception: real logo SVGs in `src/assets/Icons/brands/` (Gmail and Discord from Simple Icons, CC0; LinkedIn from Bootstrap Icons, MIT, since Simple Icons dropped it; see `SOURCES.txt` there). `brandIcon(name)` in `src/templates/html.js` inlines one at build time with `fill="currentColor"`, and `contact.css` colours it from the `--brand-gmail` / `--brand-linkedin` / `--brand-discord` tokens. To add one, drop a single-colour SVG in that folder and reference it by file name.





Hero CTAs are pills with the trailing icon nested in its own circle: `Label <span class="btn-icon"><i class="ph-light ph-arrow-right"></i></span>`. On hover the circle nudges up-right; on press the whole button scales to 0.98.





### Adding a contact button





Add an entry to `contact.buttons` in `src/content/profile.js`: `{ brand, label, sub, href, external }`, or `{ brand, label, sub, copy, ariaLabel }` for a copy-to-clipboard button. `brand` names a logo in `src/assets/Icons/brands/`; use `icon` (a Phosphor name) instead for a non-brand button. They render into `.contact-btns` (a three-column grid; one column below 900px) and all share one quiet style, with no per-button accent classes.





## Constraints





- **No em dashes (—) in any site text** — copy, titles, meta/OG tags, aria-labels, or date ranges. Use a comma, colon, full stop, or `|` in titles; date ranges take a plain hyphen (`Sep 2026 - Present`).


- **Design tokens only** — pull colours, borders, shadows, and easings from the CSS vars in `:root`. Hardcoded hex values break dark mode.


- **The hero name is two lines** — `Prithul` / `Biswas <em>Dip</em>` — in light-weight Fraunces at `clamp(3.2rem, 10vw, 8rem)`, with "Dip" in italic sage.


- **Keep it calm.** One accent colour, hairlines over heavy borders, soft shadows only on hover or for lifted surfaces, motion ≤ ~1s and ≤ ~24px of travel, all on the single `--ease` curve (`cubic-bezier(0.32, 0.72, 0, 1)`; no `linear` or `ease-in-out`). Resist adding a second accent, gradients beyond the single hero glow, or decorative stickers/badges.


- **Fonts** — Fraunces (display), Familjen Grotesk (body and uppercase eyebrows/labels), self-hosted (see above). Phosphor Light icons via jsDelivr are the *only* external dependency; the page otherwise loads entirely from its own origin.


- **Breakpoints** — 900px (grids collapse to one column) and 768px (hamburger + full-screen menu). Test both.


- **Structured data** (JSON-LD `Person`) and the full OG/Twitter tags are rendered by `src/templates/head.js` from `src/content/profile.js`; keep `seo` up to date with role or title changes.


- The `.agents/skills/` and `.claude/skills/` directories hold vendored Claude Code skills tracked by `skills-lock.json` — not site code.


