// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic navbar logo and background change on scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const logoText = document.getElementById('nav-logo-text');
    const homeSection = document.getElementById('home');
    const homeHeight = homeSection.offsetHeight;

    if (window.scrollY > homeHeight * 0.3) {
        // Scrolled past home section
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        if (logoText.textContent !== 'Prithul Biswas Dip') {
            logoText.style.opacity = '0';
            setTimeout(() => {
                logoText.textContent = 'Prithul Biswas Dip';
                logoText.style.opacity = '1';
            }, 150);
        }
    } else {
        // In home section
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        if (logoText.textContent !== 'Portfolio') {
            logoText.style.opacity = '0';
            setTimeout(() => {
                logoText.textContent = 'Portfolio';
                logoText.style.opacity = '1';
            }, 150);
        }
    }
});

// Add animation class when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.project-card, .skill-tags span');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mobile menu toggle (if needed for responsive design)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add click event for CV download tracking (optional analytics)
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function () {
        console.log('CV downloaded');
        // Add analytics tracking here if needed
    });
});

// Typing effect for hero text (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Enhanced Particle System with Mouse Interaction
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.maxDistance = 150;

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

    createParticles() {
        const numberOfParticles = 150;

        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.4 + 0.4,
                hue: Math.random() * 360
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Add click event to the entire hero section to catch clicks
        const heroSection = document.getElementById('home');
        heroSection.addEventListener('click', (e) => {
            const canvasRect = this.canvas.getBoundingClientRect();
            const heroRect = heroSection.getBoundingClientRect();

            // Calculate click position relative to canvas
            const clickX = e.clientX - canvasRect.left;
            const clickY = e.clientY - canvasRect.top;

            console.log('Hero clicked at:', clickX, clickY); // Debug log

            let affectedParticles = 0;
            this.particles.forEach(particle => {
                const dx = clickX - particle.x;
                const dy = clickY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const force = 0.3; // Increased force for more visible effect
                    const angle = Math.atan2(dy, dx);
                    particle.vx += Math.cos(angle) * force;
                    particle.vy += Math.sin(angle) * force;
                    affectedParticles++;

                    // Limit velocity to prevent particles from moving too fast
                    const maxVelocity = 3;
                    const currentVelocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                    if (currentVelocity > maxVelocity) {
                        particle.vx = (particle.vx / currentVelocity) * maxVelocity;
                        particle.vy = (particle.vy / currentVelocity) * maxVelocity;
                    }
                }
            });
            console.log('Affected particles:', affectedParticles); // Debug log
        });
    }

    drawConnections() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.maxDistance) {
                const opacity = (1 - distance / this.maxDistance) * 0.5;

                this.ctx.beginPath();
                this.ctx.strokeStyle = `hsla(${particle.hue}, 100%, 70%, ${opacity})`;
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
                this.ctx.shadowBlur = 5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

            // Neon glow effect
            this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
            this.ctx.fill();

            // Inner bright core
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${particle.opacity + 0.2})`;
            this.ctx.fill();

            // Animate hue for color cycling
            particle.hue += 0.5;
            if (particle.hue > 360) particle.hue = 0;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.drawParticles();
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }
}


// Initialize typing effect when page loads
window.addEventListener('load', function () {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        // Uncomment below line to enable typing effect
        // typeWriter(heroTitle, originalText.replace('<span>', '').replace('</span>', ''));
    }

    // Initialize particle system
    new ParticleSystem();
});

// Gallery System
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

    // Create thumbnails
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

    // Update active thumbnail
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

    // Update navigation buttons
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

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementsByClassName('gallery-close')[0];
    const prevBtn = document.getElementById('prev-media');
    const nextBtn = document.getElementById('next-media');

    // Close modal events
    closeBtn.onclick = closeGallery;
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeGallery();
        }
    };

    // Navigation events
    prevBtn.onclick = function () {
        if (currentMediaIndex > 0) {
            showMedia(currentMediaIndex - 1);
        }
    };

    nextBtn.onclick = function () {
        const gameData = gameMedia[currentGame];
        if (currentMediaIndex < gameData.media.length - 1) {
            showMedia(currentMediaIndex + 1);
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', function (event) {
        if (modal.style.display === 'block') {
            switch (event.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    if (currentMediaIndex > 0) {
                        showMedia(currentMediaIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    const gameData = gameMedia[currentGame];
                    if (currentMediaIndex < gameData.media.length - 1) {
                        showMedia(currentMediaIndex + 1);
                    }
                    break;
            }
        }
    });
});