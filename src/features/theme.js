// Light / dark toggle. The initial theme is set pre-paint by the inline
// <head> script in index.html; this only handles switching, persistence, and
// keeping the browser UI colour in sync.
const THEME_COLORS = { light: '#f6f3ec', dark: '#141916' };

export function initTheme() {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animTimer = null;

  const syncMeta = (theme) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.light);
  };
  // The toggle is a "Dark mode" switch: pressed when dark, titled with what a click does
  const toggle = document.querySelector('.theme-toggle');
  const syncToggle = (theme) => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  };
  syncMeta(root.getAttribute('data-theme') || 'light');
  syncToggle(root.getAttribute('data-theme') || 'light');

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (!reduceMotion) {
      // Cross-fade surfaces while the theme flips
      root.classList.add('theme-anim');
      clearTimeout(animTimer);
      animTimer = setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    root.setAttribute('data-theme', next);
    syncMeta(next);
    syncToggle(next);
    try { localStorage.setItem('pb-theme', next); } catch { /* storage blocked */ }
  }

  toggle?.addEventListener('click', toggleTheme);
}
