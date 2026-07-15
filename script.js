/* =========================================================================
   INSERT COIN — Arcade / CRT Portfolio · behaviour
   ========================================================================= */

// ---- Smooth scroll + close mobile menu ------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ---- Navbar state + logo swap on scroll -----------------------------------
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const logoText = document.getElementById('nav-logo-text');
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    const homeHeight = homeSection.offsetHeight;

    if (window.scrollY > homeHeight * 0.3) {
        navbar.classList.add('scrolled');
        if (logoText.dataset.state !== 'name') {
            logoText.dataset.state = 'name';
            logoText.style.opacity = '0';
            setTimeout(() => {
                logoText.innerHTML = 'PRITHUL BISWAS';
                logoText.style.opacity = '1';
            }, 150);
        }
    } else {
        navbar.classList.remove('scrolled');
        if (logoText.dataset.state !== 'home') {
            logoText.dataset.state = 'home';
            logoText.style.opacity = '0';
            setTimeout(() => {
                logoText.innerHTML = '1UP&nbsp;· PRITHUL';
                logoText.style.opacity = '1';
            }, 150);
        }
    }
});

// ---- Reveal-on-scroll ------------------------------------------------------
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', function () {
    document
        .querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-btn')
        .forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${(i % 4) * 0.06}s`;
            observer.observe(el);
        });

    // HUD stat counters
    const hudObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            let cur = 0;
            const tick = () => {
                cur += Math.max(1, Math.ceil(target / 18));
                if (cur >= target) cur = target;
                el.textContent = String(cur).padStart(2, '0');
                if (cur < target) requestAnimationFrame(tick);
            };
            tick();
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.hud-num[data-count]').forEach(el => hudObserver.observe(el));
});

// ---- Mobile menu toggle ----------------------------------------------------
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// ---- CV download tracking --------------------------------------------------
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => console.log('CV downloaded'));
});

// ---- "CONTINUE?" countdown loop -------------------------------------------
(function continueCountdown() {
    const el = document.getElementById('continue-num');
    if (!el) return;
    let n = 9;
    setInterval(() => {
        n = n <= 0 ? 9 : n - 1;
        el.textContent = String(n).padStart(2, '0');
    }, 1000);
})();

// =========================================================================
//  Arcade Pixel Particle System (retheme of the neon field)
// =========================================================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.ripples = [];
        this.charge = null;        // active press-and-hold charge
        this.maxChargeMs = 1400;   // hold time for a full-power blast
        this.mouse = { x: null, y: null };
        this.maxDistance = 150;
        this.palette = ['#ff2e88', '#29f2ff', '#ffd23f', '#57ff8f', '#a86bff'];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    spawnParticle(fromEdge = false) {
        let x, y;
        if (fromEdge) {
            // enter from a random screen edge, then drift inward
            const side = Math.floor(Math.random() * 4);
            if (side === 0) { x = Math.random() * this.canvas.width; y = 0; }
            else if (side === 1) { x = this.canvas.width; y = Math.random() * this.canvas.height; }
            else if (side === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height; }
            else { x = 0; y = Math.random() * this.canvas.height; }
        } else {
            x = Math.random() * this.canvas.width;
            y = Math.random() * this.canvas.height;
        }
        const homeX = fromEdge ? Math.random() * this.canvas.width : x;
        const homeY = fromEdge ? Math.random() * this.canvas.height : y;
        return {
            x, y,
            hx: homeX, hy: homeY, // home anchor — particle springs back here after a blast
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: (Math.floor(Math.random() * 3) + 1) * 2, // pixel-blocky sizes
            opacity: fromEdge ? 0 : Math.random() * 0.4 + 0.35,
            targetOpacity: Math.random() * 0.4 + 0.35,
            color: this.palette[Math.floor(Math.random() * this.palette.length)]
        };
    }

    createParticles() {
        const count = Math.min(130, Math.floor((this.canvas.width * this.canvas.height) / 12000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push(this.spawnParticle(false));
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => { this.resize(); this.createParticles(); });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        const heroSection = document.getElementById('home');

        const startCharge = (x, y) => {
            this.charge = { x, y, start: performance.now() };
        };

        const releaseCharge = () => {
            if (!this.charge) return;
            const held = performance.now() - this.charge.start;
            const t = Math.min(1, held / this.maxChargeMs); // 0 = tap, 1 = full charge
            const big = Math.max(this.canvas.width, this.canvas.height);
            // every ripple property scales with how long the button was held
            this.ripples.push({
                x: this.charge.x,
                y: this.charge.y,
                radius: 0,
                maxRadius: big * (0.18 + 0.85 * t),
                speed: 4 + 11 * t,
                width: 28 + 80 * t,
                strength: 0.6 + 13 * t,
                power: t
            });
            this.charge = null;
        };

        heroSection.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            startCharge(e.clientX - rect.left, e.clientY - rect.top);
        });
        heroSection.addEventListener('mouseup', releaseCharge);
        heroSection.addEventListener('mouseleave', releaseCharge);

        heroSection.addEventListener('touchstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            startCharge(touch.clientX - rect.left, touch.clientY - rect.top);
        }, { passive: true });
        heroSection.addEventListener('touchend', releaseCharge);
        heroSection.addEventListener('touchcancel', releaseCharge);
    }

    drawConnections() {
        if (this.mouse.x === null || this.mouse.y === null) return;
        this.particles.forEach(p => {
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.maxDistance) {
                const opacity = (1 - dist / this.maxDistance) * 0.5;
                this.ctx.beginPath();
                this.ctx.strokeStyle = p.color;
                this.ctx.globalAlpha = opacity;
                this.ctx.lineWidth = 1.5;
                this.ctx.shadowColor = p.color;
                this.ctx.shadowBlur = 6;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                this.ctx.globalAlpha = 1;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            // weak spring back to home + damping + subtle wander:
            // the field stays evenly filled, so a blast bulges out then re-closes
            // the gap instead of leaving a permanent hole in the center.
            p.vx += (p.hx - p.x) * 0.0025;
            p.vy += (p.hy - p.y) * 0.0025;
            p.vx += (Math.random() - 0.5) * 0.05;
            p.vy += (Math.random() - 0.5) * 0.05;
            p.vx *= 0.93;
            p.vy *= 0.93;
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
            // ease respawned particles up to their target opacity
            if (p.opacity < p.targetOpacity) {
                p.opacity = Math.min(p.targetOpacity, p.opacity + 0.02);
            }
        });
    }

    updateRipples() {
        for (let r = this.ripples.length - 1; r >= 0; r--) {
            const ripple = this.ripples[r];
            const prevRadius = ripple.radius;
            ripple.radius += ripple.speed;

            // fade of the push as the wave expands and weakens
            const life = 1 - ripple.radius / ripple.maxRadius;

            this.particles.forEach(p => {
                const dx = p.x - ripple.x;
                const dy = p.y - ripple.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                // kick particles the wavefront is currently sweeping across
                if (dist > prevRadius - ripple.width && dist < ripple.radius + ripple.width) {
                    const band = 1 - Math.abs(dist - ripple.radius) / ripple.width;
                    const force = ripple.strength * Math.max(0, band) * life;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            });

            if (ripple.radius >= ripple.maxRadius) this.ripples.splice(r, 1);
        }
    }

    drawRipples() {
        this.ripples.forEach(ripple => {
            const life = 1 - ripple.radius / ripple.maxRadius;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#29f2ff';
            this.ctx.globalAlpha = 0.35 * life;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = '#29f2ff';
            this.ctx.shadowBlur = 12;
            this.ctx.stroke();
            // faint inner echo ring
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius * 0.72, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ff2e88';
            this.ctx.globalAlpha = 0.2 * life;
            this.ctx.shadowColor = '#ff2e88';
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
    }

    drawCharge() {
        if (!this.charge) return;
        const held = performance.now() - this.charge.start;
        const t = Math.min(1, held / this.maxChargeMs);
        const full = t >= 1;
        const radius = 8 + 56 * t;
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 70);
        const color = full ? '#ff2e88' : '#29f2ff';

        this.ctx.save();
        // charge ring — grows with hold time
        this.ctx.beginPath();
        this.ctx.arc(this.charge.x, this.charge.y, radius * (full ? pulse : 1), 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = 0.5 + 0.45 * t;
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 16 * pulse;
        this.ctx.stroke();
        // inner amber core building energy
        this.ctx.beginPath();
        this.ctx.arc(this.charge.x, this.charge.y, radius * 0.45 * pulse, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd23f';
        this.ctx.globalAlpha = 0.3 * t;
        this.ctx.shadowColor = '#ffd23f';
        this.ctx.fill();
        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(p => {
            // pixel square with neon glow
            this.ctx.globalAlpha = p.opacity;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateRipples();
        this.updateParticles();
        this.drawRipples();
        this.drawParticles();
        this.drawConnections();
        this.drawCharge();
        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', function () {
    new ParticleSystem();
});

// =========================================================================
//  Gallery System (game media modal) — data + controls preserved
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
    const prevBtn = document.getElementById('prev-media');
    const nextBtn = document.getElementById('next-media');

    prevBtn.disabled = currentMediaIndex === 0;
    nextBtn.disabled = currentMediaIndex === gameData.media.length - 1;
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    const currentVideoElement = document.getElementById('current-video');

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentVideoElement.pause();
}

document.addEventListener('DOMContentLoaded', function () {
    // Stop project links from triggering the card's gallery click
    document.querySelectorAll('.project-links a').forEach(link => {
        link.addEventListener('click', (e) => e.stopPropagation());
    });

    const modal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementsByClassName('gallery-close')[0];
    const prevBtn = document.getElementById('prev-media');
    const nextBtn = document.getElementById('next-media');

    closeBtn.onclick = closeGallery;
    modal.onclick = function (event) {
        if (event.target === modal) closeGallery();
    };

    prevBtn.onclick = function () {
        if (currentMediaIndex > 0) showMedia(currentMediaIndex - 1);
    };
    nextBtn.onclick = function () {
        const gameData = gameMedia[currentGame];
        if (currentMediaIndex < gameData.media.length - 1) showMedia(currentMediaIndex + 1);
    };

    document.addEventListener('keydown', function (event) {
        if (modal.style.display === 'block') {
            switch (event.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    if (currentMediaIndex > 0) showMedia(currentMediaIndex - 1);
                    break;
                case 'ArrowRight': {
                    const gameData = gameMedia[currentGame];
                    if (currentMediaIndex < gameData.media.length - 1) showMedia(currentMediaIndex + 1);
                    break;
                }
            }
        }
    });
});
