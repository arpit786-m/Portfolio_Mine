// ===== THEME SWITCHER =====
// Default is dark mode; light-mode class toggles it
const switchTheme = () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
};

window.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Scroll-reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                setTimeout(() => entry.target.classList.add('visible'), parseFloat(delay) * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));

    // Header scroll shadow
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Floating particles
    generateParticles();

    // 3D mouse parallax on hero
    initParallax();

    // Dynamic role typing rotation
    initTypingRotation();
});

// ===== MOBILE MENU =====
function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    const icon = document.getElementById('menu-icon');
    nav.classList.toggle('active');
    icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
}

document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
        document.getElementById('menu-icon').className = 'fas fa-bars';
    });
});

// ===== FLOATING DATA PARTICLES =====
function generateParticles() {
    const layer = document.getElementById('particles-layer');
    if (!layer) return;
    const symbols = ['◆', '▲', '●', '■', '⬡', '{  }', '01', '∑', '∞', 'AI', 'BI', 'SQL'];
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.cssText = `
            position:absolute;
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            font-size:${Math.random() * 10 + 9}px;
            color:rgba(108,99,255,${Math.random() * 0.3 + 0.08});
            font-weight:700;
            pointer-events:none;
            animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
            animation-delay:-${Math.random() * 8}s;
            user-select:none;
        `;
        layer.appendChild(p);
    }
    // inject keyframe
    if (!document.getElementById('particle-style')) {
        const s = document.createElement('style');
        s.id = 'particle-style';
        s.textContent = `
            @keyframes particleFloat {
                0%,100%{transform:translateY(0) rotate(0deg);opacity:0.15}
                50%{transform:translateY(-30px) rotate(8deg);opacity:0.4}
            }
            #particles-layer{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
        `;
        document.head.appendChild(s);
    }
}

// ===== MOUSE PARALLAX ON HERO GHIBLI CHARACTER =====
function initParallax() {
    const scene = document.querySelector('.hero-3d-scene');
    const avatar = document.getElementById('ghibli-avatar');
    if (!scene || !avatar) return;

    document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        scene.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
        avatar.style.filter = `drop-shadow(${dx * -15}px 20px 40px rgba(108,99,255,0.45))`;
    });
}

// ===== TYPING ROLE ROTATION =====
function initTypingRotation() {
    const roles = [
        'Data Analyst & BI Developer',
        'Power BI Dashboard Expert',
        'Python & SQL Data Analyst',
        'Business Intelligence Analyst',
        'Web Developer & Analyst'
    ];
    const el = document.getElementById('dynamic-role');
    if (!el) return;
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % roles.length;
        el.style.animation = 'none';
        el.textContent = roles[idx];
        void el.offsetWidth; // reflow
        el.style.animation = 'typing 4s steps(35, end) infinite alternate';
    }, 5000);
}

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
if (form) {
    emailjs.init('YOUR_PUBLIC_KEY_HERE');
    const statusMsg = document.getElementById('status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        statusMsg.textContent = 'Sending...';
        statusMsg.style.color = 'var(--accent)';

        emailjs.send('YOUR_SERVICE_ID_HERE', 'YOUR_TEMPLATE_ID_HERE', {
            from_name: document.getElementById('name').value,
            reply_to:  document.getElementById('email').value,
            message:   document.getElementById('message').value
        }).then(() => {
            statusMsg.textContent = '✅ Message sent successfully!';
            statusMsg.style.color = 'var(--accent2)';
            form.reset();
        }).catch(() => {
            statusMsg.textContent = '❌ Error sending. Please email optimistarpit@gmail.com';
            statusMsg.style.color = '#ff6b6b';
        });
    });
}