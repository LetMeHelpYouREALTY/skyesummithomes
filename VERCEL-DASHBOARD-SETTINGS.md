# Vercel Dashboard — Align Project Settings with Production

## What you are seeing

| Layer | Framework | Build command | Output | Install |
|-------|-----------|---------------|--------|---------|
| **Production Overrides** (live deploy `8p8fb3j8m…`) | **Other** | `npm run build` | `.` | `npm ci` |
| **Project Settings** (dashboard) | **Next.js** | `next build` (default) | `next` | `npm install` (default) |

Production is **correct** (static HTML site). Project Settings are **stale** from when the project was created or mis-detected as Next.js.

The warning *"Configuration Settings in the current Production deployment differ from your current Project Settings"* is expected until you update the dashboard.

This repo also sets the same values in **`vercel.json`** (`framework: null`, `buildCommand`, `outputDirectory`, `installCommand`). GitHub Actions uses **`vercel build` + `deploy --prebuilt`** so production matches `vercel.json`, not the Next.js preset.

---

## Set these in Vercel (one-time)

**Vercel** → [skyesummithomes](https://vercel.com/janet-duffys-projects/skyesummithomes) → **Settings** → **General** → **Build and Deployment**

### Framework Settings

| Field | Set to |
|-------|--------|
| **Framework Preset** | **Other** |
| **Build Command** | `npm run build` |
| **Output Directory** | `.` |
| **Install Command** | `npm ci` |

Leave **Root Directory** as `./` (empty or dot).

Do **not** use Next.js defaults (`next build`, output `next`).

Click **Save**. Optionally trigger **Redeploy** once so Project Settings and Production Overrides match.

### Node.js

| Field | Value |
|-------|--------|
| **Node.js Version** | **22.x** (already correct) |

### Ignored Build Step (optional)

Your custom command is fine for skipping doc-only commits:

```bash
git diff --quiet HEAD^ HEAD -- . ':(exclude)README.md' ':(exclude)**/*.md' ':(exclude)**/*.mdx' || exit 1
```

If Git is reconnected to **LetMeHelpYouREALTY**, this applies to those pushes. The **GitHub Actions** workflow on `main` always deploys regardless of this setting.

---

## Git integration

**Settings** → **Git** — should show:

| Field | Value |
|-------|--------|
| Repository | **LetMeHelpYouREALTY/skyesummithomes** (connected) |
| Production Branch | **main** |

### Optional toggles (defaults are fine)

| Toggle | Suggestion |
|--------|------------|
| Pull Request Comments | On — Vercel preview links on PRs |
| Commit Comments | Off unless you want inline deploy notes on every commit |
| deployment_status Events | On — GitHub shows deploy success/failure |
| repository_dispatch Events | Off unless you use external automation |
| Commit Status | On — GitHub checks for Vercel |
| Require Verified Commits | Off (unless team policy requires it) |
| Git LFS | Off — not used in this repo |

### Deploy Hooks

Not required when Git is connected. Use only for external triggers (Zapier, manual curl) without a git push.

Keep **GitHub Actions** as a backup if dashboard framework is still Next.js and Git-triggered builds fail — see [VERCEL-AUTO-DEPLOY.md](./VERCEL-AUTO-DEPLOY.md).

---

## After saving

1. Warning about Production vs Project Settings should disappear on the next production deploy.
2. Remote `vercel build` (if used) should no longer error with *No Next.js version detected*.
3. Verify: `bash scripts/audit-live-urls.sh` — all paths should return **200**.

---

## Source of truth (priority)

1. **`vercel.json`** in this repo (committed)
2. **GitHub Actions** prebuilt deploy (when `VERCEL_TOKEN` is set)
3. **Vercel dashboard** Project Settings (should match table above)
