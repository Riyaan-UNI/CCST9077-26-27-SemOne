# Contributing to "The Quantum Revolution" site

Thanks for helping out! This is the CCST9077 group-project microsite (React + Vite + TypeScript + Tailwind). Follow this template so your changes build and deploy cleanly — **you never have to build or upload anything yourself**; pushing to `main` auto-deploys the live site.

## 1. Get access (repo owner does this)
- The owner adds you as a **Collaborator with Write access**:
  repo **Settings → Collaborators → Add people** → enter your GitHub username → choose role **Write** → **Add collaborator**. Accept the invite in the email GitHub sends.
- No role needed if you prefer to **fork** the repo and open a Pull Request instead.
- The site deploys automatically from the `main` branch via GitHub Actions. Just push to `main` (or merge your PR into `main`).

## 2. One-time local setup
```bash
git clone https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne.git
cd CCST9077-26-27-SemOne
npm install
```
> Node 20+ required. The repo pins `typescript@^5.9`; an `npm ci` warning on a different Node is harmless.

## 3. Daily workflow (copy this template)
1. **Pull latest:** `git pull`
2. **Branch for your change:**
   ```bash
   git checkout -b feature/short-description
   # examples: feature/gallery-captions   fix/chsh-mobile-layout
   ```
3. **Start the dev server** (live preview at http://localhost:5173):
   ```bash
   npm run dev
   ```
4. **Make your edits.** Good starting points:
   - Pages: `src/pages/` — Home, Timeline, HypeCheck, Lab, Gallery, About
   - Shared UI bits: `src/components/`
   - Quantum engine: `src/quantum/simulator.ts`
   - Text / data: `src/data/`
5. **Run the same checks CI runs before you finish:**
   ```bash
   npm test        # Vitest unit tests (quantum physics + utils)
   npm run build   # production build must succeed with no errors
   ```
   A clean local `npm run build` is the best signal your change will deploy.
6. **Commit with a clear message:**
   ```bash
   git add -A
   git commit -m "fix: correct CHSH bar layout on mobile"
   ```
7. **Push and open a PR** (or push straight to `main` if you have Write access):
   ```bash
   git push -u origin feature/short-description
   ```
   On GitHub: **Pull requests → New → base: `main` ← compare: `feature/...` → Create pull request**.

## 4. Project-specific gotchas
- **Sub-path base.** The site lives at `/CCST9077-26-27-SemOne/`. The build sets this automatically via `VITE_BASE` in `.github/workflows/deploy.yml`. When you run `npm run build` locally on Git Bash / Windows, prefix it so paths aren't mangled:
  ```bash
  MSYS_NO_PATHCONV=1 VITE_BASE=/CCST9077-26-27-SemOne/ npm run build
  ```
- **Public assets** (e.g. `public/favicon.svg`, `public/gallery/*.svg`) are referenced with an absolute path like `/favicon.svg`; Vite rewrites them to the base — **don't hard-code the repo name** in links.
- **SPA routing.** `dist/404.html` is a copy of `index.html` so deep links (e.g. `/lab`) survive a page refresh. Don't delete it.
- **Accessibility & tests.** New UI must pass the Playwright + axe-core checks in `e2e/`. Keep contrast and labels sane.
- **Line endings.** The repo normalises to LF; let Git/Prettier handle it — don't mass-convert files.

## 5. What happens on push
GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci → npm test → build → deploy-pages`. Within ~1–3 minutes the live site at **https://riyaan-uni.github.io/CCST9077-26-27-SemOne/** updates. If a check fails, the deploy is skipped and you'll see the failure in the **Actions** tab.

## 6. Stuck? Quick fixes
- `rm -rf node_modules dist && npm install` if anything looks corrupted.
- Restart `npm run dev` if hot-reload misbehaves.
- Ping Riyaan for access or review help.
