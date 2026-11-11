/* ============================================================
   ARPIT MISHRA — Premium Portfolio Script v2.0
   ============================================================ */

'use strict';

// ===== UTILITY =====
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollReveal();
    initHeroCanvas();
    initActiveNavHighlight();
    initCGPABar();
    initContactForm();
    initTiltEffect();
    initNavSmoothClose();
    initScrollIndicatorHide();

    // Stagger hero content entrance
    animateHeroEntrance();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
    const header  = qs('#main-header');
    const toggle  = qs('#menu-toggle');
    const navList = qs('#nav-links');

    // Scroll shadow
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile hamburger
    if (toggle && navList) {
        toggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('active');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('active') &&
                !navList.contains(e.target) &&
                !toggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                closeMenu();
                toggle.focus();
            }
        });
    }

    function closeMenu() {
        navList.classList.remove('active');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Expose a safe global for any legacy inline calls (no longer used in HTML)
    window.toggleMenu = () => {
        const isOpen = navList.classList.toggle('active');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };
}

function initNavSmoothClose() {
    // Close mobile menu when any nav link is clicked
    qsa('.nav-link, .nav-resume-btn').forEach(link => {
        link.addEventListener('click', () => {
            const navList = qs('#nav-links');
            const toggle  = qs('#menu-toggle');
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                toggle && toggle.classList.remove('open');
                toggle && toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT (IntersectionObserver)
   ============================================================ */
function initActiveNavHighlight() {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 70}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach(s => observer.observe(s));
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
    if (prefersReducedMotion()) return;

    const revealEls = qsa('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseFloat(
                entry.target.style.getPropertyValue('--delay') || '0'
            ) * 1000;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   HERO CANVAS — Particle Network
   ============================================================ */
function initHeroCanvas() {
    const canvas = qs('#hero-canvas');
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;

    const COLOR_POOL = [
        'rgba(14,165,233,',  // blue
        'rgba(6,182,212,',   // cyan
        'rgba(124,58,237,',  // violet
    ];

    class Particle {
        constructor() { this.reset(true); }

        reset(init = false) {
            this.x  = Math.random() * w;
            this.y  = init ? Math.random() * h : h + 10;
            this.r  = Math.random() * 1.8 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
            this.life   = 0;
            this.maxLife = Math.random() * 300 + 200;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.y < -10 || this.life > this.maxLife) this.reset();
        }

        draw() {
            const fade = this.life < 60
                ? this.life / 60
                : this.life > this.maxLife - 60
                    ? (this.maxLife - this.life) / 60
                    : 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${(this.alpha * fade).toFixed(2)})`;
            ctx.fill();
        }
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width  = canvas.offsetWidth  * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
    }

    function initParticles() {
        const count = isMobile() ? 40 : 90;
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
        const maxDist = isMobile() ? 80 : 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
                    ctx.lineWidth   = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        raf = requestAnimationFrame(loop);
    }

    // Mouse repulsion (subtle)
    let mouse = { x: -9999, y: -9999 };
    const heroSection = qs('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }, { passive: true });
        heroSection.addEventListener('mouseleave', () => {
            mouse.x = -9999; mouse.y = -9999;
        });
    }

    // Pause when off-screen
    const visibilityObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (!raf) loop();
        } else {
            cancelAnimationFrame(raf);
            raf = null;
        }
    });
    if (heroSection) visibilityObserver.observe(heroSection);

    resize();
    initParticles();
    loop();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(raf);
            raf = null;
            resize();
            initParticles();
            loop();
        }, 300);
    }, { passive: true });
}

/* ============================================================
   HERO ENTRANCE ANIMATION
   ============================================================ */
function animateHeroEntrance() {
    if (prefersReducedMotion()) return;

    const heroContent = qs('.hero-content');
    if (!heroContent) return;

    // Immediately mark visible (CSS handles the transition)
    requestAnimationFrame(() => {
        heroContent.classList.add('visible');
    });
}

/* ============================================================
   CGPA BAR ANIMATION
   ============================================================ */
function initCGPABar() {
    const bar = qs('.cgpa-bar-fill');
    if (!bar) return;

    const targetWidth = bar.dataset.width || '97.7';

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(() => {
                bar.classList.add('animated');
                bar.style.width = `${targetWidth}%`;
            }, 400);
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(bar);
}

/* ============================================================
   TILT EFFECT ON PROJECT CARDS (subtle 3D)
   ============================================================ */
function initTiltEffect() {
    if (isMobile() || prefersReducedMotion()) return;

    const cards = qsa('.dashboard-preview');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const rotX   = -dy * 5;
            const rotY   =  dx * 8;

            card.style.transform =
                `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            card.style.boxShadow =
                `${-rotY * 2}px ${rotX}px 40px rgba(14,165,233,0.2), 0 0 0 1px rgba(14,165,233,0.15)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

/* ============================================================
   SCROLL INDICATOR — hide after first scroll
   ============================================================ */
function initScrollIndicatorHide() {
    const indicator = qs('.scroll-indicator');
    if (!indicator) return;

    const hide = () => {
        if (window.scrollY > 80) {
            indicator.style.opacity = '0';
            indicator.style.pointerEvents = 'none';
        }
    };
    window.addEventListener('scroll', hide, { passive: true });
}

/* ============================================================
   CONTACT FORM — EmailJS
   ============================================================ */
function initContactForm() {
    const form   = qs('#contact-form');
    const status = qs('#status');
    const btn    = qs('#send-message-btn');

    if (!form || !status) return;

    // Initialize EmailJS — replace with actual keys when ready
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY_HERE');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        const name    = qs('#name',    form).value.trim();
        const email   = qs('#email',   form).value.trim();
        const message = qs('#message', form).value.trim();

        if (!name || !email || !message) {
            showStatus('⚠️ Please fill in all fields.', 'warn');
            return;
        }

        if (!isValidEmail(email)) {
            showStatus('⚠️ Please enter a valid email address.', 'warn');
            return;
        }

        // Loading state
        btn.disabled    = true;
        btn.innerHTML   = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        showStatus('Sending your message…', 'info');

        if (typeof emailjs === 'undefined') {
            // EmailJS not configured — show helpful message
            await sleep(1000);
            showStatus(
                '✅ Thanks! Please reach out directly at optimistarpit@gmail.com',
                'success'
            );
            form.reset();
            resetBtn();
            return;
        }

        emailjs.send('YOUR_SERVICE_ID_HERE', 'YOUR_TEMPLATE_ID_HERE', {
            from_name: name,
            reply_to:  email,
            message:   message
        }).then(() => {
            showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
            form.reset();
        }).catch(() => {
            showStatus(
                '❌ Couldn\'t send. Email me at optimistarpit@gmail.com',
                'error'
            );
        }).finally(resetBtn);
    });

    function resetBtn() {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }

    function showStatus(msg, type) {
        const colors = {
            success: '#10b981',
            error:   '#ef4444',
            warn:    '#f59e0b',
            info:    '#0ea5e9'
        };
        status.textContent    = msg;
        status.style.color    = colors[type] || colors.info;
        status.style.opacity  = '1';

        if (type === 'success') {
            setTimeout(() => { status.style.opacity = '0'; }, 5000);
        }
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================================
   SMOOTH SCROLL POLYFILL (anchor links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH   = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 70;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ============================================================
   SKILL ITEM — subtle entrance stagger on hover
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    qsa('.skill-category').forEach(cat => {
        const items = qsa('.skill-item', cat);
        const catObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity   = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 60);
                });
                catObserver.disconnect();
            }
        }, { threshold: 0.2 });

        // Set initial hidden state
        if (!prefersReducedMotion()) {
            items.forEach(item => {
                item.style.opacity   = '0';
                item.style.transform = 'translateY(12px)';
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });
            catObserver.observe(cat);
        }
    });
});

/* ============================================================
   KPI CARDS — number count-up animation
   ============================================================ */
function initCountUp() {
    const kpiVals = qsa('.kpi-value');
    kpiVals.forEach(el => {
        // Store original text
        el.dataset.target = el.textContent;
    });
}

/* ============================================================
   DASHBOARD PREVIEW — animated data bars on scroll-enter
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion()) return;

    const dashboards = qsa('.dashboard-preview');
    const dashObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('dash-visible');
                dashObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    dashboards.forEach(d => {
        d.style.opacity   = '0';
        d.style.transform = 'translateY(20px)';
        d.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        dashObserver.observe(d);
    });

    // Trigger visible state
    document.addEventListener('scroll', () => {}, { passive: true }); // ensure passive

    // Also handle initial visibility
    setTimeout(() => {
        qsa('.dashboard-preview').forEach(d => {
            const rect = d.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                d.style.opacity   = '1';
                d.style.transform = '';
            }
        });
    }, 100);
});

// Add CSS for dash-visible
(function injectDashStyle() {
    const s = document.createElement('style');
    s.textContent = `
        .dashboard-preview.dash-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* Mini bar animation delay */
        .kpi-mini-bars .mini-bar:nth-child(1) { animation-delay: 0.1s; }
        .kpi-mini-bars .mini-bar:nth-child(2) { animation-delay: 0.2s; }
        .kpi-mini-bars .mini-bar:nth-child(3) { animation-delay: 0.3s; }
        .kpi-mini-bars .mini-bar:nth-child(4) { animation-delay: 0.4s; }
        .kpi-mini-bars .mini-bar:nth-child(5) { animation-delay: 0.5s; }
        .kpi-mini-bars .mini-bar:nth-child(6) { animation-delay: 0.6s; }
        .kpi-mini-bars .mini-bar:nth-child(7) { animation-delay: 0.7s; }

        /* Nav link hover background */
        .nav-link:hover {
            background: rgba(14,165,233,0.08);
        }

        /* Scroll behavior on reduced motion */
        @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
        }

        /* Hero content visible override */
        .hero-content.visible {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(s);
})();

/* ============================================================
   PERFORMANCE — Passive scroll listeners summary
   ============================================================ */
// All scroll listeners above use { passive: true }
// requestAnimationFrame used for canvas loop
// IntersectionObserver used for all scroll-triggered effects
// No jQuery, no heavy libraries

console.log(
    '%c Arpit Mishra Portfolio v2.0 ',
    'background: linear-gradient(135deg,#0ea5e9,#7c3aed); color:#fff; padding:4px 10px; border-radius:4px; font-weight:700;'
);
