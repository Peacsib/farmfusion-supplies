'use strict';

(function bindBusinessDetails() {
    const cfg = window.FF_BUSINESS;
    if (!cfg) return;

    document.querySelectorAll('[data-business-phone-main]').forEach((el) => {
        if (el.tagName === 'A') el.href = `tel:${cfg.phone.main}`;
        el.textContent = cfg.phone.displayMain;
    });

    document.querySelectorAll('[data-business-email]').forEach((el) => {
        if (el.tagName === 'A') el.href = `mailto:${cfg.email}`;
        el.textContent = cfg.email;
    });

    document.querySelectorAll('[data-business-whatsapp-main]').forEach((el) => {
        const msg = el.getAttribute('data-wa-text') || 'Hello FarmFusion, I need assistance';
        if (el.tagName === 'A') {
            el.href = `https://wa.me/${cfg.whatsapp.main}?text=${encodeURIComponent(msg)}`;
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
        }
    });
})();
