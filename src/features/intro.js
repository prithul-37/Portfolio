// Welcome intro: the overlay animates purely in CSS (styles/intro.css).
// A click or key press sends it off early (html.intro-skip); once it has
// slid away, drop it from the DOM.
export function initIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  if (!document.documentElement.hasAttribute('data-intro')) {
    intro.remove();
    return;
  }
  const skip = () => document.documentElement.classList.add('intro-skip');
  const opts = { once: true, capture: true };
  window.addEventListener('pointerdown', skip, opts);
  window.addEventListener('keydown', skip, opts);

  intro.addEventListener('animationend', (e) => {
    if (e.target !== intro) return;
    intro.remove();
    window.removeEventListener('pointerdown', skip, opts);
    window.removeEventListener('keydown', skip, opts);
  });
}
