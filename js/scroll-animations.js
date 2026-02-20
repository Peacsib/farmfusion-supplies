/**
 * Premium Scroll Animations for FarmFusion
 * Uses Intersection Observer for performance
 */

// Animation configuration
const animationConfig = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initStaggeredAnimations();
});

/**
 * Main scroll animation system
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Optional: unobserve after animation (one-time animation)
                // observer.unobserve(entry.target);
            }
        });
    }, animationConfig);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-up, .fade-in, .fade-left, .fade-right, .scale-in, .slide-up, .slide-left, .slide-right, .rotate-in, .flip-in'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Parallax scroll effects for hero sections
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    if (parallaxElements.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                parallaxElements.forEach(el => {
                    const speed = el.classList.contains('parallax-slow') ? 0.3 :
                                 el.classList.contains('parallax-medium') ? 0.5 : 0.7;
                    
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Animated counters for statistics
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

/**
 * Staggered animations for grids and lists
 */
function initStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100); // 100ms delay between each item
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(container);
    });
}

/**
 * Smooth reveal for images
 */
function initImageReveal() {
    const images = document.querySelectorAll('.reveal-image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    images.forEach(img => observer.observe(img));
}

/**
 * Floating animation for decorative elements
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize additional effects
initImageReveal();
initFloatingElements();

/**
 * Add scroll progress indicator
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

initScrollProgress();

/**
 * Magnetic hover effect for buttons
 */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

initMagneticButtons();
