// =========================================================================
//  Games shown in "Selected work", in display order.
//
//  Each game is a card (cover, genre, title, summary) that opens a popup
//  with a swipeable gallery on the left and the details on the right:
//  platforms, title, genre, summary, my contribution, then store links.
//
//  Layout rule: `featured` spans both columns (cover left, text right). The
//  rest sit two-up, so keep the number of non-featured games even or the
//  grid ends on a lone card.
//
//  Platforms are derived from `stores` (play = Android, appStore = iOS).
//  `cover` is the 3-screenshot strip on the card; without one the card shows
//  the logo. `media` is the popup gallery; without it the popup shows the
//  logo. Point at the sized derivatives (-sm for covers, -md for media),
//  never the multi-MB originals. Paths are relative to src/assets/.
//
//  This file is read at build time only (templates render cards and popups),
//  so it can stay plain data.
// =========================================================================

// screenshot1-md.jpg … screenshotN-md.jpg in one game folder
const screens = (folder, n) =>
  Array.from({ length: n }, (_, i) => ({ type: 'image', src: `GameMedia/${folder}/screenshot${i + 1}-md.jpg` }));
const coverShots = (folder) =>
  [1, 2, 3].map((i) => `GameMedia/${folder}/screenshot${i}-sm.jpg`);

export const games = [
  {
    id: 'color-farm',
    title: 'Color Farm',
    featured: true,
    logo: 'Icons/ColorFarmLogo-160.jpg',
    art: 'GameMedia/ColorFarm/cover-md.jpg',   // key art: fills the card cover and the popup's left side
    genre: 'Casual Puzzle',
    studio: 'Chichingo',
    summary: 'Send chickens into nests to shoot the coloured cubes of a picture on a spinning tray, and clear it before the nests jam.',
    // Longer text for the popup; the card uses `summary`
    about: 'A picture made of coloured cubes sits on a spinning tray. Players send chickens from waiting lines into five nests, and each chicken shoots the cubes of its own colour that it can see. Turn the tray to open new angles and pick the order of chickens carefully to clear the picture before the nests jam. Prototyped with Supersonic.',
    contribution: [
      'Visibility-based puzzle rules: a chicken only hits cubes exposed from its nest\'s angle, so turning the board is part of every decision.',
      'Adaptive difficulty: a player-behaviour tracker records each attempt and tunes the challenge to the player\'s skill.',
      'Data-driven levels: levels are JSON files, and an editor tool rebuilds the level index, so designers add a level just by adding a file.',
      'The full game loop: onboarding tutorials, hints, a coin economy, popups, transitions, and audio and haptic feedback.',
      'A modular architecture: one manager per system, with a central state machine ordering each frame\'s updates.',
      'Editor tools that build the HUD, popups, tutorials and decorations, plus custom URP shaders for screen wipes and tutorial spotlights.',
      'An Android IL2CPP/ARM64 build targeting 60 FPS, with safe-area support and compression tuned for a ~59 MB APK.',
    ],
    tech: ['Unity 6', 'C#', 'URP', 'DOTween', 'TextMesh Pro', 'Input System'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=com.chichingo.colorfarm',
    },
    media: [{ type: 'video', src: 'GameMedia/ColorFarm/gameplay.mp4' }],
  },
  {
    id: 'ant-march',
    title: 'Ant March Adventure',
    logo: 'Icons/AntGameLogo-160.jpg',
    genre: 'Roguelike',
    studio: 'Nagorik Technologies',
    summary: 'Collect eggs to grow a line of ants, protect them from bugs, and lead them home.',
    about: 'A roguelike: lead your line of ants home and clear every level without failing. Collect eggs to grow the line, protect it from bugs, and upgrade your skills and boosters after each level. Levels are procedurally generated, with changing weather.',
    contribution: [
      'As the main developer, took the game from a 3 to 4 day prototype to a finished release in 15 days.',
      'Built every core system: the ant line and how it follows, egg collecting, enemy bugs, obstacles, dynamic weather, the skill system, procedural levels and the UI.',
      'Optimized the ant-following algorithm so long lines of ants move smoothly. This was the hardest part of the project.',
      'Shaped the gameplay feel and mechanics from start to finish.',
    ],
    tech: ['Unity', 'C#', 'DOTween', 'ScriptableObjects'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=tech.atm.antmarchadventure',
      appStore: 'https://apps.apple.com/mn/app/ant-march-adventure-roguelike/id6745928475',
    },
    cover: coverShots('AntMarch'),
    media: [{ type: 'video', src: 'GameMedia/AntMarch/gameplay.mp4' }, ...screens('AntMarch', 6)],
  },
  {
    id: 'zen-merge',
    title: 'Zen Merge Puzzle',
    logo: 'Icons/ZenMergeLogo-160.jpg',
    genre: 'Puzzle',
    studio: 'Nagorik Technologies',
    summary: 'Guide Yin and Yang along mirrored paths and solve mind-bending puzzles to unite them on the Harmony Tile.',
    about: 'Swipe to send Yin and Yang sliding across a grid of tiles floating on a forest pond. They move at the same time in mirrored directions, and each slides until something stops it. Use crates and gaps to steer both onto the Harmony Tile, where they merge into one. Marked tiles show where you can move next. Levels unlock along an island map.',
    contribution: [
      'As the core developer, built every system in the game, from the mirrored sliding mechanics to the puzzle tiles, going from a 3 to 4 day prototype to a finished release in 15 days.',
      'Designed some of the levels as well as building the game.',
      'Optimized the 3D game to run on a wide range of devices, reaching 55 to 60+ FPS depending on the device. This was the hardest part of the project, and where I learned most of my optimization techniques.',
    ],
    tech: ['Unity', 'C#', 'Blender'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=tech.atm.zenmergepuzzle',
      appStore: 'https://apps.apple.com/us/app/zen-match-saga/id6745928396',
    },
    cover: coverShots('ZenMerge'),
    media: [{ type: 'video', src: 'GameMedia/ZenMerge/Zen_Merg_trailer.mp4' }, ...screens('ZenMerge', 6)],
  },
  {
    id: 'pop-n-sort',
    title: "Pop'n Sort",
    featured: true,
    logo: 'Icons/Pop n Sort icon-160.jpg',
    genre: 'Hybrid-Casual Sorting',
    studio: 'Riseup Labs',
    summary: 'Pop candy balloons, match three of a kind in the tray, and clear the level goal before the timer runs out.',
    about: 'Tap the balloons piled on the board to pop out the candies inside. Each candy drops into a tray at the top, and three of a kind clear with a burst. Collect the level\'s goal before the clock runs out, and keep the tray from filling up. Rockets blast through the pile, and a win streak earns more rockets for later levels. Prototyped with Supersonic.',
    contribution: [
      'As the core developer, built a playable prototype with the core logic in 3 to 5 days.',
      'Took it to a first full version in 25 to 28 days, with 40 levels, boosters and blockers.',
      'Built all the core systems in Unity 2D: the balloon pile, the matching tray, rockets and other boosters, blockers, goals and the timer, win streaks, the economy, and the UI and popups.',
      'Built a separate level designer tool. This was the hardest part of the project.',
      'Built custom Claude Code Skills that generate levels from settings such as the number of candies and balloons and the target difficulty, which saved our level designer a lot of time.',
    ],
    tech: ['Unity 2D', 'C#', 'DOTween', 'ScriptableObjects', 'Claude Code'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=com.riseuplabs.popnsort&hl=en',
      appStore: 'https://apps.apple.com/us/app/pop-n-sort/id6758375307',
    },
    // Trailer only: the gameplay video shows everything the screenshots did
    media: [{ type: 'video', src: 'GameMedia/PopnSort/trailer.mp4' }],
  },
  {
    id: 'color-craft',
    title: 'Color Craft',
    logo: 'Icons/ColorCraftLogo-160.jpg',
    genre: 'Casual Painting',
    studio: 'Nagorik Technologies',
    summary: 'A level-based painting game: replicate reference images to score points.',
    about: 'A level-based painting game. Study the target image, then mix the colours you need on the Paint Board by squeezing paint tubes into a jar. In the Color Lab, spray the picture layer by layer through stencils and submit it to score how closely it matches the target.',
    contribution: [
      'As the core developer, built the core mechanics in 15 to 18 days and finished the game in 28 to 30 days.',
      'Built every system myself: colour mixing with Shader Graph, stencil spray painting layer by layer, scoring against the target image, the level flow and the UI.',
      'Wrote the water shader behind the colour mixing, so paint blends like liquid in the jar. This was the hardest part of the project, and where I learned shader programming.',
      'Optimized the spray painting mechanic: FPS used to drop while spraying, and after the fix it holds around 60 FPS.',
    ],
    tech: ['Unity', 'C#', 'Shader Graph'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=tech.atm.colorcraft&hl=en',
      appStore: 'https://apps.apple.com/us/app/color-craft-mix-match-puzzle/id6741428276',
    },
    cover: coverShots('ColorCraft'),
    media: screens('ColorCraft', 4),
  },
  {
    id: 'supermarket-sort-factory',
    title: 'Supermarket Sort Factory',
    logo: 'Icons/Super Market Sort Factory-160.jpg',
    genre: 'Hybrid-Casual Sorting',
    studio: 'Riseup Labs',
    summary: 'A live sorting and matching hybrid-casual game, prototyped with Moonee.',
    contribution: [
      'Built the core sorting loop.',
      'Built the UI and progression systems.',
      'Shipped it to the App Store under Riseup Labs.',
    ],
    tech: ['Unity', 'C#', 'DOTween', 'ScriptableObjects'],
    stores: {
      appStore: 'https://apps.apple.com/us/app/supermarket-sort-factory/id6755230632',
    },
  },
  {
    id: 'sanam',
    title: 'Sanam',
    logo: 'Icons/SanamLogo-160.jpg',
    genre: 'Strategy',
    studio: 'Freelance for 101-Dev',
    summary: 'A camel herding strategy game where players raise and grow their own herd.',
    contribution: [
      'Joined an existing game and got up to speed on its unfamiliar codebase, which was the first hurdle.',
      'Built the livestock farming system and kept every player\'s farm in sync with the backend. This was the main challenge.',
      'Added a day-night simulation.',
      'Developed meta features around the core loop.',
    ],
    tech: ['Unity', 'C#'],
    stores: {
      appStore: 'https://apps.apple.com/us/app/%D8%B3%D9%86%D8%A7%D9%85-%D8%B1%D8%A7%D8%B9%D9%8A-%D8%A7%D9%84%D9%86%D8%B8%D8%B1/id6755181382',
    },
  },
  {
    id: 'churchill-solitaire',
    title: 'Churchill Solitaire',
    logo: 'Icons/ChurchillSolitaireLogo-160.jpg',
    genre: 'Card',
    studio: 'Riseup Labs',
    status: 'In development',
    summary: 'The two-deck solitaire variant Winston Churchill played, originally built in Flutter and now moving to Unity.',
    about: 'The two-deck solitaire variant Winston Churchill played. The original game was built in Flutter, and I worked on moving it to Unity.',
    contribution: [
      'Rebuilt the full gameplay logic and UI logic in Unity in about a week, migrating from the original Flutter game.',
      'Added an automatic level generator, which the original game didn\'t have. It takes a seed, shuffles the deck with it, and keeps only the deals the solver proves can be won.',
      'Wrote the solver: a depth-first backtracking search that checks whether a deal can be won. Optimizing it was the hardest part. A check takes from under a second to two or three minutes, depending on the deal and the device.',
      'Added smoother card animations, which the original game was missing.',
    ],
    note: 'The Unity version is still in progress and not yet released. The store links point to the current Flutter version.',
    tech: ['Unity', 'C#', 'Flutter', 'Procedural Generation'],
    stores: {
      play: 'https://play.google.com/store/apps/details?id=com.productiveedge.churchill&hl=en',
      appStore: 'https://apps.apple.com/us/app/churchill-solitaire/id1030804846',
    },
  },
];
