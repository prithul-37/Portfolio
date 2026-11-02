// Rows in the "Path" section, newest first. `kind` is 'work' or 'edu'.
// The `now: true` row is highlighted and labelled "Now"; keep exactly one.
// Date ranges use a plain hyphen ("Sep 2026 - Present"), never an em dash.
import { profile } from './profile.js';

export const path = [
  { years: 'Sep 2026 - Present', role: profile.role, org: profile.company.name, kind: 'work', now: true },
  { years: 'Oct 2025 - Jul 2026', role: 'Unity Game Developer', org: 'Riseup Labs', kind: 'work' },
  { years: 'Jun 2025 - Oct 2025', role: 'Software Engineer II (Unity)', org: 'Nagorik Technologies Ltd.', kind: 'work' },
  { years: 'Jun 2024 - Jun 2025', role: 'Junior Software Engineer (Unity)', org: 'Nagorik Technologies Ltd.', kind: 'work' },
  { years: 'Until Jun 2024', role: 'Freelance Game Developer', org: 'Remote, during B.Sc. studies', kind: 'work' },
  { years: '2018 - 2024', role: 'B.Sc. in Computer Science & Engineering', org: 'Khulna University of Engineering & Technology (KUET)', kind: 'edu' },
];
