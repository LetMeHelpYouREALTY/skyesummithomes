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

## Git integration (Settings → Git)

**Path:** Vercel → [skyesummithomes](https://vercel.com/janet-duffys-projects/skyesummithomes) → **Settings** → **Git**

### Connected repository

| Field | Expected value |
|-------|----------------|
| **Connected Git Repository** | `LetMeHelpYouREALTY/skyesummithomes` |
| **Production Branch** | **`main`** (confirm on this screen or under Git → Production Branch) |

If the repo shows **`DrJanDuffy/skyesummithomes`**, reconnect Git to **LetMeHelpYouREALTY** — pushes to the wrong remote will not update production. See [VERCEL-AUTO-DEPLOY.md](./VERCEL-AUTO-DEPLOY.md).

### Connected Git Repository toggles

These appear under **Connected Git Repository** on the Git settings page:

| Toggle | Recommended | Why |
|--------|-------------|-----|
| **Pull Request Comments** | **On** | Posts Vercel preview URLs on PRs — useful before merging to `main` |
| **Commit Comments** | **Off** | Avoids a deploy comment on every commit |
| **deployment_status Events** | **On** | Shows deploy success/failure in GitHub Checks |
| **repository_dispatch Events** | **Off** | Not used unless you trigger deploys from external automation |

### Git Commits section

| Setting | Recommended | Why |
|---------|-------------|-----|
| **Commit Status** | **On** | GitHub shows pass/fail for Vercel builds |
| **Consolidated Commit Status** | **On** (Soft Failures OK) | One combined status instead of many checks |
| **Require Verified Commits** | **Off** | Unless your org requires signed commits |

### Git Large File Storage (LFS)

| Setting | Recommended |
|---------|-------------|
| **Git LFS** | **Off** — this repo does not use LFS (images are normal Git blobs) |

### Deploy Hooks

| Setting | Recommended |
|---------|-------------|
| **Deploy Hooks** | **None needed** when Git is connected |

Deploy hooks are for triggering a deploy **without** a git push (Zapier, cron curl, etc.). This project deploys from **`main`** pushes and [`.github/workflows/vercel-production.yml`](./.github/workflows/vercel-production.yml).

To add one later: **Name** = descriptive label, **Branch** = `main`.

---

## Dual deploy on `main` (Git + GitHub Actions)

Two systems can deploy production when you push to **`main`**:

| Trigger | What runs |
|---------|-----------|
| **Vercel Git integration** | Remote build from dashboard settings (must be **Other**, not Next.js) |
| **GitHub Actions** | `npm run build` → `npm run validate:gsc` → `vercel build --prebuilt` → `vercel deploy --prebuilt --prod` |

**Keep GitHub Actions** — it runs [GSC www checks](./GOOGLE-SEARCH-CONSOLE.md) before deploy.

**Fix dashboard Framework → Other** (above) so Vercel Git deploys succeed instead of failing with *No Next.js version detected*.

If both succeed on the same push, you may see two production deployments; the latest wins. That is harmless.

---

## Google Search Console + www

Production must serve **https://www.skyesummithomes.com** as canonical:

- Apex `https://skyesummithomes.com/*` → **308/301** → www (see `vercel.json`)
- Sitemap in GSC: **`https://www.skyesummithomes.com/sitemap.xml`** only
- URL Inspection: always use **www** URLs

Full checklist: [GOOGLE-SEARCH-CONSOLE.md](./GOOGLE-SEARCH-CONSOLE.md).

---

## Git integration (quick reference)

**Settings** → **Git** — should show:

| Field | Value |
|-------|--------|
| Repository | **LetMeHelpYouREALTY/skyesummithomes** (connected) |
| Production Branch | **main** |

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
