---
name: Prithul Biswas Portfolio
description: Soft Editorial, a calm magazine-like portfolio on warm paper with deep green ink and one muted sage.
colors:
  paper: "#f6f3ec"
  surface: "#fbf9f4"
  surface-2: "#efebe2"
  ink: "#1f2a24"
  ink-2: "#4a554e"
  muted: "#5a635c"
  line: "rgba(31, 42, 36, 0.12)"
  line-strong: "rgba(31, 42, 36, 0.22)"
  line-soft: "rgba(31, 42, 36, 0.08)"
  sage: "#4f6f58"
  sage-light: "#7a9a82"
  sage-soft: "#e3eae1"
  on-ink: "#f6f3ec"
  band-1: "#edf3ea"
  band-2: "#dce8d8"
  band-3: "#e9f0e5"
  band-4: "#d5e3d1"
  band-5: "#e4ede0"
  paper-dark: "#141916"
  surface-dark: "#1a201c"
  surface-2-dark: "#232a25"
  ink-dark: "#e9e6dd"
  ink-2-dark: "#bcc2b9"
  muted-dark: "#8f9890"
  sage-dark: "#a3c4aa"
  sage-light-dark: "#7fa287"
  sage-soft-dark: "#232e27"
typography:
  display:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(3.2rem, 10vw, 8rem)"
    fontWeight: 320
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 144"
  headline:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)"
    fontWeight: 350
    lineHeight: 1.08
    letterSpacing: "-0.02em"
    fontVariation: "'opsz' 96"
  title:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "1.6rem"
    fontWeight: 450
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Familjen Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Familjen Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.2em"
rounded:
  sm: "12px"
  md: "22px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2.5rem)"
  section-y: "clamp(6rem, 12vw, 10rem)"
  container: "1120px"
  grid-gap-work: "2rem"
  grid-gap-contact: "1.6rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.45rem 0.45rem 1.5rem"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.45rem 0.45rem 1.5rem"
  store-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.05rem"
  store-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  eyebrow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.38rem 0.85rem"
  chip-live:
    backgroundColor: "{colors.sage-soft}"
    textColor: "{colors.sage}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.7rem"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0.55rem"
  nav-links:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "3rem"
    padding: "0 1.75rem"
---

# Design System: Prithul Biswas Portfolio

## Overview

**Creative North Star: "Soft Editorial"**

The site reads like a calm, well-made magazine about one game developer's work. Warm paper, deep green-black ink and a single muted sage carry everything. Display type is Fraunces at its fine optical cut, light and large. Body text is a quiet grotesk. Structure comes from hairline rules and generous whitespace, not boxes and borders. Surfaces are soft-cornered and lift only slightly, and motion is slow and small.

On top of that calm base sits a layer of premium detail: double-bezel trays around key surfaces, pill eyebrows, button-in-button CTAs, a faint fixed paper grain, Phosphor Light icons, and section bands that alternate between lighter and deeper sage. The detail should be found, not announced. Nothing glows, pulses or competes with the games.

This replaced an earlier loud brutalist system (thick borders, hard offset shadows, coral, yellow and blue). That look is a confirmed anti-reference.

**Key Characteristics:**
- Warm paper and pine-ink neutrals, one sage accent, no second accent.
- Light-weight Fraunces display over Familjen Grotesk body.
- Hairline rules for structure; double-bezel trays for lifted surfaces.
- Pills everywhere small: eyebrows, chips, buttons, nav.
- Motion is solid and moves into place; nothing fades in.
- Full light and dark themes driven by `data-theme`, with ink and paper swapping.

## Colors

A warm, low-chroma palette: paper and ink do the work, sage marks the few things that matter.

### Primary
- **Sage**: the text-safe accent. Italic `<em>` words in titles, inline links, the active Path row's year, live chips, focus rings and contact icons. In dark mode it lightens to Sage (dark).
- **Sage Light**: decoration only, never body text (it fails contrast on paper). Live dots, link underlines, the copied-state border.
- **Sage Soft**: the quiet sage wash behind live chips, the active Path row, text selection and the logo panel.

### Neutral
- **Paper**: the page background. Becomes near-black green in dark mode.
- **Surface / Surface 2**: card and pill fills, and the recessed fill behind media and icon circles.
- **Ink**: headings, primary button fills, strong text. Near-white in dark mode.
- **Ink 2**: body copy, ledes, summaries.
- **Muted**: eyebrows, kickers, stat labels, years.
- **Line / Line Strong / Line Soft**: hairline rules and borders at three weights; Line Soft is reserved for the outer edge of a double-bezel tray.
- **On Ink**: text and icons on an Ink or Sage fill. It flips with the theme.
- **Bands 1 to 5**: one green per top-level section, in page order, alternating lighter and deeper.

### Named Rules
**The One Voice Rule.** Sage is the only accent. No second hue, no gradients beyond the single hero glow. Brand logo colours (Gmail, LinkedIn, Discord) appear only on their own contact marks.

**The Swap Rule.** Ink and Paper swap between themes, so never pair an Ink or Sage fill with a hardcoded white: use On Ink. Every colour comes from a token; a raw hex in component CSS breaks dark mode.

## Typography

**Display Font:** Fraunces (with Georgia, Times New Roman)
**Body Font:** Familjen Grotesk (with system-ui, Segoe UI)

**Character:** A light, high-contrast serif at display sizes, set with its large optical-size cut, over a plain, warm grotesk. The serif gives the page its voice; the grotesk stays out of the way.

### Hierarchy
- **Display** (320, fluid 3.2rem to 8rem, 0.98): the two-line hero name only, "Prithul" / "Biswas *Dip*", with Dip in italic Sage. The Contact title uses a close variant (320, up to 5.4rem).
- **Headline** (350, fluid 2.2rem to 3.4rem, 1.08): section titles; one `<em>` phrase per title renders in italic Sage.
- **Title** (450, 1.6rem, 1.15): game card titles, larger on featured cards; Path roles use a lighter 420 at 1.25rem.
- **Body** (400, 1.0625rem, 1.65): running text, held to about 52 to 62ch.
- **Label** (600, 0.7 to 0.72rem, 0.12 to 0.2em tracking, uppercase): eyebrows, card kickers, Path kind chips.

### Named Rules
**The Pinned Serif Rule.** Fraunces is a deliberate, binding choice for display type. Do not swap it, even when a checker flags it as common.

**The Light Display Rule.** Display and headline weights stay light (300 to 350) with negative tracking and high `opsz`. Heavy serif display is off-brand; the only bold Fraunces is the nav wordmark.

## Layout

A single centred column (1120px container, fluid gutter) with generous section padding (6rem to 10rem). Every top-level section opens with a numbered pill eyebrow ("01 · Work") and a Fraunces headline, then its content.

The hero fills the first viewport and is type only: eyebrow, two-line name, lede, CTAs, and a four-up stat row on the fold separated by vertical hairlines. Selected Work is a two-column card grid where featured games span both columns with cover left and text right. Path is a ruled list (year, role and org, kind chip), not a card grid. Contact is centred with three contact cards.

Each section sits on its own sage band that slides in sideways once as it enters the viewport.

Breakpoints: at 900px grids collapse to one column and the hero stops reserving the full viewport height; at 768px the nav becomes a hamburger with a full-screen sheet and the game popup goes full screen.

## Elevation & Depth

Mostly flat with soft lift. Depth comes from tonal surfaces (Surface on Paper) and the double bezel, with diffuse shadows appearing on hover or on genuinely lifted elements (primary button, pills over media).

### Shadow Vocabulary
- **Shadow Small** (`0 1px 2px rgba(31,42,36,0.04), 0 4px 12px -6px rgba(31,42,36,0.08)`): resting lift on the primary button and pills over card covers.
- **Shadow** (`0 1px 2px rgba(31,42,36,0.04), 0 18px 40px -22px rgba(31,42,36,0.22)`): hover lift on cards, contact buttons and the primary button.
- **Bezel** (`inset 0 1px 0 var(--highlight), 0 0 0 6px var(--shell)`): the double-bezel tray, always paired with `outline: 1px solid var(--line-soft); outline-offset: 6px`.

### Named Rules
**The Tray Rule.** Lifted surfaces (work cards, contact buttons, the portrait, the gallery panel) sit in a faint outer tray. On hover, write the shadow as `var(--bezel), var(--shadow)` so the tray survives, and never draw the tray's edge as a second spread shadow.

**The Grain Rule.** A fixed paper-grain layer sits over the page at 3.5% (5% in dark). It stays fixed and never moves with scroll.

## Shapes

Soft and concentric. Large surfaces use a 22px radius; inner media inset by the card padding uses the radius minus that padding, so curves stay parallel. Smaller rows use 12px. Everything small (eyebrows, chips, buttons, nav pill, icon circles) is a full pill or circle. Borders are 1px hairlines. The only square-ish exception is the nav CV button (10px).

## Components

### Buttons
Button-in-button pills: the label sits on the left and the trailing Phosphor arrow has its own circle flush to the inner edge.
- **Shape:** full pill (999px), icon circle 2.25rem.
- **Primary:** Ink fill, On Ink text, Shadow Small at rest.
- **Ghost:** Surface fill, Line Strong border, Ink text, icon circle on Surface 2.
- **Hover / Active:** the icon circle nudges up-right and grows slightly; the primary gains Shadow; press scales the whole button to 0.98. Transitions run 0.5s on the single ease curve.
- **Store button:** hairline pill with a brand icon; hover fills with Ink and On Ink.

### Chips
- **Eyebrow:** pill on Surface with a hairline and inner top highlight, uppercase Label type in Muted, usually led by a section number.
- **Status:** "Live" is Sage on Sage Soft with a leading dot; "In development" is a hairline outline in Ink 2.
- **Path kind:** small uppercase hairline pill; on the current row it fills with Sage and On Ink.

### Cards / Containers
- **Corner Style:** 22px, media inside at the concentric inner radius.
- **Background:** Surface over Paper, media on Surface 2.
- **Shadow Strategy:** Bezel at rest, Bezel plus Shadow on hover (see Elevation).
- **Border:** 1px Line, Line Strong on hover.
- **Internal Padding:** 0.55rem around the cover; body text at about 1.15rem by 0.9rem.
- **Behaviour:** the whole card is one click target (a stretched "View details" button). On hover the card lifts 4px, cover images scale to 1.03 and the corner arrow pill fills with Ink. No other interactive elements inside a card.

### Navigation
A full-width fixed bar: bold Fraunces wordmark on the left, section links grouped in one Surface pill, an Ink CV button and a round theme toggle. Labels roll on hover (the label slides up and an identical copy slides in). The bar is transparent over the hero and becomes Paper with a bottom hairline once the page moves. Below 768px it becomes a hamburger that opens a full-screen sheet whose items rise in turn.

### Game Popup
A native dialog that opens instantly over a dimmed full-screen backdrop. Its panel is two columns: a scroll-snap gallery with dots and arrows on the left, details (platforms, title, genre and studio, summary, contribution bullets, tech, store links) on the right. It stacks below 900px and goes full screen below 768px.

### Contact Card
A centred tile in the bezel tray: brand logo (Gmail, LinkedIn or Discord in its own colour), label and a Muted sub-line. Copy-to-clipboard tiles flash "Copied!" and take a Sage Light border.

## Do's and Don'ts

### Do:
- **Do** pull every colour, shadow and ease from the tokens and check each change in both themes.
- **Do** use On Ink for text or icons on Ink and Sage fills.
- **Do** run all motion on the one curve, `cubic-bezier(0.32, 0.72, 0, 1)`, at about 1s or less and 24px of travel or less (the Welcome intro is the deliberate exception).
- **Do** make things appear solid and move into place: glide up, slide from behind a mask, or pop from scale 0.
- **Do** keep hover lifts small (4px) and pair them with the Bezel plus Shadow.
- **Do** use Phosphor Light icons, and the bundled single-colour brand SVGs for brand marks.

### Don't:
- **Don't** fade or blur anything in: nothing animates from opacity 0 or from a blur.
- **Don't** add a second accent colour, extra gradients, or decorative stickers and badges.
- **Don't** bring back the old brutalist look: thick borders, hard offset shadows, coral, yellow or blue.
- **Don't** put `backdrop-filter`, `filter` or `transform` on the navbar or any ancestor of the mobile menu.
- **Don't** use Sage Light as body text.
- **Don't** put imagery in the hero; the work lives in Selected Work.
- **Don't** mix Font Awesome with Phosphor.
