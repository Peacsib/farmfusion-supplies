'use strict';

/* ─────────────────────────────────────────────
   FarmFusion — products.js
   Fixed: initChips works, filter sidebar wired,
   sort functional, accordion correct.
───────────────────────────────────────────── */

const WHATSAPP = '263715582943';

function parsePrice(text) {
    const val = parseFloat(String(text || '').replace(/[^0-9.]/g, ''));
    return isFinite(val) ? val : 0;
}

function allCards() {
    return Array.from(document.querySelectorAll('.product-card'));
}

function cardText(card) {
    return [
        card.dataset.product || '',
        card.querySelector('.product-name')?.textContent || '',
        card.querySelector('.product-size')?.textContent || '',
        card.querySelector('.product-meta')?.textContent || ''
    ].join(' ').toLowerCase();
}

/* ── Category Chip Nav ──────────────────────── */
function initChips() {
    const chipsWrap = document.getElementById('categoryChips');
    const stalls    = Array.from(document.querySelectorAll('.stall'));
    if (!chipsWrap || stalls.length === 0) return;

    function setChip(chip, active) {
        document.querySelectorAll('#categoryChips .chip')
            .forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    }

    const allChip = document.createElement('button');
    allChip.type      = 'button';
    allChip.className = 'chip active';
    allChip.textContent = 'All';
    allChip.addEventListener('click', () => {
        setChip(allChip, true);
        stalls.forEach(s => s.style.display = '');
    });
    chipsWrap.appendChild(allChip);

    stalls.forEach(stall => {
        const name = stall.querySelector('.stall-header h2')?.textContent?.trim() || 'Category';
        const chip = document.createElement('button');
        chip.type      = 'button';
        chip.className = 'chip';
        chip.textContent = name;
        chip.addEventListener('click', () => {
            setChip(chip, true);
            stalls.forEach(s => s.style.display = 'none');
            stall.style.display = '';
            // Open the stall accordion if closed
            if (!stall.classList.contains('active')) {
                stall.classList.add('active');
                const icon = stall.querySelector('.stall-toggle i');
                if (icon) {
                    icon.classList.remove('fa-chevron-circle-down');
                    icon.classList.add('fa-chevron-circle-up');
                }
            }
            stall.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        chipsWrap.appendChild(chip);
    });
}

/* ── Search ─────────────────────────────────── */
function initSearch() {
    const input = document.getElementById('shopSearch');
    if (!input) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        applyFilters(q);
    });
}

/* ── Filter Sidebar ─────────────────────────── */
function initFilters() {
    const applyBtn   = document.getElementById('applyFiltersBtn');
    const resetBtn   = document.getElementById('resetFiltersBtn');
    const minInput   = document.getElementById('priceMin');
    const maxInput   = document.getElementById('priceMax');

    if (!applyBtn) return;

    applyBtn.addEventListener('click', () => {
        const q = (document.getElementById('shopSearch')?.value || '').toLowerCase();
        applyFilters(q);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-group input[type="checkbox"]')
                .forEach(cb => cb.checked = true);
            if (minInput) minInput.value = '';
            if (maxInput) maxInput.value = '';
            const searchInput = document.getElementById('shopSearch');
            if (searchInput) searchInput.value = '';
            applyFilters('');
        });
    }
}

function getCheckedCategories() {
    const checked = [];
    document.querySelectorAll('.filter-group input[type="checkbox"]:checked')
        .forEach(cb => checked.push(cb.value));
    return checked;
}

function applyFilters(searchQuery) {
    const q          = (searchQuery || '').toLowerCase();
    const categories = getCheckedCategories();
    const minVal     = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const maxVal     = parseFloat(document.getElementById('priceMax')?.value) || Infinity;

    allCards().forEach(card => {
        const text  = cardText(card);
        const price = parseFloat(card.dataset.price || parsePrice(card.querySelector('.product-price')?.textContent));

        const matchesSearch   = !q || text.includes(q);
        const matchesPrice    = price >= minVal && price <= maxVal;
        const stallEl         = card.closest('.stall');
        const stallCat        = stallEl?.dataset.category || '';
        const matchesCategory = categories.length === 0 || categories.includes(stallCat) || stallCat === '';

        card.style.display = (matchesSearch && matchesPrice && matchesCategory) ? '' : 'none';
    });

    // Hide subcategory titles and grids when all their cards are hidden
    document.querySelectorAll('.subcategory-area').forEach(area => {
        const visible = area.querySelectorAll('.product-card:not([style*="display: none"])').length;
        area.querySelectorAll('.subcategory-title').forEach(t => t.style.display = visible ? '' : 'none');
        area.querySelectorAll('.product-grid').forEach(g => g.style.display = visible ? 'grid' : 'none');
    });

    // Hide entire stalls with no visible cards
    document.querySelectorAll('.stall').forEach(stall => {
        const visible = stall.querySelectorAll('.product-card:not([style*="display: none"])').length;
        stall.style.display = visible ? '' : 'none';
    });
}

/* ── Sort ───────────────────────────────────── */
function initSort() {
    const select = document.getElementById('shopSort');
    if (!select) return;

    select.addEventListener('change', () => {
        const mode = select.value;
        document.querySelectorAll('.product-grid').forEach(grid => {
            const cards  = Array.from(grid.querySelectorAll('.product-card'));
            const sorted = cards.sort((a, b) => {
                const pa = parseFloat(a.dataset.price || 0);
                const pb = parseFloat(b.dataset.price || 0);
                if (mode === 'plh') return pa - pb;
                if (mode === 'phl') return pb - pa;
                return 0;
            });
            sorted.forEach(c => grid.appendChild(c));
        });
    });
}

/* ── Stall Accordion ────────────────────────── */
function initAccordion() {
    document.querySelectorAll('.stall-header').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            const stall = header.closest('.stall');
            const isNowActive = stall.classList.toggle('active');
            const icon = stall.querySelector('.stall-toggle i');
            if (icon) {
                icon.classList.toggle('fa-chevron-circle-down', !isNowActive);
                icon.classList.toggle('fa-chevron-circle-up',   isNowActive);
            }
        });
    });
}

/* ── Feed Guide Tabs ────────────────────────── */
function initFeedGuides() {
    const tabs   = Array.from(document.querySelectorAll('.feed-tab'));
    const panels = Array.from(document.querySelectorAll('.feed-panel'));
    if (tabs.length === 0 || panels.length === 0) return;

    function activate(key) {
        tabs.forEach(t => {
            const on = t.dataset.tab === key;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
    }

    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
}

/* ── Wire WhatsApp links on static cards ───── */
function fixStaticWhatsAppLinks() {
    document.querySelectorAll('a.btn-whatsapp[href="#"], a.btn-whatsapp:not([href*="wa.me"])').forEach(a => {
        const card = a.closest('.product-card');
        if (!card) return;
        const name = card.querySelector('.product-name')?.textContent?.trim() || 'Product';
        const size = card.querySelector('.product-size')?.textContent?.trim() || '';
        const msg  = `Hello FarmFusion, I want to order: ${name} ${size}`.trim();
        a.href   = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
    });
}

/* ── Init All ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initChips();
    initSearch();
    initFilters();
    initSort();
    initAccordion();
    initFeedGuides();
    // Fix static cards after a tick to allow dynamic cards to render first
    setTimeout(fixStaticWhatsAppLinks, 200);
});
