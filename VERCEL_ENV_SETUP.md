# Vercel setup for secure contact form secrets

To keep API keys and business details safe on Vercel, do **not** hardcode them in frontend JS.

## 1) Environment variables to add in Vercel

In your Vercel project:
- Settings → Environment Variables

Add:

- `WEB3FORMS_KEY` = your Web3Forms access key (required)
- `BRAND_NAME` = `FarmFusion Supplies` (optional)
- `ALLOWED_ORIGINS` = comma-separated allowed origins (**required in production**)
  - Example: `https://farmfusion.co.zw,https://www.farmfusion.co.zw`

## 2) How it works now

- Browser submits to `/api/contact`.
- `api/contact.js` (serverless) reads secrets from environment variables.
- Serverless function forwards to Web3Forms.
- Secret key never appears in client code.

## 3) Local development

Create `.env.local` (do not commit):

```bash
WEB3FORMS_KEY=your_key_here
BRAND_NAME=FarmFusion Supplies
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 4) Security checklist

- Enable Web3Forms domain restriction in provider dashboard.
- Keep `ALLOWED_ORIGINS` strict.
- Rotate `WEB3FORMS_KEY` if it was previously exposed publicly.
- Use Vercel logs to monitor abuse spikes.


## 5) vercel.json in this repo

This repo now includes `vercel.json` to explicitly configure the API function:

- Pins `api/contact.js` to Node.js 20 runtime
- Sets a function timeout (`maxDuration`)
- Adds `Cache-Control: no-store` on `/api/*` responses

This file is optional for basic Vercel hosting, but useful when you want explicit runtime/behavior guarantees.


## 6) Production enforcement notes

- `api/contact.js` now **enforces** `ALLOWED_ORIGINS` when `NODE_ENV=production`.
- If `ALLOWED_ORIGINS` is missing in production, the API returns a server config error instead of accepting traffic from any origin.
- `vercel.json` now adds global security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).


## 7) GitHub → Vercel auto-deploy

This repo now includes `.github/workflows/vercel-deploy.yml` for CI-based deployments.

### Required GitHub secrets
Add these in GitHub repository settings (`Settings → Secrets and variables → Actions`):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Behavior
- Pull requests create **Preview** deployments.
- Pushes to `main` create **Production** deployments.

### One-time setup
From your local machine (once), run:

```bash
vercel link
```

Then copy `.vercel/project.json` values into GitHub Secrets:
- `orgId` -> `VERCEL_ORG_ID`
- `projectId` -> `VERCEL_PROJECT_ID`

> Note: The workflow uses `vercel pull/build/deploy` and expects these secrets to be available.
