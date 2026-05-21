# Audit & Fix — skyesummithomes.com (2026-05-21)

## Executive summary

| Issue | Severity | Status |
|-------|----------|--------|
| Vercel Git = `DrJanDuffy/skyesummithomes`, pushes go to `LetMeHelpYouREALTY/skyesummithomes` | **Critical** | Workflow added; needs `VERCEL_TOKEN` secret or Vercel Git reconnect |
| Production 404: `/skye-summit-realtor`, `/skye-summit-faq` | **High** | Fixed after next production deploy |
| `www` `last-modified` stale (Apr 2026) vs repo `main` (May 2026) | **High** | Same deploy fix |
| Docs pointed at wrong GitHub org | Medium | Fixed in `f535654` |
| Apex `skyesummithomes.com` → www redirect | Medium | Cloudflare page rule / worker (see `GSC-404-FIX.md`) |

## Live checks (2026-05-21)

```text
https://www.skyesummithomes.com/              → 200 (last-modified: Apr 2026)
https://www.skyesummithomes.com/about         → 200
https://www.skyesummithomes.com/contact       → 200
https://www.skyesummithomes.com/skye-summit-realtor → 404  ← not on production deploy
https://www.skyesummithomes.com/skye-summit-faq     → 404
https://www.skyesummithomes.com/las-vegas-zip-code-map → 200
https://skyesummithomes.com/contact           → 308 → www/contact
```

## Vercel (confirmed via API)

- **Project:** `skyesummithomes` — `prj_x5YkBzbd8OFKPbnKslImQEbaYuUT`
- **Team:** `janet-duffys-projects` — `team_EIbjFXaDDtGMTweb5Hvo3CG3`
- **Production deployment source:** `DrJanDuffy/skyesummithomes` @ `800ce1d` (not LetMeHelpYouREALTY `main`)

## Workflow note (2026-05-21)

| Run | Failure | Fix |
|-----|---------|-----|
| 1 | `npm ci` lockfile incomplete | Regenerated `package-lock.json` |
| 2 | `followupboss.js` + `.ts` conflict | Removed `.js`, kept `.ts` |
| 3 | Next.js detected (dashboard preset) | `"framework": null` + CI `vercel build` / `deploy --prebuilt` |

`VERCEL_TOKEN` is configured on GitHub; deploy should succeed after run 3.

## Fixes applied in this repo

1. **`.github/workflows/vercel-production.yml`** — On push to `main`, runs `npm run build` and `vercel deploy --prod` using `VERCEL_TOKEN`.
2. **`.vercel/project.json`** — Links CLI/CI to the correct Vercel project.
3. **`vercel.json`** — Rewrites now target `/{slug}/index.html` (matches `scripts/generate-clean-urls.js` output).
4. **Docs** — Canonical remote `LetMeHelpYouREALTY/skyesummithomes` (see `VERCEL-AUTO-DEPLOY.md`).

## What you must do once (pick one)

### Option A — GitHub Actions (recommended with this repo)

1. [Create a Vercel token](https://vercel.com/account/tokens) with deploy access.
2. GitHub → **LetMeHelpYouREALTY/skyesummithomes** → Settings → Secrets → Actions → **New repository secret** → `VERCEL_TOKEN`.
3. Push to `main` (or re-run workflow). Confirm in [Vercel Deployments](https://vercel.com/janet-duffys-projects/skyesummithomes).

### Option B — Reconnect Vercel Git

Vercel → skyesummithomes → Settings → Git → connect **`LetMeHelpYouREALTY/skyesummithomes`**, production branch **`main`**.

### Option C — Mirror to DrJanDuffy

Merge `LetMeHelpYouREALTY/main` into `DrJanDuffy/skyesummithomes/main` so existing Vercel Git integration deploys.

## Verify after deploy

```bash
curl -sI https://www.skyesummithomes.com/skye-summit-realtor | head -3
curl -sI https://www.skyesummithomes.com/skye-summit-faq | head -3
```

Expect **HTTP/2 200** and a recent `last-modified`.

## Re-run audit locally

```bash
bash scripts/audit-live-urls.sh
```
