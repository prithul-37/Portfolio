# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for a game developer. It's a **static site** built with vanilla HTML, CSS, and JavaScript (no build tools or dependencies). The site showcases game development projects and professional information.

## Architecture

### File Structure

```
Portfolio/
├── index.html           # Main page structure (all sections in one file)
├── script.js            # JavaScript functionality
├── styles.css           # All CSS (1250+ lines, organized by section)
├── /Res/                # Resources (background image, profile photo, icons)
├── /Icons/              # Game project logos
└── /GameMedia/          # Game screenshots and video trailers
```

### Key Sections (in index.html)

Each section is a self-contained `<section>` element with an ID for navigation:
- **#home** - Hero section with particle animation
- **#about** - Profile, bio, and action buttons
- **#skills** - Technical skills organized by category
- **#projects** - Game projects grid with modals
- **#contact** - Social links and job information

### CSS Organization (styles.css)

CSS is organized by section with clear comments. Responsive design uses `@media (max-width: 768px)` as the primary breakpoint. Key animations include:
- `@keyframes fadeInUp` - Element entrance animation
- `@keyframes pulse` - Status badge pulse
- `@keyframes glitch` - Hover effect on hero title
- `@keyframes subtlePulse` - Project icon pulse
- `@keyframes float` - Game controller corner icon

### JavaScript Functionality (script.js)

**ParticleSystem class** (lines 100-264): Canvas-based particle animation
- 150 particles with color cycling and neon glow
- Mouse interaction: draws connections to nearby particles
- Click interaction: particles repel from click point
- Respects canvas bounds with velocity clamping

**Gallery system** (lines 280-462): Modal for game media
- Data structure `gameMedia` maps game IDs to images/videos
- `openGallery(gameId)` - Opens modal with thumbnails
- `showMedia(index)` - Displays image or video
- Keyboard navigation (arrow keys, escape)
- Video auto-pause on close

**Utility functions**:
- `typeWriter()` - Unused typing effect (commented out)
- Smooth scroll on anchor links
- Navbar logo change on scroll position
- IntersectionObserver for fade-in animations on project cards
- CV download tracking (console.log only)

## Common Development Tasks

### Adding a New Game Project

1. **Add project data to gallery** (script.js, line 281):
   ```javascript
   'game-id': {
       title: 'Game Name',
       media: [
           { type: 'image', src: 'GameMedia/FolderName/file.jpg', thumb: 'GameMedia/FolderName/thumb.jpg' },
           // more media items...
       ]
   }
   ```

2. **Add project card** (index.html, projects section):
   ```html
   <div class="project-card featured" onclick="openGallery('game-id')">
       <div class="project-icon game-id">
           <img src="Icons/GameLogo.png" alt="Game Name" />
           <div class="icon-bg"></div>
       </div>
       <!-- project details -->
   </div>
   ```

3. **Add icon styling** (styles.css, around line 720):
   ```css
   .game-id .icon-bg {
       background: linear-gradient(135deg, #colorA 0%, #colorB 100%);
   }
   ```

4. **Create media folders**: `GameMedia/GameName/` with screenshots and a `Thumb.jpg/png`

### Updating Skills Section

Edit the skill categories in index.html (lines 116-166). Each category is a `<div class="skill-category">` with a heading and `<div class="skill-tags">` containing `<span>` elements.

### Changing Colors/Theme

Primary colors are defined in CSS as gradients and RGBA values. Key color variables used:
- `#6b7280` - Primary gray (buttons, accents)
- `#f59e0b` - Accent gold (hover states, featured borders)
- `#1f2937` - Dark backgrounds
- `#111827` - Darker backgrounds
- `#e5e7eb` - Light text

### Adding Contact Method

In the contact section (index.html, lines 334-355), add a new contact button:
```html
<a href="..." target="_blank" class="contact-btn CLASS-NAME">
    <i class="fab fa-ICON"></i>
    <span>Label</span>
</a>
```

Then add hover styling in styles.css (around line 945):
```css
.contact-btn.CLASS-NAME:hover {
    background: rgba(R, G, B, 0.2);
    border-color: #RRGGBB;
}
```

## Important Notes

- **No build process** - This is a static site. Changes to HTML/CSS/JS take effect immediately
- **Single HTML file** - All sections and content are in index.html for simplicity
- **Canvas performance** - The particle system animates 150 particles with requestAnimationFrame
- **Mobile responsive** - Test changes at 768px and below breakpoints
- **Gallery modal** - Renders dynamically from gameMedia data structure; ensure image paths are correct
- **External dependencies** - Only Font Awesome icons (CDN) and Google Fonts (CDN) are external

## Hosting and Deployment

The site is a plain static site ready to serve as-is. No build step needed. All media paths are relative (`GameMedia/...`, `Icons/...`, etc.), so ensure the folder structure is preserved in deployment.
