# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Freelance and collaboration clients:** indie developers and studios building a mobile or indie PC game in Unity who want a developer to build it, or a second pair of hands on it. They arrive from LinkedIn, Discord or a shared link and want to judge quickly whether Prithul has shipped real games and owned real systems.
- **Publishers and partners:** publishers, partners and others evaluating Chichingo, the game studio Prithul co-founded in 2026, through its co-founder and lead developer. They look for a track record of shipped, live titles and production maturity.

## Product Purpose

A personal portfolio for Prithul Biswas Dip, a Unity game developer in Dhaka, Bangladesh, and co-founder and lead game developer at Chichingo. It shows the games he has shipped, what he personally built on each, and his path so far.

Success means the visitor remembers the name: they leave with a clear sense of who Prithul is and what he has shipped. Getting in touch (email, LinkedIn, Discord) and opening a store link are welcome, but neither is the main measure.

## Positioning

A developer who owns client-side game development end to end, from the first playable prototype to live updates on the stores. His work includes live hybrid-casual titles prototyped with Supersonic and Moonee, and he now co-founds a studio. He also brings AI into production: an AI-assisted level-design pipeline built with custom Claude Code skills (level editor, generator and tester, dynamic difficulty, simulated playtesting, difficulty tuner) that sped up content production on Pop'n Sort.

## Operating Context

- Visitors usually come from a direct link (LinkedIn, Discord, a pitch or an application) on desktop or phone, and skim before they read.
- The work is evaluated through each game's popup: a gallery or trailer, "My contribution" bullets, the tech used, and store links.
- The site is a static page served on GitHub Pages at `prithul.lol`. Canonical and OG metadata still point at `prithul-37.github.io/Portfolio/` (an open decision; see CLAUDE.md).

## Capabilities and Constraints

- Sections: Hero, Selected Work, About, Stack, Path, Contact. Section order and numbering come from `SECTIONS` in `src/templates/page.js`.
- Game cards open native `<dialog>` popups; text is rendered at build time for SEO.
- The CV download is built but currently hidden (`profile.cv.show: false`).
- Stack, build and asset rules, plus the design and copy constraints, are recorded in `CLAUDE.md`, which remains the authority for them. In particular: no em dashes anywhere in site text, and no fade-in motion.

## Brand Commitments

- Name forms: "Prithul Biswas" (short), "Prithul Biswas Dip" (full), with "Dip" as the nickname set in italic in the hero.
- Voice: first person, warm and plain, a little playful ("Let's build something fun."), with no hype.
- Chichingo is named and linked wherever the current role appears; Riseup Labs and Nagorik Technologies are past employers.
- Favicon is a cartoon avatar of Prithul (`src/assets/Res/avatar.svg`).

## Evidence on Hand

- Shipped and in-development games with logos, screenshots and trailers in `src/content/games.js` and `src/assets/GameMedia/`: Color Farm (Chichingo, live on Android), Pop'n Sort and Supermarket Sort Factory (Riseup Labs), Churchill Solitaire (Riseup Labs, Flutter to Unity migration, unreleased), Ant March, Zen Merge and Color Craft (Nagorik Technologies), and Sanam (freelance for 101-Dev).
- Work history and education in `src/content/path.js`; hero stats in `src/content/profile.js`.
- Portrait (`src/assets/Res/Me.JPEG`) and CV PDF (`src/assets/CV/`).
- No testimonials, client quotes, download figures or revenue numbers exist. Do not invent them. The contribution bullets for the Nagorik games were split out of older one-line descriptions and should be checked before new claims are built on them.

## Product Principles

1. **The games are the proof.** Shipped titles and what Prithul personally built on them carry the case. Nothing else is claimed.
2. **Be memorable without being loud.** Recall comes from a distinct, considered presence, not from volume.
3. **Ownership, stated specifically.** Contribution is described as concrete systems and outcomes, never generic skills lists.
4. **One person, one studio.** The portfolio introduces Prithul and, through him, Chichingo, keeping it clear which is which.
