// Welcome intro: the overlay animates purely in CSS (styles/intro.css).
// Once it has slid away, drop it from the DOM.
export function initIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  if (!document.documentElement.hasAttribute('data-intro')) {
    intro.remove();
    return;
  }
  intro.addEventListener('animationend', (e) => {
    if (e.target === intro) intro.remove();
  });
}
