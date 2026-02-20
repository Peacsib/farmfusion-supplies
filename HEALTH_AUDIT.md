# FarmFusion Supplies Repo Health Audit

Date: 2026-02-20

## Scope

Reviewed the static website repository for:
- SEO basics
- Accessibility fundamentals
- Performance and frontend hygiene
- Security/privacy risks
- Content and maintainability

## Automated checks run

1. HTML structure + missing local links scan across top-level pages.
2. Image `alt` coverage scan.
3. Pattern scan for exposed keys, inline styles, external links, and script usage.

## Findings

### 1) SEO: **Good baseline, but can be improved**

**What is working**
- Each page has exactly one `<h1>` and one meta description.
- Open Graph tags and canonical-style absolute URLs are present.
- Favicons and web manifest are configured.

**Risks / opportunities**
- No explicit `<link rel="canonical">` tags detected.
- No structured data (JSON-LD) found for `Organization`, `LocalBusiness`, or `Product` snippets.
- Significant repeated inline content may dilute maintainability and consistency across pages.

**Priority**: Medium

---

### 2) Accessibility: **Mostly decent semantics, but needs hardening**

**What is working**
- Navigation and landmarks use semantic HTML (`header`, `nav`, `main`, section labels).
- Image alt text is present in scanned pages.
- Mobile menu includes aria attributes and keyboard escape close logic.

**Risks / opportunities**
- Large amount of inline styles can make consistent contrast and focus states harder to maintain.
- Need a keyboard-only walkthrough to confirm no trap/regression in side menu interactions.
- Consider adding stronger visible focus treatment for all interactive controls in one shared stylesheet rule-set.

**Priority**: Medium

---

### 3) Performance: **Reasonable setup with clear wins remaining**

**What is working**
- Home page defers fonts/icons via `media="print"` + `onload` for better perceived rendering.
- Lazy loading is used in generated product cards.

**Risks / opportunities**
- Non-home pages load external font/icon CSS synchronously.
- Very large inline CSS blocks and repeated inline style attributes increase HTML payload and reduce cache efficiency.
- Potential JS payload and DOM size bloat on products page from large embedded content and dynamic card generation.

**Priority**: High (products page), Medium (others)

---

### 4) Security/Privacy: **One important issue**

**Issue**
- Web3Forms access key is embedded client-side in `js/contact.js`.

**Impact**
- Public keys are expected for some form providers, but this can still invite abuse/spam if domain restrictions/rate limits are not set.

**Recommendations**
- Confirm Web3Forms dashboard hardening: allowed domains + rate limiting + spam controls.
- Consider moving form submission behind a small serverless endpoint for stronger control and secret handling.

**Priority**: High

---

### 5) Content/Code maintainability: **Needs consolidation**

**Observations**
- Extensive repeated header/footer and inline styling across HTML pages.
- Product content and presentation logic are split across several files (`stock-data.js`, `products-data.js`, `products.js`) which works, but should be validated by lightweight smoke tests to prevent regressions.

**Recommendations**
- Centralize repeated UI sections using a shared include/templating build step (even lightweight static-site tooling).
- Move inline styles into CSS classes progressively.
- Add a small CI check (HTML link check + lint) to catch breakages early.

**Priority**: Medium

## Prioritized action plan (Top 5)

1. Harden contact form anti-abuse controls (domain lock/rate limit or serverless proxy).
2. Add canonical tags + JSON-LD (`Organization`, branch details, and product snippets where useful).
3. Refactor inline styles into shared CSS classes and reduce per-page style duplication.
4. Align font/icon loading strategy on all pages with non-blocking approach.
5. Add lightweight CI checks (broken local links + basic HTML/JS lint pass).

## Audit result summary

- **Overall health**: Good functional baseline for a static business site.
- **Primary risk**: client-exposed form integration key and abuse controls.
- **Primary scalability issue**: maintainability/performance drag from repeated inline styling/content.
