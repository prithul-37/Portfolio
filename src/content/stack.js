// Rows in the "Stack" section, top to bottom. Main rows list only what the
// games on the page back up; `also: true` is a quieter row for the rest.
export const stack = [
  { label: 'Engine & Language', tags: ['Unity', 'C#'] },
  { label: 'Platforms', tags: ['Android', 'iOS', 'PC'] },
  {
    label: 'Systems & Patterns',
    tags: [
      'Data-Driven Design (ScriptableObjects)', 'Observer · State/FSM · Command',
      'Dynamic Difficulty Adjustment', 'Procedural Generation',
      'Unity Job System',
      'Mobile Performance Optimization',
    ],
  },
  {
    label: 'AI-Assisted Dev',
    tags: [
      'Claude Code', 'Custom Claude Code Skills',
      'Custom Level Editor', 'AI Level Generation & Testing',
      'AI Gameplay Simulation', 'Automated Difficulty Tuning',
    ],
  },
  {
    label: 'Release & SDKs',
    tags: [
      'Google Play Releases', 'iOS Provisioning & App Store',
      'Firebase', 'RevenueCat (IAP)',
      'Ad & Attribution SDKs', 'Auth & Unity Gaming Services',
    ],
  },
  { label: 'Tools', tags: ['Git', 'Blender', 'Shader Graph', 'DOTween'] },
  {
    label: 'Also worked with',
    also: true,
    tags: ['Unreal Engine', 'C++', 'Python', 'JavaScript', 'Multiplayer Netcode (Unity NGO)'],
  },
];
