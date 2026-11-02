// Navbar: scrolled state, mobile menu, and smooth in-page links.
// Nothing here listens on scroll; the scrolled state comes from an
// IntersectionObserver watching a 1px sentinel 40px down the page.

function initScrolledState() {
  const navbar = document.getElementById('navbar');
  const sentinel = document.getElementById('nav-sentinel');
  if (!navbar || !sentinel) return;
  new IntersectionObserver(([entry]) => {
    navbar.classList.toggle('scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

export function initNav() {
  initScrolledState();

  const menu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.getElementById('nav-backdrop');

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    backdrop?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const closeMenu = () => { if (menu.classList.contains('open')) setMenu(false); };

  hamburger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  backdrop?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Smooth-scroll in-page links and close the mobile menu on the way
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    });
  });
}
