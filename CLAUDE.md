# Coonawarra Experiences — Itinerary Builder App

Project-specific context for the React/Vite itinerary builder.
Read the root CLAUDE.md first for full business context.

---

## What This App Does

A web-based itinerary builder for Coonawarra Experiences. It generates branded, printable A4 itineraries for guests and trade partners. The app runs in two modes: guest-facing and trade mode (with agent logo, commission rates and net pricing).

---

## Live URLs

| Environment | URL |
|---|---|
| Production | https://coonawarra-itinerary-builder.netlify.app |
| GitHub repo | https://github.com/SimonMeares/coonawarra-itinerary-builder |

---

## Tech Stack

| Layer | Detail |
|---|---|
| Framework | React with Vite |
| Styling | Inline styles and CSS, CE brand colours |
| Image hosting | Cloudinary (cloud name: dgzv5n4f3, upload preset: ce_unsigned) |
| Deployment | Netlify (connected to GitHub repo, auto-deploy on push) |
| Email integration | Gmail OAuth — creates draft itineraries via Gmail API |
| Share links | Netlify-hosted shareable link output |

---

## Repository Structure

```
coonawarra-itinerary-builder/
├── src/
│   └── App.jsx          ← Main application file. All logic lives here.
├── public/
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

The entire app is effectively a single file: `src/App.jsx`.
When making changes, edit App.jsx and commit to GitHub. Netlify deploys automatically.

---

## Standard Deploy Workflow

1. Make changes to `src/App.jsx`
2. Commit and push to GitHub (`main` branch)
3. Go to Netlify dashboard
4. Trigger a deploy **without cache** (important — cached deploys can serve stale builds)
5. Verify the production URL after deploy completes

If the deploy looks correct in GitHub but the live site hasn't updated, always clear cache and redeploy first before debugging the code.

---

## Key Features Built

- **17 products** in the product library with descriptions, pricing and Cloudinary images
- **Cover page** — A4 branded cover with CE logo, guest name, travel dates and hero image
- **Section dividers** — Day headers and category separators
- **Trade mode** — Toggle to show agent logo, commission percentage and net rates
- **Guest mode** — Clean consumer-facing output without pricing detail
- **Gmail draft creation** — OAuth flow that creates a Gmail draft with the itinerary attached
- **Netlify share link** — Generates a shareable URL for the itinerary
- **Cloudinary image hosting** — All product images hosted on Cloudinary, not bundled in the repo

---

## Product Library

The app contains 17 products. Each product has:
- Name
- Description
- Duration
- Retail price per person
- Cloudinary image URL
- Category (wine, heritage, wildlife, farm, coastal, dining, multi-day)

When adding new products, follow the existing object structure in App.jsx.

---

## Cloudinary Setup

- **Cloud name:** dgzv5n4f3
- **Upload preset:** ce_unsigned (unsigned upload — no API key required for uploads)
- **Base URL pattern:** `https://res.cloudinary.com/dgzv5n4f3/image/upload/[public_id]`

To add a new image:
1. Upload to Cloudinary via the dashboard or unsigned upload endpoint
2. Copy the public_id
3. Construct the full URL and add it to the relevant product in App.jsx

---

## Gmail OAuth Integration

The app uses Gmail OAuth to create draft emails with the itinerary as an attachment.
The OAuth credentials are managed via Netlify environment variables — never hardcode them in the repo.

**Netlify environment variables required:**
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`

If Gmail drafts stop working, check:
1. The refresh token has not expired
2. The Netlify environment variables are correctly set
3. The serverless function in `netlify/functions/` is deployed correctly

---

## Trade Mode

When trade mode is enabled:
- Agent logo appears on the cover page (uploaded by the user at runtime)
- Commission rate is selectable (20% or 25%)
- Net rates are calculated and displayed alongside retail rates
- Trade mode output is not intended for guests — it is for agent use only

Wholesale rate sheets for 2027/28 season are still in progress as a separate document.

---

## Known Issues and History

- A Netlify personal access token was previously exposed in the public GitHub repo. This was flagged as a security incident. Confirm the token has been rotated and the exposure resolved before working with any Netlify API calls.
- The app uses localStorage for state persistence within a session. There is no backend database.
- Cached Netlify deploys have caused confusion in the past — always deploy without cache when changes are not appearing on the live site.

---

## Brand Colours (quick reference)

Use these consistently in any UI work:

| Name | Hex |
|---|---|
| Deep Navy | #192957 |
| Sand | #d8c69d |
| Teal | #40c0c0 |
| Terracotta | #d34727 |

Font stack in order of preference: Cabin (headings), PT Serif Italic (tagline/display), Source Sans Pro (body). Fall back to Georgia and Open Sans if unavailable.

---

## Related Apps

| App | URL | Repo |
|---|---|---|
| Booking email generator | https://coonawarra-booking-tool.netlify.app | SimonMeares/coonawarra-booking-tool |

The booking tool uses a similar Netlify serverless function pattern for Gmail draft creation.

---

## What Good Output Looks Like

A well-generated itinerary from this app should:
- Feel premium and on-brand — not like a generic template
- Include a clear day-by-day structure with logical flow
- Show accurate pricing and durations
- Read like a Coonawarra Experiences document — warm, specific, locally grounded
- Print cleanly to A4 with no content overflow or layout breaks
- Work equally well as a shared link or a Gmail draft attachment
