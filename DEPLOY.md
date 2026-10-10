# Deployment

The site is a static build (`dist/`) with client-side routing, so it runs on any static host. **GitHub Pages is already wired up** — push to `main` and the live site updates.

---

## Recommended: GitHub Pages (free, no extra account)

The workflow lives at `.github/workflows/deploy.yml`. It runs on every push to `main`, installs with `npm ci`, runs the unit tests, builds with the correct base path, and publishes to Pages.

### One-time setup (about 30 seconds)

1. Open **https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. That's it. The next push to `main` deploys.

You can also trigger a deploy by hand: **Actions → Deploy to GitHub Pages → Run workflow**.

### Your live URL

```
https://riyaan-uni.github.io/CCST9077-26-27-SemOne/
```

First deploy takes ~1 minute. Subsequent pushes are usually live within 60–90 seconds.

### How the update-on-commit loop works

```
edit files  →  git add .  →  git commit -m "…"  →  git push
                                                        │
                          GitHub Actions: install → test → build → publish
                                                        │
                                          live site updates (~1 min)
```

There is nothing else to run. Just `git push`.

### The three things that make a sub-path deploy work

GitHub Pages *project* sites are served from `/<repo-name>/`, not the domain root, which breaks a naive Vite build in three ways. All three are already handled:

| Problem | Fix |
|---|---|
| Asset URLs point at `/assets/…` instead of `/CCST9077-26-27-SemOne/assets/…` | `vite.config.ts` reads `base` from `VITE_BASE`, which the workflow sets to `/<repo-name>/` |
| Client-side routes 404 on refresh or deep links | `main.tsx` passes `import.meta.env.BASE_URL` to `BrowserRouter` as its `basename` |
| Public files like `/gallery/x.svg` 404 | `src/data/gallery.ts` builds paths with the `asset()` helper from `src/lib/utils.ts` |

**If you add a new file under `public/` and reference it in code, wrap the path in `asset()`.** Otherwise it will work locally and break on Pages.

Because `base` defaults to `/`, the same codebase also deploys correctly to a root-served host (Vercel, Netlify) with no changes.

---

## Alternative: Vercel (nicer URL, needs a free account)

Zero config — Vercel detects Vite.

1. Sign in at **https://vercel.com** with GitHub.
2. **Add New → Project → Import** `CCST9077-26-27-SemOne`.
3. Framework preset: **Vite**. Leave build command and output directory as detected (`npm run build`, `dist`).
4. **Deploy.**

Every push to `main` redeploys automatically; pull requests get preview URLs. `SPA` routing works out of the box.

## Alternative: Netlify

1. Sign in at **https://netlify.com** with GitHub.
2. **Add new site → Import an existing project** → pick the repo.
3. Build command `npm run build`, publish directory `dist`.
4. **Deploy.**

Add a `public/_redirects` file containing the line below so deep links work (Pages and Vercel do not need this):

```
/*  /index.html  200
```

## Alternative: Cloudflare Pages

Same shape as Netlify: connect the repo, build command `npm run build`, output directory `dist`.

---

## Custom domain

All of the hosts above support a custom domain in their dashboard. For GitHub Pages, add a `CNAME` record at your DNS provider pointing at `riyaan-uni.github.io`, then enter the domain under **Settings → Pages → Custom domain**. Keep `base` as-is unless you serve from the domain root — if you move to a root domain, set `VITE_BASE=/` (or drop it) in the workflow.

## Manual build, for reference

```bash
npm ci
npm test
npm run build          # root-served hosts
VITE_BASE=/CCST9077-26-27-SemOne/ npm run build   # GitHub Pages project site
```

Preview a Pages-style build locally (the sub-path matters):

```bash
cp dist/index.html dist/404.html
VITE_BASE=/CCST9077-26-27-SemOne/ npx vite preview --port 4173
# open http://127.0.0.1:4173/CCST9077-26-27-SemOne/
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| Page loads but is unstyled / blank | `VITE_BASE` missing or wrong for a sub-path host |
| `/lab` works when clicked but 404s on refresh | Missing SPA fallback — GitHub Pages needs `dist/404.html` (the workflow creates it); Netlify needs `public/_redirects` |
| Images or SVG plates missing on Pages only | A `/public` path was written literally instead of via `asset()` |
| Deploy succeeded but the old site is still shown | Browser cache — hard refresh, or check the Actions run finished |
| Actions fails at `npm ci` | `package-lock.json` out of sync with `package.json` — run `npm install` locally and commit the lockfile |
