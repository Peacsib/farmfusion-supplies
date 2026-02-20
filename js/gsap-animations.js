/**
 * Premium GSAP Scroll Animations for FarmFusion
 * Inspired by modern business websites with smooth interactions
 */

// Wait for DOM and GSAP to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Using fallback animations.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Smooth scroll configuration
    initSmoothScroll();
    
    // Hero animations
    initHeroAnimations();
    
    // Section reveal animations
    initSectionReveals();
    
    // Card animations with stagger
    initCardAnimations();
    
    // Parallax effects
    initParallaxEffects();
    
    // Text reveal animations
    initTextReveals();
    
    // Image scale on scroll
    initImageScaleEffects();
    
    // Counter animations
    initCounterAnimations();
    
    // Button hover effects
    initButtonEffects();
    
    // Navbar scroll effects
    initNavbarEffects();
});

/**
 * Smooth scroll initialization
 */
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 80 },
                        ease: "power3.inOut"
                    });
                }
            }
        });
    });
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroContent = hero.querySelector('.hero-content');
    if (!heroContent) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(heroContent.querySelector('.hero-tag'), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2
    })
    .from(heroContent.querySelector('h1'), {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    }, "-=0.4")
    .from(heroContent.querySelector('p'), {
        y: 40,
        opacity: 0,
        duration: 0.8
    }, "-=0.6")
    .from(heroContent.querySelectorAll('.hero-cta-primary, .hero-cta-secondary'), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15
    }, "-=0.4");
}

/**
 * Section reveal animations
 */
function initSectionReveals() {
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}

/**
 * Card animations with stagger effect
 */
function initCardAnimations() {
    // Product cards
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        gsap.from(productCards, {
            scrollTrigger: {
                trigger: productCards[0].parentElement,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }

    // Bento grid cards
    const bentoCards = document.querySelectorAll('.bento-main');
    if (bentoCards.length > 0) {
        gsap.from(bentoCards, {
            scrollTrigger: {
                trigger: bentoCards[0].parentElement,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.4)"
        });
    }

    // Branch cards
    const branchCards = document.querySelectorAll('.branch-card');
    if (branchCards.length > 0) {
        gsap.from(branchCards, {
            scrollTrigger: {
                trigger: branchCards[0].parentElement,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }
}

/**
 * Parallax effects for images and backgrounds
 */
function initParallaxEffects() {
    // Hero parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        gsap.to(hero, {
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            backgroundPosition: "50% 100%",
            ease: "none"
        });
    }

    // Product images parallax
    const productImages = document.querySelectorAll('.product-img');
    productImages.forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -30,
            ease: "none"
        });
    });
}

/**
 * Text reveal animations
 */
function initTextReveals() {
    const headings = document.querySelectorAll('.section-header h2, .about-hero h1');
    
    headings.forEach(heading => {
        // Split text into words for animation
        const words = heading.textContent.split(' ');
        heading.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
        
        gsap.from(heading.querySelectorAll('.word'), {
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out"
        });
    });

    // Paragraph reveals
    const paragraphs = document.querySelectorAll('.section-header p');
    paragraphs.forEach(p => {
        gsap.from(p, {
            scrollTrigger: {
                trigger: p,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
}

/**
 * Image scale effects on scroll
 */
function initImageScaleEffects() {
    const images = document.querySelectorAll('.about-image img, .product-img');
    
    images.forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            scale: 1.2,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    });
}

/**
 * Counter animations
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter, [data-counter]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        
        gsap.from(counter, {
            scrollTrigger: {
                trigger: counter,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            textContent: 0,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                counter.textContent = Math.ceil(counter.textContent);
            }
        });
    });
}

/**
 * Button hover effects with GSAP
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Magnetic button effect
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

/**
 * Navbar effects on scroll
 */
function initNavbarEffects() {
    const header = document.querySelector('header');
    if (!header) return;

    ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: "scrolled", targets: header }
    });

    // Add CSS for scrolled state if not exists
    if (!document.querySelector('#navbar-scroll-style')) {
        const style = document.createElement('style');
        style.id = 'navbar-scroll-style';
        style.textContent = `
            header.scrolled {
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                background-color: rgba(255, 255, 255, 0.95);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Pin sections on scroll (optional advanced effect)
 */
function initPinSections() {
    const pinSections = document.querySelectorAll('[data-pin]');
    
    pinSections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false
        });
    });
}

/**
 * Horizontal scroll sections (optional)
 */
function initHorizontalScroll() {
    const horizontalSections = document.querySelectorAll('[data-horizontal-scroll]');
    
    horizontalSections.forEach(section => {
        const items = section.querySelector('.horizontal-items');
        if (!items) return;
        
        gsap.to(items, {
            x: () => -(items.scrollWidth - section.offsetWidth),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${items.scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });
    });
}

// Refresh ScrollTrigger on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});
