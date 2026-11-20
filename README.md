# windom.app

The site for [WindoM](https://github.com/WindoM-app/windom): landing page, guide, local-setup docs, and the legal pages. English and Hebrew. React + Vite, prerendered to static HTML and deployed to GitHub Pages.

The extension and backend live in [`WindoM-app/windom`](https://github.com/WindoM-app/windom). This repo reads exactly two files from it at build time: `CHANGELOG.md` (the release feed) and `web/manifest.json` (the extension version).

## Develop

```bash
npm ci
bash scripts/fetch-product.sh   # clones the product repo into ./product (REF=<tag> to pin)
npm run dev
```

`PRODUCT_DIR` overrides where the product checkout is read from.

| Command | What it does |
|---|---|
| `npm run lint` / `format:check` / `typecheck` | Static checks |
| `npm test` | Unit tests (`node --test`) |
| `npm run build` | Typecheck, build, prerender every route, sitemap |
| `bash scripts/verify-dist.sh` | Every public URL still exists |
| `npm run audit:overflow` | No horizontal overflow at any scroll position (needs Playwright Chromium) |

## Deploy

Merging to `main` deploys via GitHub Actions. It also redeploys nightly and whenever the product repo cuts a release (it starts the deploy with `workflow_dispatch`), so a new release reaches the feed.

## Things that must be edited by hand

When the product changes, mirror it here: env vars (`src/lib/env-reference.ts` and the Local Setup pages), features (`src/data/features.ts`), and the glass styles/time helpers noted in their file headers.

MIT licensed. See [CONTRIBUTING](https://github.com/WindoM-app/windom/blob/main/CONTRIBUTING.md) and the org [security policy](https://github.com/WindoM-app/.github/blob/main/SECURITY.md).
