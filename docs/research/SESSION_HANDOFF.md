# MOTORA — session handoff / master context prompt

Paste everything below as the first message in a new chat to resume this project with full context.

---

I'm continuing work on **MOTORA**, a multi-category vehicle rental platform for India (bikes, scooters, cars, EVs, trucks, JCBs, tractors). This is a portfolio/investor-demo build, not a live product — no real bookings or payments.

**Repo:** https://github.com/subaselvan/motora (public — was made public temporarily to let Render deploy it; flip back to private if I ask)
**Local path:** `C:\Users\subas\Projects\motora-homepage`
**Live preview:** https://motora-preview.onrender.com (Render free-tier web service, auto-deploys on push to `main`)
**Stack:** Next.js (App Router) + TypeScript + Tailwind, three.js for the hero 3D object. No database yet — everything is an in-memory demo dataset in `src/lib/vehicles.ts`.

## Read these files first, in this order
1. `CLAUDE.md` — project context, locked decisions, working protocol. **Read this before touching anything.**
2. `PRODUCT.md` — product truth (users, positioning, capabilities).
3. `DESIGN.md` + `.impeccable/design.json` — the design system, tokens, named rules.
4. `docs/research/DESIGN_INSPIRATION_SCAN.md` — the most recent design research applied (Turo/Airbnb/CRED/United Rentals patterns).

## Working protocol (from CLAUDE.md — this matters)
Step-by-step, confirm-before-major-move. Don't scaffold large unimplemented chunks or make architectural decisions silently — check in before any new route group, new data model, or new integration. Model guidance: Sonnet-class at medium effort for routine UI/code; Opus reserved for genuine architecture tradeoffs, not routine implementation — and even then, medium effort for visual work (high effort tends to overcomplicate UI). Before hand-writing something, check whether an available skill/MCP connector fits (I have used `impeccable`, Render's MCP, and design-review skills like `taste-skill`/`soft-skill` in this project already).

## Locked decisions (do not silently reopen these)
- **Two tracks, one account:** Ride & Drive (bikes/scooters/cars/EVs, self-drive only) and Heavy & Farm (trucks/JCBs/tractors, self-drive OR operator-included as a **booking-time toggle**, not a per-listing property).
- **Brand:** lime (`#C6FF3D`) is the primary functional colour (CTA/price/trust/success). Orange (`#FF7A1A`) is secondary (badges/urgency). Dark-only, no light mode. Space Grotesk headings + Inter body (both self-hosted variable fonts, verified actually rendering — not a fallback). The go-kart badge logo (red `#D8050A`/yellow `#FCCF00`) is a separate asset system; those colours never enter UI tokens.
- **Elevation: ONE shared shadow tier** (`--elev` in `globals.css`), decided 2026-09-14 following Airbnb's pattern. This *reversed* a 5-level ladder built earlier the same day — don't rebuild the ladder without asking. `--elev-sunken` is a separate inset for inputs/wells (a recess, not a tier).
- **Trust score volume:** loud exactly once (the homepage hero's trust ledger, labelled a *sample* record), quiet everywhere else (cards only show "Unlocks at N trust" when locked, never the score itself). Revisit when a vehicle detail page exists.
- **No stock photography, ever.** No "gradient hero + 3 cards" template — explicitly banned in 3 docs. Homepage hero has a real WebGL 3D object (a go-kart, built from primitive geometry, `src/components/hero-kart.tsx`), not a 2D graphic.
- **Image generation is currently blocked:** the Gamma `generate_image` tool exists but the workspace has 0 credits. No other image API key is configured. Don't assume this is fixed unless told.

## What's built (as of commit `d52f37c`)
- **Homepage (`/`)** — fully built: 3D-kart hero with search bar, trust ledger, category nav; "Two tracks, one account" section with 4 horizontal scroll-snap rails (geo+intent headlines like "Backhoe and excavator rental near Chennai"); booking-spine explainer; host CTA; footer with a data-derived SEO long-tail link section (only city×category pairs that have real inventory).
- **`/search`** — a working but minimal results page (filters by category/track/city/query against the demo dataset). Not the full spec'd search (no map/list toggle, no price/CC filters yet).
- **Demo inventory:** 22 vehicles across 5 cities (Chennai, Madurai, Bengaluru, Coimbatore, Hyderabad) in `src/lib/vehicles.ts`, including `RAILS` (the 4 homepage rail definitions) and `LICENCE_LABEL`.
- **Nav/footer/favicon** all use the real go-kart badge logo (`public/logo.png`) — even at 16-32px where the wordmark isn't legible; that was an explicit user choice overriding an earlier "use a simplified seal at small sizes" decision.
- Full design-review pass done: `taste-skill` and `soft-skill` findings applied (em-dashes removed from visible copy, hero subtext trimmed to fit its word cap, `backdrop-blur` removed from scrolling containers). `review-animations` could NOT be run — it's locked to explicit user invocation via `/review-animations`, not available through the Skill tool.

## Known open issues / things to check
1. **JCB 3DX Super spec (92 hp) looks possibly wrong** — I flagged this but couldn't verify externally. Worth confirming against the real spec sheet before it's investor-facing.
2. **The "Backhoe and excavator rental near Chennai" rail is fully locked** at the current demo trust score (62 vs. a 75-point unlock threshold) — all 4 cards show dimmed/locked. Intentional per the trust-gating model, but it's a whole rail of greyed-out cards; may want to either accept this or raise the demo score.
3. **`/vehicle/[slug]` doesn't exist yet.** Several "revisit when this page exists" notes are in CLAUDE.md (trust score's one-time-loud placement, etc).
4. Full `/search` (map/list toggle, price/CC range filters) not built.
5. The repo is currently **public** on GitHub (needed for Render to deploy it without a GitHub App authorization step). Ask before flipping it back to private if that matters.

## How I've been verifying work
Always run `npx tsc --noEmit`, `npx eslint .`, and `npm run build` after changes — all must be clean. Test in-browser via Playwright MCP at both 1440px and 390px (mobile) before considering something done; take real screenshots, don't just trust the code. Check actual computed values (e.g. measured font rendering with canvas width comparisons) rather than assuming — I was wrong to assume a font was falling back once, and checking caught it. When something in a request depends on a tool/capability, verify it actually exists/works before saying so (e.g. discovering image-gen was blocked by 0 credits, not by absence of the tool).

## Attribution
Git commits end with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` (or Opus 5 if that model made the commit) — check current session instructions for which model attribution applies right now.
