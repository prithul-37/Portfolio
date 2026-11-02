// Scroll-in motion: `.reveal` glides up, and each section band slides in.

export function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.06}s`;
    observer.observe(el);
  });

  // Footer name: its letters drop in once it is on screen (styles/footer.css)
  document.querySelectorAll('.foot-mark').forEach((el) => observer.observe(el));
}

// Section bands (styles/bands.css) slide in sideways once a section's top is
// 15% into the viewport. The <section> box itself never moves, so it is a
// stable thing to observe.
export function initBands() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('band-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -15% 0px' });

  document.querySelectorAll('body > section').forEach((el) => observer.observe(el));
}
