# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio for a Unity game developer, styled as an **arcade/CRT cabinet** (scanlines, coin economy, pixel particles). Static site — vanilla HTML, CSS, and JavaScript with no build tools.

## Architecture

### File Structure

```
Portfolio/
├── index.html           # All sections in one file
├── script.js            # Particle system, gallery modal, utilities
├── styles.css           # All CSS (1300+ lines, organized by section)
├── Games/               # Arcade subsystem
│   ├── arcade.js        # Coin economy, game registry, lobby
│   ├── arcade.css       # Arcade modal + lobby styles
│   └── Snake/           # Snake game (snake.js, snake.css)
├── /Res/                # Background, profile photo, controller icon, OG image
├── /Icons/              # Game project logos
└── /GameMedia/          # Screenshots and video trailers per game
```

### Sections (index.html)

Nav labels use arcade theming; IDs are the anchor targets:
- **#home** ("Start") — Hero with pixel particle canvas, HUD stats, charge-blast mechanic
- **#about** ("Player") — Profile card with stat bars
- **#skills** ("Loadout") — Skill categories as tag clouds
- **#experience** ("Levels") — Alternating-side timeline of work/education
- **#projects** ("Games") — Project card grid opening gallery modals
- **#contact** ("Continue") — Social links, countdown timer, playtime counter

### JavaScript (script.js)

**ParticleSystem class**: Canvas-based pixel starfield on `#particles-canvas`.
- Press-and-hold on `#home` charges a blast; release fires a ripple that pushes particles
- Ripples scale in size/strength with hold duration (up to `maxChargeMs` = 1400 ms)
- `spawnBurst()` births new particles at the blast point (field grows up to `maxParticles` ≈ 2× base)
- Mouse proximity draws neon connection lines to nearby particles

**Gallery system**: `gameMedia` object maps game IDs to `{ title, media[] }`.
- Gallery cards use `data-gallery="game-id"` attribute (not onclick) — event wired in the `querySelectorAll` block at the bottom of script.js
- `openGallery(gameId)` / `showMedia(index)` / `closeGallery()` are global functions for the modal
- Keyboard navigation: Arrow keys to step, Escape to close; video auto-pauses on close

**Other utilities**:
- HUD stat counters: `[data-count]` elements animate to their target value on scroll into view
- Playtime counter: accumulates visible-tab time in `localStorage` key `sitePlaytimeMs`, displayed in the footer
- Click-to-copy: buttons with `[data-copy]` copy the attribute value; label flashes "Copied!" with fallback for old browsers
- "CONTINUE?" countdown loop auto-resets from 9 → 0 on a 1 s interval
- `[data-tip]` on `.tip-wrap` elements drives CSS tooltips (no JS)

### Arcade subsystem (Games/arcade.js)

`arcade.js` manages a coin economy and a pluggable game registry:
- Coins stored in `localStorage` key `arcadeCoins`; first visit grants 3 welcome coins
- `[data-coin-count]` elements anywhere in the DOM stay in sync via `coinListeners`
- Coins are earned by clicking on the hero section (each click flings an animated coin to the HUD)
- Games self-register with `Arcade.register({ id, title, cost, thumb, mount })`. `mount(rootEl, api)` builds the game UI and returns an optional `{ destroy() }` controller
- `openArcade()` / `closeArcade()` are global, called from HTML

## Common Development Tasks

### Adding a New Game Project

1. **Add project data** (script.js, inside `gameMedia`):
   ```javascript
   'game-id': {
       title: 'Game Name',
       media: [
           { type: 'image', src: 'GameMedia/Folder/screenshot1.jpg', thumb: 'GameMedia/Folder/Thumb.png' },
           { type: 'video', src: 'GameMedia/Folder/trailer.mp4',    thumb: 'GameMedia/Folder/Thumb.png' },
       ]
   }
   ```

2. **Add project card** (index.html, inside `.projects-grid`):
   ```html
   <div class="project-card featured" role="button" tabindex="0"
        data-gallery="game-id" aria-label="Game Name — view screenshot gallery">
     <div class="card-scan"></div>
     <div class="play-badge">▶ GALLERY</div>
     <div class="project-icon game-id">
       <img src="Icons/GameLogo.png" alt="Game Name" loading="lazy" decoding="async" />
       <div class="icon-bg"></div>
     </div>
     <h3>Game Name</h3>
     <span class="project-type">Genre</span>
     <p>Description.</p>
     <div class="tech-stack"><span>Unity</span><span>C#</span></div>
   </div>
   ```
   Cards without a gallery (store-link only) omit `data-gallery` and the `play-badge`.

3. **Add icon background** (styles.css, in the project icons section):
   ```css
   .game-id .icon-bg {
       background: linear-gradient(135deg, #colorA 0%, #colorB 100%);
   }
   ```

4. **Create media folder**: `GameMedia/GameName/` with screenshots and a `Thumb.png`

### Adding a Playable Arcade Game

1. Create `Games/GameName/game.js` and `Games/GameName/game.css`
2. Call `Arcade.register({ id, title, cost, thumb, mount })` at the end of the game file — `mount(rootEl, api)` builds DOM into `rootEl`, returns `{ destroy() }`
3. Add `<link>` and `<script>` tags in index.html (after the existing arcade scripts)

### Adding a Contact Method

Add a button in the contact section (`#contact`, `.contact-info`):
```html
<span class="tip-wrap" data-tip="Tooltip text">
  <a href="..." target="_blank" class="contact-btn class-name">
    <i class="fab fa-icon"></i>
    <span>Label</span>
  </a>
</span>
```
For a copy button instead of a link, use `<button type="button" data-copy="value">` with a `.copy-label` child span.

Then add hover styling in styles.css (contact buttons section):
```css
.contact-btn.class-name:hover {
    background: rgba(R, G, B, 0.2);
    border-color: #RRGGBB;
}
```

## Key Design Constraints

- **Arcade/CRT aesthetic** — scanlines, pixel fonts (Press Start 2P, VT323), neon palette `#ff2e88 / #29f2ff / #ffd23f / #57ff8f / #a86bff`. New UI elements should fit this theme.
- **No build process** — changes take effect immediately on file save
- **Mobile responsive** — primary breakpoint `@media (max-width: 768px)`; test the particle canvas, project grid, and arcade modal at narrow widths
- **Gallery modal** — driven entirely by `gameMedia` in script.js; mismatched IDs between `data-gallery` and `gameMedia` keys cause silent no-ops
- **External dependencies** — Font Awesome 6 (CDN) and Google Fonts (CDN) only

## Hosting

Plain static site served as-is from GitHub Pages at `https://prithol-37.github.io/Portfolio/`. All asset paths are relative; preserve folder structure on deploy.
