// Game popups. Each card's "View details" button (data-game="<id>", stretched
// over the whole card) opens <dialog id="game-<id>">, rendered at build time
// by templates/work.js. The left side is a swipeable gallery: a horizontal
// scroll-snap track, so touch swipe is native. An IntersectionObserver on the
// slides (never a scroll listener) tracks which one is showing, to light its
// dot and pause any trailer that has slid away.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupGallery(dialog) {
  const track = dialog.querySelector('.gm-track');
  if (!track) return { reset() {}, step() {}, pause() {} };

  const slides = [...track.querySelectorAll('.gm-slide')];
  const dots = [...dialog.querySelectorAll('.gm-dot')];
  const prev = dialog.querySelector('.gm-prev');
  const next = dialog.querySelector('.gm-next');
  const videos = [...track.querySelectorAll('video')];
  let index = 0;

  const go = (i, smooth = true) => {
    const target = Math.min(Math.max(i, 0), slides.length - 1);
    track.scrollTo({ left: target * track.clientWidth, behavior: smooth && !reduceMotion() ? 'smooth' : 'auto' });
  };

  const setActive = (i) => {
    index = i;
    dots.forEach((d, n) => d.setAttribute('aria-current', n === i ? 'true' : 'false'));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
    slides.forEach((s, n) => { if (n !== i) s.querySelector('video')?.pause(); });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(slides.indexOf(e.target)); });
  }, { root: track, threshold: 0.6 });
  slides.forEach((s) => observer.observe(s));

  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  setActive(0);

  return {
    reset() { go(0, false); setActive(0); },
    step(d) { go(index + d); },
    pause() { videos.forEach((v) => v.pause()); },
  };
}

export function initGallery() {
  const galleries = new Map();

  document.querySelectorAll('dialog.game-modal').forEach((dialog) => {
    const gallery = setupGallery(dialog);
    galleries.set(dialog, gallery);

    dialog.querySelector('.gm-close').addEventListener('click', () => dialog.close());
    // The dialog box is the full-screen backdrop; the panel sits inside it
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      gallery.pause();
      document.documentElement.classList.remove('modal-open');
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.target.closest('video')) return;
      if (e.key === 'ArrowLeft') gallery.step(-1);
      else if (e.key === 'ArrowRight') gallery.step(1);
    });
  });

  document.querySelectorAll('.card-open[data-game]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // A data-game id with no matching popup is a template bug; say so
      const dialog = document.getElementById(`game-${btn.dataset.game}`);
      if (!dialog) { console.warn(`[gallery] No popup for "${btn.dataset.game}".`); return; }
      document.documentElement.classList.add('modal-open');
      dialog.showModal();
      galleries.get(dialog).reset();
      dialog.querySelector('.gm-close').focus();
    });
  });
}
