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
window.addEventListener('scroll', function() {
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

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
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
    link.addEventListener('click', function() {
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
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        // Uncomment below line to enable typing effect
        // typeWriter(heroTitle, originalText.replace('<span>', '').replace('</span>', ''));
    }
    
    // Initialize particle system
    new ParticleSystem();
});