# Decisions

What was decided, when, and why. A decision recorded here is settled: reopen
it on purpose, not by accident. Newest first within each section.

- [Product and structure](#product-and-structure)
- [Search and rental mechanics](#search-and-rental-mechanics)
- [Design and brand](#design-and-brand)
- [Engineering](#engineering)
- [Removed or rejected on purpose](#removed-or-rejected-on-purpose)
- [Research basis](#research-basis)
- [References studied](#references-studied)

---

## Product and structure

**Two tracks, one account** (2026-09-12). *Ride & Drive* (bikes, scooters,
cars, EVs) is always self-drive, with MOTORA presented as the operator of
record, like Zoomcar and Revv. *Heavy & Farm* (trucks, JCBs, tractors) is
self-drive **or** with an operator, chosen by the renter **at booking**, not
fixed per listing, like Trringo. So every heavy listing carries both rates, and
both are shown before booking starts.

**Licence gating by category** (2026-09-12), the Yulu pattern: two-wheeler
licence for bikes and scooters, LMV for cars and EVs, commercial to
self-drive heavy machinery. Operator bookings bypass the renter's licence
because MOTORA supplies the driver. Requirements are stated in plain copy on
the track and on each card, not only at the booking gate (United Rentals
pattern).

**One trust record across categories** (2026-09-12). Late returns, damage
and poor communication lower it; a clean history unlocks bigger machines.
The mechanism is final; point values are an open policy item and are not
hard-coded.

**This is an investor demo, not a live service** (2026-09-12). Everything
must look and work like a finished product, but nothing touches real systems:
payments will only ever run in a gateway's test mode, and any checkout
carries a visible "Demo, no payment processed" banner. Legal pages are
placeholders.

**Build order** (2026-09-12): homepage to investor standard first, then
search, then vehicle, then booking. Breadth across the renter journey before
depth in any one category.

## Search and rental mechanics

Decided 2026-09-22 after studying Zoomcar, Royal Brothers, Cars24, OLX and
BikeWale:

- **Search is where + when first; browsing without dates still works.** Rental
  search is availability in a time window, not shopping. Without dates, results
  show day rates; with dates, only vehicles free in the window, priced as a trip.
- **Four durations**: hourly (Ride & Drive), daily (all), weekly rate from 7
  days, and 8-hour shifts for Heavy & Farm (how contractors hire a JCB).
- **Delivery**: Ride & Drive is hub pick-up or paid doorstep delivery. Heavy &
  Farm is **always delivered to site**, since nobody collects a backhoe, with
  the transport fee shown upfront.
- **Kilometre plans** for Ride & Drive: a limited plan with the per-km excess
  shown upfront, or unlimited.
- **The cheapest billing always wins**: the system picks whichever of hourly,
  daily, weekly or shift costs the renter least.
- **Booking inherits search**: the dates travel with every link; booking never
  asks for them again.
- **Filters live in the URL** (2026-09-21): shareable, crawlable,
  server-rendered.

## Design and brand

**The hero's subject is the trust record** (2026-09-18). No competitor leads
with a data object, and unlike a photo it looks finished without
photography, which MOTORA doesn't have. The ring is lit by a volumetric
light field; **lime is a light source, never a decorative wash**.

**The light follows the ring** (2026-09-22). It was pinned to a screen
position, which was right on desktop and wrong on tablets, where the ring
drops below the copy. It is now measured from the ring, on the side facing
away from the text.

**Glass lighting, in our own palette** (2026-09-22). From the Lime Glass
Waves reference we took the lighting (highlights riding the crests, dark
bodies with bright edges), not the image.

**Smooth scroll and word-by-word headline reveal** (2026-09-21): Lenis was
used by all five motion references studied, and word masks by three of them.

**Porsche Design System motion scale** (2026-09-20): 250/400/600/1200ms on one
curve, replacing an arbitrary 180/240ms pair.

**One shadow tier** (2026-09-14), the Airbnb pattern. Depth comes from surface
tone, not stacked shadows.

**Trust score loud once, quiet elsewhere** (2026-09-14). The homepage ring is
the one loud moment, labelled a *sample* record. Cards never show a score, only
"Unlocks at N trust" when locked.

**Homepage rails headed by place and intent** (2026-09-14), for example
"Backhoe and excavator rental near Chennai". Each is the seed of a future
city landing page. The footer's city × category links are derived from
inventory, so none leads to an empty page.

**The real badge logo in the navbar and favicon** (2026-09-13), your call
over a simplified small-size mark. Recoloured onto the palette on 2026-09-20.

**Dark only** (2026-09-12). **No stock photography, and no
"gradient hero + three feature cards" template**, ever.

## Engineering

- **ogl, not three.js**, for the WebGL background (about 30 KB versus 600 KB).
  The page is demoed live, so load time is a hard requirement.
- **Pure domain layer** in `src/lib`, taking inventory as an argument: the
  database swap replaces function bodies, not pages.
- **Wall-clock trip times as strings**, never parsed through a timezone.
- **Native controls where the platform is better**: `<details>` for the mobile
  filter panel, `<select>` for time slots and city, a date input for dates.
- **Contrast is measured per element over the live WebGL frame**, worst of
  several frames, and regressions are A/B'd against the previous commit
  using the same method.
- **Explicit `grid-cols-1`** on any grid whose children can overflow.

## Removed or rejected on purpose

Listed so nobody recreates them by accident.

| Item | Why it's gone |
|---|---|
| A ~3s intro "gate" in the style of boc.studio | Fine for a studio portfolio; a conversion cost on a marketplace where people arrive to search |
| Lime Glass Waves (getlayers.ai) as the background | Full-frame yellow wash: no text colour works over it; its yellow is the logo's hue, not our lime; paid asset |
| Floating mechanical-parts background | Tried; the owner preferred the wave field |
| three.js 3D kart hero | Page weight |
| Five-level shadow ladder | Replaced the same day by one tier |
| `success` / `warning` / `info` colour tokens | Never used; removed so no off-brand hue invites use |
| A stats bar of big numbers | Replaced by prose computed from the real inventory |
| **Fabricated social proof** (testimonials, press logos, user counts) | Would damage an investor demo the moment it was spotted. Added only when real |
| **Invented policy numbers** (deposit, late fee, point values) | Open decisions; the UI names these fees without pricing them |
| `drivekyte.com` as a reference | The domain has been hijacked and redirects to a gambling site; never link it |
| Independent per-day demo availability | Made long trips near-impossible (1 of 22 free for 9 days); replaced by booking blocks |
| `datetime-local` for trip times | Can't restrict to hub hours or half-hour slots |
| A custom mobile filter drawer | `<details>` gives focus handling, Escape and no-JS behaviour for free |
| Light mode | Dark-only is a brand decision |

## Research basis

A ten-platform teardown (Turo, Zoomcar, Getaround, Revv, Royal Brothers,
Yulu, Bounce, Trringo, United Rentals, Hertz) found the same failures
repeatedly. Each maps to a product rule:

| Failure pattern | MOTORA rule |
|---|---|
| Damage and deposit disputes | Mandatory timestamped photo check-in and check-out |
| Chatbot-only support during a rental | A guaranteed path to a live person |
| Equipment faults billed to the renter | Fees tied to a flagged fault are waived automatically |
| Vehicle swapped without consent | No-substitution rule, or guaranteed compensation |
| Fees revealed at checkout | Every conditional fee shown upfront |
| Automated damage/fraud decisions (Hertz's AI scanner) | A human-review gate before any such decision is binding |

Patterns adopted: one-time licence approval reused everywhere (Turo);
photo check-in feeding a trust score (Getaround); tiered licence gating
(Yulu); spec-first cards for heavy equipment (United Rentals);
operator-included mode and phone access for rural renters (Trringo);
licence and registration badges as trust signals (Royal Brothers).

## References studied

- **Rental domain**: Zoomcar (city → trip window → pick-up area; durations; delivery options; km plans),
  Royal Brothers (city first; half-hour slots in hub hours), Turo, Getaround, Yulu, Trringo, United Rentals.
- **Search and selection**: Cars24 (grouped facets with counts, budget range, seller type),
  OLX (recent searches, category-scoped suggestions), BikeWale (brand and budget browsing).
- **Motion and craft**: boc.studio, noho.ink, Aspen Search (type motion), Warm & Fuzzy,
  United Carriers APAC. Taken: Lenis smooth scroll, masked word reveal. Not taken:
  intro gates, character-level splitting.
- **Design language**: Igloo (colour restraint), Revolut and CRED (data depth;
  CRED's "locked as aspirational"), Porsche (editorial grid, motion scale),
  Stripe (ambient mesh hero), Airbnb (single elevation tier, category bar).
