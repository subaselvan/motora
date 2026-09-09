# MOTORA — Project Context for Claude Code

Multi-category vehicle rental platform (bikes, scooters, cars, EVs, trucks, JCBs, tractors) for the Indian market. Dual-sided marketplace: renters book vehicles hourly/daily; owners list vehicles to earn income.

## Working protocol (read this first)
- Step-by-step, confirm-before-major-move. Do not scaffold large chunks of the app unimplemented or make architectural decisions silently — check in before each major step (new major route group, new data model, new integration).
- Do not generate prompts for external tools unless directly asked.
- Model guidance if this repo is ever used with model selection: Sonnet-class models at medium effort for UI/code/copy; reserve high-effort/Opus-class reasoning for genuine architecture tradeoffs, not routine implementation.

## Tech stack (locked)
- Framework: Next.js (App Router)
- Styling: Tailwind CSS + shadcn/ui (own the component code, don't just install a black-box library)
- Language: TypeScript throughout
- Database: PostgreSQL (Supabase or Neon) + Drizzle or Prisma
- Auth: NextAuth.js — Google OAuth + Phone OTP
- Payments: Razorpay (India-focused, UPI support)
- Maps/location: Google Maps API or Mapbox
- State: Zustand + React Query
- Search: Algolia or Meilisearch (post-MVP; start with DB queries)
- Deploy: Vercel (frontend) + Railway/Render (backend services)
- Testing: Playwright (e2e) + Vitest (unit)
- Error monitoring: Sentry

## Brand identity (locked)
- Brand name: MOTORA
- Logo: red/yellow/black circular go-kart badge — logo-only colors, RED (#DC2626) and YELLOW (#FACC15) must NEVER appear in UI tokens/components. Logo is a separate asset system from the UI palette.
- Current logo status: hero/detail illustration is finalized and good. Small-format seal (favicon/nav/app-icon, must read at 16px) is still unresolved — use a temporary simple placeholder (e.g. stylized "M") until replaced.
- Brand voice: direct, mechanical, motion-oriented; trustworthy for safety; energetic for adventure/touring; professional for commercial rentals.

## Design tokens (locked)

**Colors**
```
--color-obsidian: #0A0A0F        /* primary background, nav, footer */
--color-obsidian-light: #14141B  /* card backgrounds, elevated surfaces */
--color-obsidian-lighter: #1E1E2A /* hover states, active nav */
--color-lime: #CCFF00            /* brand accents, highlights, badges */
--color-lime-dark: #B3E600
--color-orange: #FF6B00          /* primary buttons, links, focus rings */
--color-orange-hover: #E66000
--color-orange-active: #CC5500
--color-pearl: #F5F0E8           /* primary text on dark */
--color-pearl-dim: #C4BFB6
--color-pearl-muted: #8A8580
--color-success: #22C55E
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #3B82F6
```

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

**Radius**: sm 4px (buttons/inputs/badges) · md 8px (cards/modals) · lg 12px (feature cards/images) · xl 16px (hero containers) · full 9999px (pills/avatars)

**Elevation** (dark theme): shadow-1 through shadow-4, increasingly deep black shadows; shadow-glow uses lime at 15% opacity for accent/focus.

**Grid**: 12-column, 24px gutter desktop / 16px mobile. Breakpoints sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536.

**Components** (from locked spec):
- Buttons: primary = orange bg / obsidian text; secondary = transparent / orange text / orange border; ghost = transparent / pearl text; lime variant = lime bg / obsidian text. Sizes sm(32) md(40) lg(48) xl(56). Radius sm.
- Inputs: default border obsidian-lighter; focus border orange + 2px orange focus ring, offset 2px; error border error-red.
- Cards: surface bg, radius-md, 1px obsidian-lighter border, hover = translateY(-2px) + shadow-3.

## Information architecture (locked sitemap)
```
/ (homepage) — search-first hero, categories, how-it-works, trust bar, featured vehicles, host CTA
/search — filters (brand/model/CC/category/price/location), results, map/list toggle
/vehicle/:id — gallery, specs, pricing, owner info, availability calendar, reviews, GPS preview, Book Now
/booking/:vehicleId — dates+delivery → KYC → payment → confirmation
/dashboard (auth'd renter) — rentals, track, extend, points, fines, messages, profile
/host — onboarding, vehicles, earnings, bookings, damage-reports, settings
/host-landing — marketing page for owners
/about /faq /terms /privacy /contact /help
```
Primary CTA is "Book Now" everywhere it's relevant. Full per-page CTA map and homepage section order are in the discovery report if needed.

## Critical structural decision — read before building booking/rental flows
The rental flow MUST split into two tracks, not one:
1. **Self-drive** (bikes/scooters/cars/EVs) — the KYC-gated, app-only flow as originally specced.
2. **Operator-assisted** (JCB/tractors/trucks) — different booking UX (may need phone-first fallback), different insurance class, vehicle comes with an operator, not self-drive.
Do not build a single unified booking flow assuming self-drive for all categories — this was a specification gap caught during discovery.

## Sequencing decision
Launch categories sequentially, not all at once: bikes/scooters + cars/EVs first (1-2 cities), prove out GPS tracking, points system, and trust mechanics, THEN layer in commercial/heavy-machinery vertical. Do not scaffold all 7 vehicle categories as equally-weighted from day one.

## Points/credit system (differentiator — keep it real, not decorative)
Trust/reputation system: late returns, damage, poor communication reduce points; low points restrict access to high-CC/premium vehicles. Exact point values are still open (see Open Items) — build the mechanism generically (a scoring field + event log), don't hardcode point values that haven't been decided.

## Open items — NOT yet decided, use placeholder/mock data, do not hardcode as final
- Exact pricing/deposit amounts per category
- Late fee amount per 10-minute increment
- Points system starting value, deduction amounts, restoration rate
- Payment gateway final pick (Razorpay assumed, not confirmed)
- Fleet vs. P2P vehicle mix ratio
- Insurance provider/partnership
- KYC verification flow: automated API vs manual review
- CMS choice for vehicle listings/content
- Launch cities
- Owner commission percentage
- Support channels (chat/call/email/in-app)
- Promo/referral system

## Competitive context (why some of the above decisions matter)
- Zoomcar: India's largest P2P self-drive car marketplace, expanding into motorcycles/scooters as of mid-2026 — directly encroaching on MOTORA's multi-category territory. Uses AI model-selector + real-time GPS/tariff comparison.
- Royal Brothers: RTO-licensed bike rental, 14 states/43 cities, OEM partnerships — their moat is city-by-city licensing built over a decade, not something replicated at launch.
- Trringo (Mahindra): closest precedent for JCB/tractor rental — operator-assisted, phone-first booking for a rural, less app-native audience. Confirms the two-track flow decision above.
