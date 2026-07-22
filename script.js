/* =========================================================================
   PRITHUL BISWAS — Studio Dossier · behaviour
   ========================================================================= */

// ---- Smooth scroll + close mobile menu ------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
    });
});

// ---- Scroll parallax -------------------------------------------------------
// Elements with data-parallax="<speed>" get a translateY of scrollY * speed,
// exposed as the CSS var --py so it composes with any existing transform.
// Negative speed = moves opposite to scroll (foreground exits faster).
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    let ticking = false;
    function update() {
        const y = window.scrollY;
        items.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0;
            el.style.setProperty('--py', (y * speed).toFixed(1) + 'px');
        });
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
})();

// ---- Navbar background on scroll -------------------------------------------
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile menu -----------------------------------------------------------
function setMobileMenu(open) {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const backdrop = document.getElementById('nav-backdrop');
    navMenu.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
}
function toggleMobileMenu() {
    setMobileMenu(!document.querySelector('.nav-menu').classList.contains('open'));
}
function closeMobileMenu() {
    if (document.querySelector('.nav-menu').classList.contains('open')) setMobileMenu(false);
}

// ---- Reveal-on-scroll + stat counters -------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.06}s`;
        revealObserver.observe(el);
    });

    // Hero stat count-up
    const statObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            let cur = 0;
            const step = Math.max(1, Math.ceil(target / 24));
            const tick = () => {
                cur = Math.min(target, cur + step);
                el.textContent = cur + suffix;
                if (cur < target) requestAnimationFrame(tick);
            };
            tick();
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));
});

// =========================================================================
//  Gallery System (game media modal)
// =========================================================================
const gameMedia = {
    'ant-march': {
        title: 'Ant March Adventure',
        media: [
            { type: 'image', src: 'GameMedia/AntMarch/screenshot1.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' },
            { type: 'image', src: 'GameMedia/AntMarch/screenshot2.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' },
            { type: 'image', src: 'GameMedia/AntMarch/screenshot3.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' },
            { type: 'image', src: 'GameMedia/AntMarch/screenshot4.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' },
            { type: 'image', src: 'GameMedia/AntMarch/screenshot5.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' },
            { type: 'image', src: 'GameMedia/AntMarch/screenshot6.jpg', thumb: 'GameMedia/AntMarch/Thumb.png' }
        ]
    },
    'zen-merge': {
        title: 'Zen Merge Puzzle',
        media: [
            { type: 'video', src: 'GameMedia/ZenMerge/Zen_Merg_trailer.mp4', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot1.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot2.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot3.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot4.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot5.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' },
            { type: 'image', src: 'GameMedia/ZenMerge/screenshot6.jpg', thumb: 'GameMedia/ZenMerge/Thumb.png' }
        ]
    },
    'color-craft': {
        title: 'Color Craft',
        media: [
            { type: 'image', src: 'GameMedia/ColorCraft/screenshot1.jpg', thumb: 'GameMedia/ColorCraft/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/ColorCraft/screenshot2.jpg', thumb: 'GameMedia/ColorCraft/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/ColorCraft/screenshot3.jpg', thumb: 'GameMedia/ColorCraft/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/ColorCraft/screenshot4.jpg', thumb: 'GameMedia/ColorCraft/Thumb.jpg' }
        ]
    },
    'leaping-frog': {
        title: 'Leaping Frog',
        media: [
            { type: 'video', src: 'GameMedia/LeapingFrog/gameplay.mp4', thumb: 'GameMedia/LeapingFrog/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/LeapingFrog/screenshot1.jpg', thumb: 'GameMedia/LeapingFrog/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/LeapingFrog/screenshot2.jpg', thumb: 'GameMedia/LeapingFrog/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/LeapingFrog/screenshot3.jpg', thumb: 'GameMedia/LeapingFrog/Thumb.jpg' },
            { type: 'image', src: 'GameMedia/LeapingFrog/screenshot4.jpg', thumb: 'GameMedia/LeapingFrog/Thumb.jpg' }
        ]
    }
};

let currentGame = '';
let currentMediaIndex = 0;

function openGallery(gameId) {
    currentGame = gameId;
    currentMediaIndex = 0;

    const gameData = gameMedia[gameId];
    if (!gameData) return;

    const modal = document.getElementById('gallery-modal');
    const title = document.getElementById('gallery-title');
    const thumbnailsContainer = document.getElementById('media-thumbnails');

    title.textContent = gameData.title;

    thumbnailsContainer.innerHTML = '';
    gameData.media.forEach((media, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = media.thumb;
        thumbnail.className = `thumbnail ${media.type}${index === 0 ? ' active' : ''}`;
        thumbnail.onclick = () => showMedia(index);
        thumbnailsContainer.appendChild(thumbnail);
    });

    showMedia(0);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showMedia(index) {
    const gameData = gameMedia[currentGame];
    if (!gameData || !gameData.media[index]) return;

    currentMediaIndex = index;
    const media = gameData.media[index];
    const currentMediaElement = document.getElementById('current-media');
    const currentVideoElement = document.getElementById('current-video');

    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    if (media.type === 'image') {
        currentMediaElement.src = media.src;
        currentMediaElement.style.display = 'block';
        currentVideoElement.style.display = 'none';
        currentVideoElement.pause();
    } else if (media.type === 'video') {
        currentVideoElement.querySelector('source').src = media.src;
        currentVideoElement.load();
        currentVideoElement.style.display = 'block';
        currentMediaElement.style.display = 'none';
    }

    updateNavigationButtons();
}

function updateNavigationButtons() {
    const gameData = gameMedia[currentGame];
    document.getElementById('prev-media').disabled = currentMediaIndex === 0;
    document.getElementById('next-media').disabled = currentMediaIndex === gameData.media.length - 1;
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('current-video').pause();
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementsByClassName('gallery-close')[0];
    const prevBtn = document.getElementById('prev-media');
    const nextBtn = document.getElementById('next-media');

    closeBtn.onclick = closeGallery;
    modal.onclick = (event) => { if (event.target === modal) closeGallery(); };

    prevBtn.onclick = () => { if (currentMediaIndex > 0) showMedia(currentMediaIndex - 1); };
    nextBtn.onclick = () => {
        const gameData = gameMedia[currentGame];
        if (currentMediaIndex < gameData.media.length - 1) showMedia(currentMediaIndex + 1);
    };

    document.addEventListener('keydown', function (event) {
        if (modal.style.display !== 'block') return;
        if (event.key === 'Escape') closeGallery();
        else if (event.key === 'ArrowLeft' && currentMediaIndex > 0) showMedia(currentMediaIndex - 1);
        else if (event.key === 'ArrowRight') {
            const gameData = gameMedia[currentGame];
            if (currentMediaIndex < gameData.media.length - 1) showMedia(currentMediaIndex + 1);
        }
    });

    // Open gallery from cards (click + keyboard), but let store links behave
    document.querySelectorAll('.game-card[data-gallery]').forEach(function (card) {
        const open = () => openGallery(card.dataset.gallery);
        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            open();
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
    });

    // Stop store links from triggering the card's gallery click
    document.querySelectorAll('.store-btn').forEach(link => {
        link.addEventListener('click', (e) => e.stopPropagation());
    });
});

// ---- Click-to-copy (Discord username) -------------------------------------
document.querySelectorAll('[data-copy]').forEach(function (btn) {
    const label = btn.querySelector('.copy-label') || btn;
    const original = label.textContent;
    let resetTimer = null;

    function flashCopied() {
        btn.classList.add('copied');
        label.textContent = 'Copied!';
        btn.blur();
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            label.textContent = original;
            btn.classList.remove('copied');
        }, 1400);
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* no-op */ }
        ta.remove();
    }

    btn.addEventListener('click', function () {
        const text = btn.dataset.copy;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(flashCopied).catch(() => { fallbackCopy(text); flashCopied(); });
        } else {
            fallbackCopy(text);
            flashCopied();
        }
    });
});
