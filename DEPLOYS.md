# Deploy & Testing Notes — Coonawarra Itinerary Builder

Operational knowledge for working on this repo, kept here so it survives beyond any one chat session.

---

## Working pattern

1. Build on a feature branch — never commit directly to `main` for anything non-trivial.
2. Test before merging.
3. Report results in plain terms and get explicit sign-off before merging.
4. Merge to `main`.
5. Verify live in production after the deploy completes.
6. Note the pre-deploy production deploy ID as the rollback target before shipping anything risky.

## Deploy is CI, not CLI

Unlike `ce-crm-dashboard`, this site **is** connected to GitHub via Netlify's auto-deploy-on-push — pushing to `main` triggers a build and deploy automatically. No manual `netlify deploy --prod` step is needed here.

- If changes aren't appearing on the live site after a push, the most common cause is a **cached deploy** — trigger a "Deploy without cache" from the Netlify dashboard before assuming the code itself is wrong.
- `git revert` on this repo *does* eventually republish the site (CI picks up the new commit), unlike the CRM dashboard — but it still isn't instant. For anything urgent, the Netlify dashboard's "Rollback to this deploy" is still faster.

## CORS gotcha: cross-origin POSTs from the shared itinerary HTML

The standalone shared itinerary page (served from Netlify, a different origin than this app's own functions in some flows) needs to ping `itineraries.js` to record a first-view, but a plain cross-origin `fetch(...)` with `Content-Type: application/json` triggers a CORS preflight (`OPTIONS`) request — which reliably fails in this setup.

**Fix already in place** (see `src/App.jsx`, the view-tracking `<script>` block in `generateOfflineHTML()`): use `navigator.sendBeacon(url, new Blob([payload], {type: "text/plain"}))` instead. `text/plain` is a CORS-safelisted content type, so the browser treats it as a "simple request" and skips the preflight entirely. `itineraries.js` parses the body as JSON regardless of the declared `Content-Type` header, so this doesn't affect the server side at all.

**If you ever need another cross-origin POST from generated/shared HTML to a Netlify Function here**, follow the same pattern — don't reach for `application/json` cross-origin without either handling `OPTIONS` server-side or switching to `sendBeacon` + `text/plain`.

## Deploy manifest gotcha (per-itinerary deploys via `deploy.js`)

`netlify/functions/deploy.js` publishes individual shared-itinerary pages directly via the Netlify API (not through a full site build). Netlify's deploy manifest for this kind of API-driven deploy is **exhaustive** — any file path not included in the manifest gets deleted from the live site, not left alone.

`deploy.js` handles this by fetching the currently-live file list first and merging the new/changed file into it, rather than sending a single-file manifest that would wipe out every other previously-shared itinerary page. **Any future code that deploys via the Netlify API directly (not a full `netlify deploy` from a built `dist/`) must follow the same merge-in pattern** — never construct a manifest from scratch with just the file(s) you're touching.

## Known issue: exposed Netlify token (historical)

A Netlify personal access token was previously exposed in this public repo. It was flagged and is believed rotated/resolved, but this repo is public (unlike the CRM dashboard's private one) — be extra deliberate about not committing secrets here. Confirm any Netlify API token in use is current before relying on it, and never commit `.env` or equivalent.

## Security posture — open question as of 14 Jul 2026

Whether this app's Netlify Functions (`images.js`, `deploy.js`, `itineraries.js`) are callable by anyone without authentication (the same blind spot `ce-crm-dashboard` had before Phase 3a) has not yet been audited. Treat this as an open question, not a confirmed-safe assumption, until that audit happens.
