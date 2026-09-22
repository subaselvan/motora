# MOTORA — Project Context for Claude Code

> **Read first (added 2026-09-22):** the current, verified state of the project
> lives in `AGENTS.md` (rules and traps for any AI assistant) and `docs/`
> (architecture, algorithms, design system, decisions, roadmap). The product,
> brand and structural decisions below still hold; where this file's token
> values differ, `src/app/globals.css` and `docs/DESIGN-SYSTEM.md` are current.
> The working briefs this file refers to moved to the private
> `motora-playbook` repository.

Multi-category vehicle rental platform (bikes, scooters, cars, EVs, trucks, JCBs, tractors) for the Indian market. Dual-sided marketplace: renters book vehicles hourly/daily; owners list vehicles to earn income.

## Working protocol (read this first)
- Step-by-step, confirm-before-major-move. Do not scaffold large chunks of the app unimplemented or make architectural decisions silently — check in before each major step (new major route group, new data model, new integration).
- Do not generate prompts for external tools unless directly asked.
- Model guidance if this repo is ever used with model selection: Sonnet-class models at medium effort for UI/code/copy; reserve high-effort/Opus-class reasoning for genuine architecture tradeoffs, not routine implementation. For visual/design work specifically, Opus at *medium* effort — high effort tends to overcomplicate UI.
- Before hand-writing something from scratch, check whether an available skill, MCP connector, or plugin fits the task (design/UI-generation skills, Figma connector, testing/deploy connectors). Say so if a missing one would have helped.

## Reference docs
- In this repo: `docs/DECISIONS.md` (decisions, research basis, references studied), `docs/DESIGN-SYSTEM.md` (implemented tokens), `docs/ALGORITHMS.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`.
- In the private `motora-playbook` repo (moved there 2026-09-22): `briefs/RESEARCH_BRIEF.md` (10-platform teardown), `briefs/BUILD_PROMPT.md` (original kickoff), `design/DESIGN_SYSTEM.md` + `design/design-tokens.json` (the early design direction), `research/DESIGN_INSPIRATION_SCAN.md` (Turo/Zoomcar/United Rentals/Airbnb/CRED teardown), and the source research PDFs.
- Note: those briefs describe themselves as direction rather than a locked spec. Where they conflict with this file or `docs/DECISIONS.md`, the decision recorded here is the one that was actually made.

## Tech stack (locked)
- Framework: Next.js (App Router)
- Styling: Tailwind CSS + shadcn/ui (own the component code, don't just install a black-box library)
- Language: TypeScript throughout
- Database: PostgreSQL (Supabase or Neon) + Drizzle or Prisma
- Auth: NextAuth.js — Google OAuth + Phone OTP
- Payments: Razorpay (India-focused, UPI support) — demo/test mode only, never live processing
- Maps/location: Google Maps API or Mapbox
- State: Zustand + React Query
- Search: Algolia or Meilisearch (post-MVP; start with DB queries)
- Deploy: Vercel (frontend) + Railway/Render (backend services)
- Testing: Playwright (e2e) + Vitest (unit)
- Error monitoring: Sentry

## Brand identity (locked)
- Brand name: MOTORA
- Logo: red/yellow/black circular go-kart badge — logo-only colors, RED (#D8050A) and YELLOW (#FCCF00), sampled from the delivered asset — must NEVER appear in UI tokens/components. Logo is a separate asset system from the UI palette.
- Current logo status: received 2026-09-13 as `C:\Users\subas\Desktop\go kart logo _ website.png`, matted to a transparent PNG at `public/logo.png` (1024px source, cropped to the circle). Tested at 16/32/64px on the site background: the wordmark and fine linework are illegible below ~48px, but the user asked for it in the nav and favicon anyway (**decided 2026-09-13, overriding that same day's earlier "simplified seal for small sizes" call**) — at 32px/16px it reads as a recognisable red/yellow circular mark, which was judged good enough. The nav's geometric placeholder was removed; `src/app/favicon.ico` was regenerated from the badge (16/32/48/64px). Revisit if a dedicated small-format seal is ever made.
- Brand voice: direct, mechanical, motion-oriented; trustworthy for safety; energetic for adventure/touring; professional for commercial rentals.

## Design tokens

Source of truth is `src/app/globals.css`. `DESIGN_SYSTEM.md` + `design-tokens.json` (both in repo root) are the design-side direction; treat their exact numbers as sensible defaults, not mandates.

**Colors** — lime carries the functional load (CTA/price/success/trust), orange is secondary (badges/urgency/outline CTAs).
```
--color-obsidian: #0B0B0D         /* primary background, nav, footer */
--color-obsidian-light: #141417   /* card surfaces */
--color-obsidian-lighter: #1D1D21 /* inputs, raised surfaces, hover */
--color-lime: #C6FF3D             /* PRIMARY CTA, price, success, trust score */
--color-lime-dark: #B2EE22        /* primary hover */
--color-lime-active: #9FD916
--color-lime-ink: #0B0B0D         /* text on lime fills */
--color-orange: #FF7A1A           /* badges, urgency, secondary/outline CTA */
--color-orange-hover: #E66A0D
--color-orange-active: #CC5A06
--color-pearl: #F4F1E8            /* primary text on dark */
--color-pearl-dim: #B8B3A8        /* secondary text */
--color-pearl-muted: #8A857C      /* tertiary text, placeholders */
--color-charcoal-1: #2A2A2E       /* borders/dividers — not text */
--color-charcoal-2: #3C3C41
--color-charcoal-3: #54545A
--color-success: #22C55E
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #3B82F6
```

**Mode**: dark-only. Confirmed 2026-09-12 — no light-mode toggle, do not build one.

**Typography** — Headlines: Space Grotesk, system-ui, sans-serif. Body: Inter, system-ui, sans-serif.
```
text-xs   12px/16px  400 Inter          — captions, badges
text-sm   14px/20px  400 Inter          — secondary text, labels
text-base 16px/24px  400 Inter          — body text
text-lg   20px/28px  500 Inter          — lead text, card titles
text-xl   25px/32px  600 Space Grotesk  — subheadings
text-2xl  31px/36px  700 Space Grotesk  — section headings
text-3xl  39px/44px  700 Space Grotesk  — page titles
text-4xl  49px/52px  700 Space Grotesk  — hero headlines
text-5xl  61px/64px  800 Space Grotesk  — display text
```

**Spacing** (8px base): space-1..10 = 4,8,12,16,24,32,48,64,96,128px

**Radius**: sm 6px (buttons/inputs/badges) · md 10px (cards) · lg 16px (modals/hero panels) · xl 20px (large hero containers) · full 9999px (pills/avatars)

**Motion**: `cubic-bezier(.4,0,.2,1)`, 180ms (fast) / 240ms (base). Tokens `--ease-standard`, `--duration-fast`, `--duration-base`. `prefers-reduced-motion` is already handled globally in globals.css.

**Elevation**: ONE shared shadow tier (`--elev`), decided 2026-09-14 from `docs/research/DESIGN_INSPIRATION_SCAN.md` (Airbnb pattern). History, so nobody reverts by accident: 2026-09-12 shipped no shadows at all; earlier on 2026-09-14 a five-level ladder (`--elev-0..4`) was built on request; later the same day the user chose the scan's single tier instead. Cards, the trust ledger and the search bar all share `--elev`. `--elev-sunken` is an inset for inputs and wells: a recess, not an elevation tier. Depth differences come from surface tone (`obsidian-sunken` → `obsidian` → `obsidian-light` → `obsidian-lighter`) and border strength, never from stacking shadow weights.

**Grid**: 12-column, 24px gutter desktop / 16px mobile. Breakpoints sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536.

**Components**:
- Buttons: primary = lime fill / obsidian text; secondary = transparent / orange text / orange border; ghost = transparent / pearl text. Sizes sm(32) md(40) lg(48) xl(56). Radius sm. There is no separate `lime` variant — primary *is* lime.
- Inputs: obsidian-sunken fill with the `--elev-sunken` inset (they recede below the page), charcoal-2 border; focus = lime border + 2px lime ring, offset 2px; error border error-red.
- Cards: surface bg, radius-md, 1px border, flat at rest; hover = translateY(-2px) + the single `--elev` shadow.
- Focus rings are lime everywhere.

## Information architecture (locked sitemap)
```
/ (homepage) — hero (search, guarantee strip, 3D kart, trust ledger, category rail) → two tracks with geo+intent rails → booking spine → host CTA → footer with long-tail city links  [BUILT]
/search — filters (brand/model/CC/category/price/location), results, map/list toggle
/vehicle/:id — gallery, specs, pricing, owner info, availability calendar, reviews, GPS preview, required license, (Heavy & Farm) both self-drive and operator-included rates, Book Now
/booking/:vehicleId — dates+delivery → (Heavy & Farm) self-drive vs operator-included mode select → license & KYC verification → photo check-in → itemised fees → mock payment → confirmation
/dashboard (auth'd renter) — rentals, track, extend, points, fines, messages, profile
/host — onboarding, vehicles, earnings, bookings, damage-reports, settings
/host-landing — marketing page for owners
/about /faq /terms /privacy /contact /help
```
Primary CTA is "Book Now" everywhere it's relevant. Full per-page CTA map and homepage section order are in the discovery report if needed.

## Critical structural decision — read before building booking/rental flows
**Confirmed 2026-09-12.** Two tracks share one account and one trust/points system:

1. **Ride & Drive** — bikes, scooters, cars, EVs. MOTORA presents as the licensed operator of record (Zoomcar/Revv pattern), not a pure P2P marketplace. Always self-drive.
2. **Heavy & Farm** — trucks, JCBs/excavators, tractors. Supports **both** self-drive and operator-included, chosen by the renter as a **live toggle at booking time** (not a fixed per-listing property).

Because it is a booking-time toggle, every Heavy & Farm listing needs both modes priced and available: a self-drive rate and an operator-included rate, plus separate availability. Surface both rates on the vehicle detail page before the user starts booking.

License gating is tiered by category (Yulu pattern): none/low-speed EV → standard DL → commercial for heavy self-drive. Every vehicle carries a `requiredLicense` field; operator-included bookings bypass the renter's own license requirement since MOTORA supplies the operator.

Supersedes the previous "one flow, all self-drive" entry (commit 1b5decf), which itself superseded the original two-track split. Net effect: the two-track model is back, with the operator decision moved to booking time.

## Homepage patterns (decided 2026-09-14, from the design scan)
- **Trust-score volume:** quiet everywhere, loud exactly once. The one loud moment is the homepage trust ledger (labelled a *sample* record). Cards never show a score, only "Unlocks at N trust" when locked. When `/vehicle/[slug]` is built, decide whether the loud moment moves there; until then the homepage keeps it, because moving it now would leave the site with no trust moment at all.
- **Geo + intent rails:** homepage inventory is horizontal scroll-snap rails headed `[qualifier] + rental + in/near + [place]` (e.g. "Backhoe and excavator rental near Chennai"), defined in `RAILS` in `src/lib/vehicles.ts`. Each is the seed of a future geo landing page. No carousel library.
- **Badges on the visual:** trust and verification badges sit on the card's visual plate, top-left, not in a metadata line. Heavy & Farm cards have no plate by the locked dual-card design, so their badges stay in the body; that is intentional.
- **Licence disclosure in page copy:** licence-class requirements are stated as plain copy on the track and on the card, not only at the booking gate (United Rentals CDL pattern). Use only the classes in PRODUCT.md: none, two-wheeler, LMV, commercial.
- **Price with multi-day total:** Ride & Drive cards show the 3-day total beside the daily rate (Turo pattern).
- **SEO long-tail footer:** a plain, walled-off city × category link section below the brand footer, **derived from inventory**, so no link lands on an empty results page.
- **Deferred:** the CRED-style ceremonial confirmation belongs on photo check-in completion, which doesn't exist yet. Keep search, filtering and browsing fast and unanimated.

## Booking flow spine
One-time tiered license/KYC approval, reused across all categories → (Heavy & Farm only) self-drive vs operator-included mode select → timestamped photo check-in/check-out feeding the trust score → all fees itemised upfront, no checkout surprises → guaranteed live-human escalation path during an active rental.

Design against these cross-platform failure patterns (from `RESEARCH_BRIEF.md`): damage/deposit disputes (photo check-in is mandatory, never optional), chatbot-only support during active rentals, equipment failure billed to the renter (auto-waive fees tied to a flagged fault), vehicle substitution without consent, hidden fees revealed at checkout, and any automated fraud/damage decision becoming binding without a human-review gate.

## Project nature — read before proposing "production" work
This is a portfolio/demo build, not a live transactional product. Every section should look and behave like a real, complete product, but nothing connects to live real-world systems:
- Payment UI (card/debit/UPI) is built and functional-looking, but not wired to a real gateway. Any checkout must carry a visible "Demo — no real payment processed" banner and must never accept a real card number as if it were live. Use test/sandbox mode if a gateway is ever wired in.
- Legal/compliance pages (terms, privacy) are placeholder pages, not real legal work.
- Launch scope is all-India, not a phased single city — there is no real fleet or RTO constraint to respect in a demo. If the project later attracts investment, these become real work items. Until then, do not block progress on real-world compliance, licensing, or payment-processor onboarding.

## Sequencing decision
Build breadth across the core renter journey first (home → search → vehicle → booking), rather than depth on any single vertical. All 7 categories appear in the UI from the start.

**Current build order (set 2026-09-12)**: homepage is being lifted to investor-demo standard *first*, before /search. This is an investor-facing demo and the landing page is what gets shown live, so it earns the extra pass. Then search → vehicle → booking.

Superseded: an earlier decision called for a phased category launch (bikes/cars/EVs first in 1-2 cities, heavy machinery later). That was premised on a real-world rollout; it does not apply to this demo build.

## Landing page bar (investor demo)
The homepage must not read as a template. Explicitly ruled out: stock photography, and the default "gradient hero + three feature cards" layout. Wanted: high-quality 3D-style rendered hero visuals (fully interactive WebGL is not required — a small lightweight interactive accent is fine), with load performance treated as a hard requirement because the page is demoed live in front of investors.

Dual card templates, per `DESIGN_SYSTEM.md`:
| | Ride & Drive (bikes/cars/EVs) | Heavy & Farm (JCB/tractors/trucks) |
|---|---|---|
| Emphasis | Lifestyle visual, model name, rating | Capacity/reach/power specs first |
| Price | ₹/day, prominent | ₹/day or ₹/month, secondary to specs |
| Trust signal | Verified badge + trust score | Operator-included / self-drive tag + RTO status |

## Points/credit system (differentiator — keep it real, not decorative)
Trust/reputation system: late returns, damage, poor communication reduce points; low points restrict access to high-CC/premium vehicles. Exact point values are still open (see Open Items) — build the mechanism generically (a scoring field + event log), don't hardcode point values that haven't been decided.

## Open items — NOT yet decided, use placeholder/mock data, do not hardcode as final
- Exact pricing/deposit amounts per category
- Late fee amount per 10-minute increment
- Points system starting value, deduction amounts, restoration rate
- Fleet vs. P2P vehicle mix ratio
- KYC verification flow: automated API vs manual review (demo uses a mock verification step)
- CMS choice for vehicle listings/content
- Owner commission percentage
- Support channels (chat/call/email/in-app)
- Promo/referral system
- Small-format logo seal (favicon/nav/app-icon, must read at 16px) — the full badge is in use there now per the user's call, but a purpose-made simplified mark would read better; optional future polish, not blocking.

## Queued work — comprehensive India vehicle dataset (deferred, not started)
Build a comprehensive mock dataset of vehicles available in the Indian market, structured category → brand → model → CC/variant, covering bikes, scooters, cars, EVs, trucks, JCBs and tractors. This replaces the small placeholder array once built. Explicitly deferred until the core page builds are further along — do not start it unprompted.

## Competitive context (why some of the above decisions matter)
- Zoomcar: India's largest P2P self-drive car marketplace, expanding into motorcycles/scooters as of mid-2026 — directly encroaching on MOTORA's multi-category territory. Uses AI model-selector + real-time GPS/tariff comparison.
- Royal Brothers: RTO-licensed bike rental, 14 states/43 cities, OEM partnerships — their moat is city-by-city licensing built over a decade, not something replicated at launch.
- Trringo (Mahindra): closest precedent for JCB/tractor rental — operator-assisted, phone-first booking for a rural, less app-native audience. Basis for the operator-included mode in the Heavy & Farm track, and a reminder not to force app-only access on that audience.
