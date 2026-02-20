'use strict';

/* ─────────────────────────────────────────────
   FarmFusion Supplies — main.js
   Single source of truth for shared interactions.
   All duplicate/dead handlers removed.
───────────────────────────────────────────── */

const CONFIG = {
    whatsappNumber: '263715582943',
    mainPhone: '+263780840505',
    branchPhones: {
        murehwa: '+263772123456',
        juru: '+263712065233',
        cross: '+263780840505'
    }
};

/* ── 1. FARM-THEMED SIDE MENU ────────────── */
(function initFarmSideMenu() {
    const menuBtn = document.getElementById('farmMenuBtn');
    const sideMenu = document.getElementById('farmSideMenu');
    const overlay = document.getElementById('sideMenuOverlay');
    
    if (!menuBtn || !sideMenu || !overlay) return;
    
    function openSideMenu() {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Close farm navigation menu');
        
        // Prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Focus trap
        sideMenu.setAttribute('aria-hidden', 'false');
    }
    
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.hidden = true;
        }, 300);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open farm navigation menu');
        sideMenu.setAttribute('aria-hidden', 'true');
        menuBtn.focus();
    }
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sideMenu.classList.contains('active')) {
            closeSideMenu();
        } else {
            openSideMenu();
        }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSideMenu();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideMenu.classList.contains('active')) return;
        if (sideMenu.contains(e.target) || menuBtn.contains(e.target)) return;
        closeSideMenu();
    });
    
    // Close on menu link click
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeSideMenu();
        });
    });
    
    // Initialize aria-hidden
    sideMenu.setAttribute('aria-hidden', 'true');
})();


/* ── 2. STICKY HEADER SHRINK ───────────────── */
(function initHeaderShrink() {
    const header = document.querySelector('header');
    if (!header) return;
    const run = () => header.classList.toggle('shrink', window.scrollY > 60);
    window.addEventListener('scroll', run, { passive: true });
    run();
})();


/* ── 3. ACTIVE NAV LINK ────────────────────── */
(function setActiveNavLink() {
    // Set active link for both desktop nav and side menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop navigation
    const desktopNav = document.querySelector('.nav-links');
    if (desktopNav) {
        desktopNav.querySelectorAll('a').forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    // Side menu navigation
    const sideMenu = document.getElementById('farmSideMenu');
    if (sideMenu) {
        sideMenu.querySelectorAll('.side-menu-link').forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                // Add special styling for active side menu item
                link.style.background = 'rgba(255, 255, 255, 0.15)';
                link.style.borderLeft = '4px solid #FFD700';
            }
        });
    }
})();


/* ── 4. CURRENT YEAR ───────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── 5. PROMO COUNTDOWN ────────────────────── */
(function initPromoCountdown() {
    const promoText = document.getElementById('promoText');
    if (!promoText) return;
    function update() {
        const now = new Date();
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const ms = end - now;
        const h  = Math.floor(ms / 3600000);
        const m  = Math.floor((ms % 3600000) / 60000);
        promoText.innerHTML =
            `Order now! Offer ends in <strong>${h}h ${m}m</strong> | Call: 071 558 2943`;
    }
    update();
    setInterval(update, 60000);
})();


/* ── 6. ANCHOR SCROLL — single, reduced-motion aware ── */
(function initAnchorScroll() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;
        a.addEventListener('click', (e) => {
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        });
    });
})();


/* ── 7. SCROLL REVEAL ──────────────────────── */
(function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .testimonial-card');
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        window._ffObserve = null;
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(el => obs.observe(el));

    // Expose globally so dynamically rendered cards (feed stall) can be observed
    window._ffObserve = (el) => obs.observe(el);
})();


/* ── 8. HERO PARALLAX ──────────────────────── */
(function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            hero.style.backgroundPosition = `center calc(50% + ${window.scrollY * 0.07}px)`;
            ticking = false;
        });
    }, { passive: true });
})();


/* ── 9. WHATSAPP FLOAT — single unified controller ── */
(function initWhatsAppFloat() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;
    const run = () => btn.classList.toggle('is-visible', window.scrollY > 300);
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('load', run);
    run();
})();


/* ── 10. TESTIMONIALS CAROUSEL ─────────────── */
(function initTestimonialsCarousel() {
    const carousel = document.querySelector('[data-carousel="testimonials"]');
    if (!carousel) return;

    const track    = carousel.querySelector('.carousel-track');
    const cards    = Array.from(carousel.querySelectorAll('.tcard'));
    const prevBtn  = carousel.querySelector('.carousel-btn.prev');
    const nextBtn  = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = document.querySelector('[data-dots="testimonials"]');
    const dots     = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];
    if (!track || cards.length === 0) return;

    let index = 0;
    let autoTimer;

    function update() {
        track.style.transform = `translateX(${-index * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('is-active', i === index);
            d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
    }
    function go(i) {
        index = (i + cards.length) % cards.length;
        update();
        clearInterval(autoTimer);
        autoTimer = setInterval(() => go(index + 1), 5500);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

    const viewport = carousel.querySelector('.carousel-viewport');
    if (viewport) {
        let sx = 0, dx = 0;
        viewport.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
        viewport.addEventListener('touchmove',  e => { dx = e.touches[0].clientX - sx; }, { passive: true });
        viewport.addEventListener('touchend',   () => { if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1); });
    }

    update();
    autoTimer = setInterval(() => go(index + 1), 5500);
})();


/* ── 11. IMAGE ERROR GRACEFUL FALLBACK ─────── */
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);