// =========================================================================
//  Who, what, and how to reach me. All page copy that isn't a list lives here.
//
//  Fields named `html` (or ending in `Html`) are inserted as-is, so they can
//  carry links and <em>/<strong>. Every other string is escaped.
//  House rule: no em dashes anywhere in site text.
// =========================================================================

const chichingo = { name: 'Chichingo', url: 'https://www.chichingo.com/' };
const chichingoLink = `<a href="${chichingo.url}" target="_blank" rel="noopener">${chichingo.name}</a>`;

export const profile = {
  firstName: 'Prithul',
  lastName: 'Biswas',
  nickname: 'Dip',
  fullName: 'Prithul Biswas Dip',
  shortName: 'Prithul Biswas',
  email: 'prithuldip@gmail.com',
  city: 'Dhaka',
  country: 'Bangladesh',
  countryCode: 'BD',

  // The headline role. Also used by the Path list (`now: true` row), the
  // JSON-LD and the About "Now" row, so a job change is mostly made here.
  role: 'Co-Founder & Lead Game Developer',
  company: chichingo,

  linkedin: { url: 'https://linkedin.com/in/prithul-biswas', handle: 'in/prithul-biswas' },
  github: 'https://github.com/prithul-37',
  discord: 'prithuldip',

  // The PDF itself is imported in src/features/links.js; this is the name it saves as
  // show: false hides every Download CV button (hero, navbar, mobile pill)
  cv: { show: false, downloadName: 'Prithul_Biswas_Dip_CV.pdf' },
  portrait: 'Res/Me.JPEG',
  // Cartoon of me: SVG for modern browsers, PNG fallback, opaque PNG for iOS
  favicon: { svg: 'Res/avatar.svg', png: 'Res/avatar-32.png', touch: 'Res/avatar-touch-180.png' },

  // Shown after the copyright year in the footer
  tagline: 'Built with care, one level at a time.',
};

export const seo = {
  siteUrl: 'https://prithul-37.github.io/Portfolio/',
  siteName: 'Prithul Biswas | Portfolio',
  title: 'Prithul Biswas | Game Developer & Co-founder of Chichingo',
  description:
    "Unity game developer and co-founder of the game studio Chichingo, shipping mobile titles to Google Play & the App Store (Pop'n Sort, Supermarket Sort Factory, Ant March Adventure & more) and indie PC games. C# · gameplay systems · live-ops.",
  ogDescription:
    "Co-founder & lead game developer at the game studio Chichingo. Previously core dev on Pop'n Sort & Supermarket Sort Factory. Unity · C# · gameplay · live-ops.",
  twitterDescription: 'Co-founder & lead game developer at Chichingo. Unity · C# · gameplay · live-ops.',
  keywords:
    'Prithul Biswas, Unity Game Developer, C#, mobile games, hybrid-casual, game programmer, Dhaka, Bangladesh',
  // Served from public/ so it keeps this exact, unhashed URL
  ogImage: 'https://prithul-37.github.io/Portfolio/Res/og-image.jpg',
  ogImageAlt: 'Prithul Biswas, Unity Game Developer',
  knowsAbout: ['Unity', 'C#', 'Game Development', 'Mobile Games', 'PC Games', 'Live-Ops'],
};

export const hero = {
  eyebrow: 'Unity game developer · Co-founder, Chichingo',
  ledeHtml: `I take mobile games from the first playable prototype to
    live updates on the stores, and I build the tools that make the
    levels: editors, AI level generators and automated playtesting.<br />
    Co-founder of the game studio ${chichingoLink}.`,
};

// Hero stat row: `count` + optional `suffix`, or `text`.
export const stats = [
  { count: 10, suffix: '+', label: 'Titles shipped' },
  { count: 3, suffix: '+', label: 'Years in production' },
  { count: 4, label: 'Studios shipped with' },
  { text: '3-5', label: 'Days to a playable prototype' },
];

export const about = {
  titleHtml: 'The dev behind <em>the games</em>',
  caption: 'Making games in Dhaka',
  paragraphsHtml: [
    `I'm Prithul Biswas Dip, a Unity game developer who's just as happy
    shipping a live title as I am getting lost in a boss fight, a fresh
    anime, or a late-night movie. That pull toward great stories and
    playful experiences is exactly what got me making games in the first
    place.`,
    `Today I'm co-founder and lead game developer at ${chichingoLink},
    a small game studio in Dhaka that I co-founded in 2026. We make
    casual puzzle games for mobile, and Color Farm is our first release.`,
    `Previously, as a core Unity developer at Riseup Labs, I worked on two
    live hybrid-casual titles prototyped in partnership with Supersonic and
    Moonee. I owned client-side development end to end, including gameplay
    systems, UI, data-driven content, third-party SDK integrations, and
    store releases. Before that, I contributed to four shipped titles at
    Nagorik Technologies.`,
    `I also bring AI into the production workflow. Using custom Claude Code
    skills, I built a complete level-design pipeline: a custom level
    editor, an AI-assisted level generator and tester, a dynamic
    difficulty system, AI-driven gameplay simulation for automated
    playtesting, and an automated level difficulty tuner. Together, these
    tools sped up content production on Pop'n Sort.`,
  ],
  meta: [
    { key: 'Now', valueHtml: `Co-Founder · ${chichingoLink}` },
    { key: 'Platforms', valueHtml: 'Mobile first · Indie PC' },
    { key: 'Focus', valueHtml: 'Hybrid-casual · Puzzle · Live-ops' },
  ],
};

export const contact = {
  titleHtml: "Let's build something <em>fun.</em>",
  lede: "Building a mobile or indie PC game in Unity, or want a second pair of hands on one? I'm open to collaborations and freelance work.",
  // `brand` is a logo in src/assets/Icons/brands/ (or use `icon` for Phosphor).
  // `copy` buttons copy their value instead of navigating
  buttons: [
    { brand: 'gmail', label: 'Email', sub: profile.email, href: `mailto:${profile.email}` },
    { brand: 'linkedin', label: 'LinkedIn', sub: profile.linkedin.handle, href: profile.linkedin.url, external: true },
    { brand: 'discord', label: 'Discord', sub: profile.discord, copy: profile.discord,
      ariaLabel: `Copy Discord username ${profile.discord}` },
  ],
  nowHtml: 'Co-founder at <strong>Chichingo</strong> · open to collaborations &amp; freelance Unity work',
};
