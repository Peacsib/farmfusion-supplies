# FarmFusion Supplies Website

A production-ready static website for **FarmFusion Supplies**, focused on product discovery and fast customer conversion through WhatsApp, calls, and a secure contact form.

## Highlights

- Multi-page marketing/catalog experience (`index`, `products`, `about`, `contact`)
- Mobile-first navigation with dynamic interactions
- Product filtering/sorting and stockfeed data rendering in-browser
- Secure Vercel serverless contact proxy (`/api/contact`) for Web3Forms
- Production hardening via `vercel.json` security headers and API cache controls
- GitHub Actions workflow for Vercel preview + production deployments

## Project Structure

```text
.
├── index.html
├── products.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── assets/
│   ├── retail-micro.css
│   └── luxury-agro.css
├── js/
│   ├── main.js
│   ├── products.js
│   ├── products-data.js
│   ├── stock-data.js
│   ├── contact.js
│   ├── business-config.js
│   └── business-bindings.js
├── api/
│   └── contact.js
├── vercel.json
└── .github/workflows/
    └── vercel-deploy.yml
```

## Local Development

### Option A: static server

```bash
python -m http.server 4173
```

Then open:

- `http://localhost:4173/index.html`

### Option B: Vercel local runtime

If Vercel CLI is available in your environment:

```bash
vercel dev
```

This runs both static pages and serverless functions (`/api/contact`) locally.

## Environment Variables (Vercel)

Configure in **Vercel → Project Settings → Environment Variables**:

- `WEB3FORMS_KEY` (required)
- `BRAND_NAME` (optional, defaults to `FarmFusion Supplies`)
- `ALLOWED_ORIGINS` (required in production; comma-separated)

Example:

```env
WEB3FORMS_KEY=your_web3forms_access_key
BRAND_NAME=FarmFusion Supplies
ALLOWED_ORIGINS=https://farmfusion.co.zw,https://www.farmfusion.co.zw
```

## Deployment

### GitHub → Vercel CI/CD

This repository includes `.github/workflows/vercel-deploy.yml` with:

- **Preview** deployments on pull requests
- **Production** deployments on pushes to `main`

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Security Notes

- Client-side keys are not used for contact submissions.
- `api/contact.js` requires `WEB3FORMS_KEY` and enforces `ALLOWED_ORIGINS` in production.
- `vercel.json` applies security headers including CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.

## Business Configuration

Business constants (phone, WhatsApp, email, brand metadata) are centralized in:

- `js/business-config.js`

DOM hydration for `data-business-*` attributes is handled by:

- `js/business-bindings.js`

This keeps content consistent across all pages and reduces update drift.

## Tech Stack

- HTML5/CSS3/Vanilla JavaScript
- Vercel Serverless Functions (Node.js runtime)
- Web3Forms (via server-side proxy)
- GitHub Actions for CI/CD deployments

## Documentation

- `VERCEL_ENV_SETUP.md` — deployment and environment setup
- `HEALTH_AUDIT.md` — project audit and recommendations

## License

Proprietary internal project for FarmFusion Supplies.
