'use strict';

/* ─────────────────────────────────────────────
   FarmFusion — products-data.js
   Updated: Consolidated sizes per product card
───────────────────────────────────────────── */

/**
 * Resolve the correct product image based on the product name and category.
 * Updated to work with shortened product names.
 */
function getImageForProduct(productName, categoryName = '') {
    const n = (productName || '').toLowerCase().trim();
    const cat = (categoryName || '').toLowerCase().trim();
    const base = 'images/feeds/products/';

    /* ── Road Runner Feed ── */
    if (cat.includes('road runner')) {
        if (n.includes('starter') || n.includes('chicks')) return base + 'roadrunner-set.webp';
        if (n.includes('grower')) return base + 'roadrunner-grower.webp';
        if (n.includes('breeder') || n.includes('layer')) return base + 'roadrunner-pellets.webp';
        return base + 'roadrunner-pellets.webp';
    }

    /* ── Rabbit Feed ── */
    if (cat.includes('rabbit')) {
        if (n.includes('starter')) return base + 'rabbit-starter.webp';
        if (n.includes('grower')) return base + 'rabbit-grower.webp';
        return base + 'rabbit-pellets.webp';
    }

    /* ── Pig Feed ── */
    if (cat.includes('pig')) {
        if (n.includes('weaner') || n.includes('creep')) return base + 'pig-starter-creep.webp';
        if (n.includes('finisher')) return base + 'pig-finisher.webp';
        return base + 'pig-grower.webp';
    }

    /* ── Broiler Feed ── */
    if (cat.includes('broiler')) {
        if (n.includes('starter') || n.includes('stargrow')) return base + 'broiler-starter.webp';
        if (n.includes('finisher') || n.includes('growfin')) return base + 'broiler-finisher.webp';
        if (n.includes('grower')) return base + 'broiler-grower.webp';
        if (n.includes('crumb')) return base + 'broiler-starter-crumble.webp';
        return base + 'broiler-range.webp';
    }

    /* ── Layers Feed ── */
    if (cat.includes('layer')) {
        if (n.includes('starter') || n.includes('pullet starter')) return base + 'layer-starter-crumble.webp';
        if (n.includes('breeder')) return base + 'layer-breeder.webp';
        if (n.includes('mash')) return base + 'layer-mash.webp';
        return base + 'layer-pellets.webp';
    }

    /* ── Goat Feed ── */
    if (cat.includes('goat')) return base + 'goat-feed.webp';

    /* ── Fallback ── */
    return base + 'broiler-range.webp';
}

/**
 * Build a single product card HTML string with consolidated sizes.
 */
function createProductCard(productName, sizes, prices, categoryName = '') {
    const imgSrc = getImageForProduct(productName, categoryName);
    const safeId = productName.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
    
    // Create size display text
    let sizeDisplay;
    if (sizes.length === 1) {
        sizeDisplay = sizes[0];
    } else {
        sizeDisplay = `Available: ${sizes.join(' / ')}`;
    }
    
    // Get price for first/smallest size for display
    const firstSize = sizes[0];
    const displayPrice = prices[firstSize] || '0.00';
    const priceText = sizes.length === 1 ? `$${displayPrice}` : `From $${displayPrice}`;
    
    // Create WhatsApp message with all sizes
    const waMessage = `Hello FarmFusion, I want to order: ${productName} (${sizes.join(' or ')})`;
    const waLink = `https://wa.me/263780840505?text=${encodeURIComponent(waMessage)}`;

    return `
        <div class="product-card" data-product="${productName}" data-sizes="${sizes.join(',')}" data-price="${displayPrice}">
            <div class="product-img">
                <img src="${imgSrc}" alt="${productName}" loading="lazy" decoding="async">
            </div>
            <div class="product-content">
                <div class="product-name">${productName}</div>
                <div class="product-size">${sizeDisplay}</div>
                <div class="product-price">${priceText}</div>
                <div class="product-meta">✓ WhatsApp Order &nbsp;•&nbsp; ✓ Delivery</div>
                <div class="product-cta">
                    <a href="${waLink}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-whatsapp"></i> Order
                    </a>
                </div>
            </div>
        </div>`;
}

/**
 * Render all feed products into the #feedStallContent container.
 */
function populateFeedStall() {
    const container = document.getElementById('feedStallContent');
    if (!container) return;

    const stock = window.FF_STOCK && window.FF_STOCK.Feed;
    if (!stock) {
        container.innerHTML = '<p class="feed-loading-state">Feed products loading…</p>'; 
        return;
    }

    container.innerHTML = '';

    const categoryIcons = {
        pig: '🐖',
        layer: '🥚',
        layers: '🥚',
        broiler: '🐔',
        'road run': '🦃',
        rabbit: '🐇',
        goat: '🐐'
    };

    function getIcon(catName) {
        const lc = catName.toLowerCase();
        for (const [key, icon] of Object.entries(categoryIcons)) {
            if (lc.includes(key)) return icon;
        }
        return '🌾';
    }

    for (const [subcatName, products] of Object.entries(stock)) {
        if (!products || products.length === 0) continue;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'subcategory-title';
        titleDiv.textContent = `${getIcon(subcatName)} ${subcatName}`;
        container.appendChild(titleDiv);

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        products.forEach(product => {
            if (!product.sizes || !Array.isArray(product.sizes)) return;
            // Create ONE card per product with all sizes consolidated
            grid.innerHTML += createProductCard(product.name, product.sizes, product.prices || {}, subcatName);
        });

        container.appendChild(grid);
    }

    // Mark cards visible immediately for IntersectionObserver
    container.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('visible');
        if (typeof window._ffObserve === 'function') window._ffObserve(card);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateFeedStall);
} else {
    populateFeedStall();
}

// Extra safety net: re-run on full load if feed content is still empty
window.addEventListener('load', () => {
    const container = document.getElementById('feedStallContent');
    if (container && container.querySelectorAll('.product-card').length === 0) {
        populateFeedStall();
    }
});
