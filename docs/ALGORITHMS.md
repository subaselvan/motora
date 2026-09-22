# Algorithms

Every non-trivial algorithm in MOTORA: what it does, the exact rule, and why
it is that way. Constants are the values in the code. Algorithms still to be
built are in the [Roadmap](ROADMAP.md#algorithms-still-to-build).

| # | Algorithm | Code |
|---|---|---|
| 1 | Search query model (URL ⇄ query) | `src/lib/search.ts` |
| 2 | Facet counts that exclude their own clause | `src/lib/search.ts` → `matches`, `computeFacets` |
| 3 | Ranking and sort | `src/lib/search.ts` → `compare` |
| 4 | Logarithmic price scale | `src/lib/search.ts` → `priceToSlider`, `sliderToPrice` |
| 5 | Trip windows in India time | `src/lib/rental.ts` |
| 6 | Availability (demo calendar) | `src/lib/rental.ts` → `isBookedOn`, `isAvailable` |
| 7 | Trip pricing: the cheapest valid billing | `src/lib/rental.ts` → `quoteTrip` |
| 8 | Type-ahead: ranking and Indian synonyms | `src/lib/suggest.ts` |
| 9 | Contrast measurement | method, run in the browser |
| 10 | Lighting shader | `src/components/ui/ambient-field.tsx` |
| 11 | Shortlist store | `src/lib/store/saved-store.ts` |
| 12 | Trust gating | `src/lib/vehicles.ts`, `src/lib/search.ts` |
| 13 | Input debouncing without feedback loops | `src/components/search/filter-bar.tsx` |

---

## 1. Search query model

The URL is the single source of truth for a search. `parseSearchQuery`
turns raw params into a validated `SearchQuery`; `serializeSearchQuery`
turns it back.

- **Whitelists, not trust.** `category`, `track`, `licence` and `sort` are
  accepted only if they are known values; anything else becomes "no filter".
- **Numbers are sanitised.** Price bounds must be finite and ≥ 0, rounded to
  whole rupees. `?min=9000&max=500` is **swapped**, not rejected: it is someone
  who dragged the two thumbs past each other.
- **Only non-defaults are written back**, so a cleared filter leaves no trace
  and `/search` stays the one canonical unfiltered address.
- **A trip window is both ends or neither**: half a window is not a search.

## 2. Facet counts that exclude their own clause

Each filter option shows how many results choosing it would give ("Bikes 3").
The naive way (count with every filter applied) only ever counts the
current selection: with "Bikes" chosen, "Cars" would always say 0.

`matches(vehicle, query, trustScore, skip)` applies every clause **except**
the one named by `skip`. Counting categories therefore uses
`skip = "category"`, tracks use `skip = "track"`, and cities use
`skip = "city"`. This is the standard *disjunctive faceting* technique used
by e-commerce search engines.

An option with a count of 0 is shown **disabled rather than hidden**, so the
row never reflows under the pointer, and "Tractors 0" is itself a real answer.

## 3. Ranking and sort

| Sort | Rule |
|---|---|
| Recommended | `rating × log₁₀(trips + 10)`, descending |
| Price ↑ / ↓ | By **trip total** when a trip window is set, otherwise by day rate |
| Highest rated | Rating, then trips as the tie-break |
| Most booked | Trips |

*Why weight rating by log of trips:* a 5.0 with two trips should not outrank
a 4.8 with three hundred. `log₁₀(trips + 10)` rewards evidence with
diminishing returns, so volume can't swamp quality. The `+ 10` keeps a brand-new
listing from scoring zero.

*Why trip total for price:* once hourly billing exists, a scooter billed by the
hour and a car billed by the day don't sort correctly by their day rates.

## 4. Logarithmic price scale

The fleet runs from ₹379 to ₹18,900 a day: a scooter and a backhoe share one
list. On a linear slider the first 60% of travel would cover four vehicles.

```
floor   = ⌊min price / 50⌋ × 50     = ₹350
ceiling = ⌈max price / 100⌉ × 100   = ₹18,900

position(p) = (ln p − ln floor) / (ln ceiling − ln floor) × 100
price(x)    = exp(ln floor + x/100 × (ln ceiling − ln floor))
```

The inverse is rounded to a figure a person would say aloud: ₹50 steps
below ₹1,000, ₹100 steps below ₹5,000, ₹500 steps above. Thumbs within
0.5% of either end mean "unbounded" and write nothing to the URL.

*Measured:* 40% of the track reads **₹1,700**. A linear slider would read
₹7,770 at the same position.

The endpoints come from the **whole** inventory, not the filtered results. A
slider whose range moves under the thumb while you drag is unusable.

## 5. Trip windows in India time

A trip is `{ from, to }` as wall-clock strings: `"2026-09-24T10:00"`.

- **Never parsed with `new Date(string)`.** The server runs in UTC and
  renters are in India (UTC+5:30); parsing a local string through either
  machine's timezone shifts every pick-up by five and a half hours.
  `wallMinutes()` reads the string with `Date.UTC(...)` as if it were UTC.
  That is exact because both ends of a rental are in the same zone.
- **Impossible dates are rejected.** `Date.UTC` silently rolls 31 February
  into March, so the result is checked against the input's day and month.
- **Now in India** = current UTC minutes + 330.
- **Hand-over slots**: every 30 minutes from 08:00 to 21:30 (28 slots), the
  Royal Brothers pattern. Both ends of a trip must land on a slot.
- **Earliest pick-up** = now + 60 minutes of lead time, rounded up to the next
  half hour, then rolled forward to the next open slot (the next morning if
  the hub has closed).

Validation runs in this order and **names the problem** rather than dropping
the window: outside hub hours → in the past → drop-off not after pick-up →
longer than 90 days. A half-entered or garbled window is simply "no window"
(browsing without dates is supported), and the results page says why dates
weren't applied.

## 6. Availability (demo calendar)

> Demo only. With a database this becomes a range query against real
> bookings (see the [Roadmap](ROADMAP.md#algorithms-still-to-build)); the
> function signature stays.

A deterministic calendar, so every visitor sees the same vehicles booked on
the same days:

```
hash       = FNV-1a 32-bit
busyShare  = 0.12 + min(trips, 400) / 400 × 0.20        → 12% to 32%
blockDays  = 3 + hash(slug) mod 3                        → 3, 4 or 5 days
phase      = hash(slug + ":phase") mod blockDays
block(day) = ⌊(day + phase) / blockDays⌋
booked(day)= hash(slug + ":block:" + block(day)) mod 1000 < busyShare × 1000

available(window) ⇔ no calendar day the window touches is booked
```

*Why blocks, not independent days:* the first version flipped a coin per day.
Availability over *n* days then falls as (1 − p)ⁿ, which collapses: a 9-day
search found **1 of 22** vehicles free. Real calendars fill in runs of days,
which leaves runs free; with 3–5 day blocks the same search finds **9 of 22**.
Block length and phase vary per vehicle so the fleet doesn't all turn over
on the same day.

## 7. Trip pricing: the cheapest valid billing

`quoteTrip(vehicle, hours)` considers every billing mode that applies and
returns **the cheapest for the renter**. "No surprises at checkout" applies to
arithmetic too.

```
days = max(1, ⌈hours / 24⌉)

base:     if days ≥ 7 → weekly:  round₅(dayRate × 0.8) × days
          else        → daily:   dayRate × days

hourly:   Ride & Drive only, trips under 24 h
          billed = max(4, ⌈hours⌉);   rate = round₅(dayRate / 8)
          use if billed × rate < base

shift:    Heavy & Farm only, trips of 8 h or less
          rate = round₁₀(dayRate × 0.65)
          use if rate < base
```

Examples from the demo fleet:

| Vehicle (day rate) | Trip | Billing | Total |
|---|---|---|---|
| Suzuki Access 125 (₹419) | 6 hours | 6 h × ₹50 | **₹300** |
| Same | 10 hours | hourly ₹500 > day | **₹419** (1 day) |
| JCB 3DX Super (₹11,500) | 5 hours | 1 shift | **₹7,480** |
| Suzuki Access 125 (₹419) | 9 days | weekly ₹335/day | **₹3,015** |

Minimums are stated, not hidden: a 2-hour hourly trip carries the note
"Hourly trips bill a 4-hour minimum", and a 50-hour daily trip says it is
billed as 3 full days.

> **Provisional.** The ⅛ hourly share, 4-hour minimum, 20% weekly discount
> and 65% shift share are placeholders until pricing policy is decided. They
> live in one `PRICING` object, and every total built from them is labelled
> indicative in the UI.

## 8. Type-ahead: ranking and Indian synonyms

Modelled on Cars24, BikeWale and OLX: suggestions grouped by **what they
are**, each with a count.

**Synonyms.** `ALIASES` maps the words people actually type to what the
catalogue calls things. "scooty" → scooters, "bullet" → Royal Enfield,
"backhoe" / "excavator" / "jcb" → JCBs, "tempo" / "lorry" → trucks,
"Bangalore" / "blr" → Bengaluru, "Madras" → Chennai, "Kovai" → Coimbatore.
`expandQuery(q)` returns the query, the query with every aliased word
replaced, and each standalone alias target.

**The same expansion drives the results filter**, so a suggestion never
promises a match the results page then fails to find.

**Scoring** of a candidate against a term, highest tier wins:

| Score | Match |
|---|---|
| 4 | Exact |
| 3 | The whole candidate starts with the term |
| 2 | A word in the candidate starts with the term |
| 1 | Contained mid-word, only for terms of 3+ characters (two letters appear inside almost every name) |

Vehicles also match on "brand model" and engine size ("350"). Each group keeps
its top 4 (ties broken by trips booked), and **the group holding the strongest
match leads**: typing "chen" opens on Chennai, not on an empty-looking
Categories header.

**Empty box:** the renter's recent searches (up to 5, newest first, de-duplicated
case-insensitively) and then the most-booked vehicles. Recents are the renter's
own, so they come first.

**Interaction** follows the WAI-ARIA 1.2 combobox: focus stays in the input,
arrows move a highlight exposed through `aria-activedescendant`, Enter picks
the highlighted option (plain Enter still searches), Escape closes. A
category or city narrows the form, since the renter may still be picking dates;
a specific vehicle goes straight to its page with the dates carried along.

## 9. Contrast measurement

Text sits over an animated WebGL field, so contrast can't be judged by eye
or from one frame.

1. The canvas is created with `preserveDrawingBuffer`, so `gl.readPixels` can
   read the last frame.
2. For **each text element** in the hero (every headline word, the paragraph,
   each proof line), read every canvas pixel under its bounding box.
3. **Composite the legibility scrim** over each pixel, using the scrim model
   for the current layout (left-to-right from 1024px, attached to the copy
   column between 768 and 1023px).
4. Compute WCAG relative luminance, and contrast as `(L₁ + 0.05) / (L₂ + 0.05)`
   against the element's own text colour.
5. Repeat over 5–12 frames and keep the **worst** result.
6. For a regression, run the **identical** scan against the previous commit.
   A number is only comparable to one measured the same way.

Results that shaped the code:

| Case | Contrast (worst) |
|---|---|
| Glass highlights gated on the floored light term | 3.24:1 (rejected) |
| Previous shader, tablet (light pinned to desktop position) | **1.08:1** (bug, was live) |
| Shipped, desktop 1440px | 8.79:1 |
| Shipped, tablet 900px | 8.62:1 |
| Headline, both | 16–17:1 |

## 10. Lighting shader

One full-screen fragment shader (`ogl`), fixed behind the page.

**Light source.** Its position is **measured from the trust ring**
(`[data-light-anchor]`), at a point on the ring given by the CSS custom
property `--light-anchor` (`0.65 0.18` from 1024px, upper right, where it was
art-directed; `0.5 0.62` below, where the ring sits under the copy). Media
queries move the light to the side of the ring facing away from the text.
Remeasured on resize and once the ring's entrance animation settles.

```
source     = anchor + (0, scrollProgress × 0.42)      light drifts up as you scroll
fall(d)    = 1 / (1 + 34 d²)                          steep, so the frame stays obsidian
reach      = clamp(3.2 × fall, 0, 1)
lit        = 0.3 + 0.7 × reach                        floored: the field reads as tone everywhere
crest      = smoothstep(0.45, 0.9, reach)             no floor: highlights only where light is strong
```

**Surface.** Three sheets of domain-warped simplex noise at depths
1.0 / 0.7 / 0.4, each at its own scale (1.5 − 0.36i) and parallax rate, so the
near sheet slides past the far one and reads as depth.
`band = smoothstep(0.18, 0.95, c)^1.5`.

**Normal.** Taken by forward difference from **the same function** that
draws the nearest sheet (`sheetNoise`), with a wide step (0.045) so shading
follows the broad folds. An earlier version took the normal from an
unrelated noise call, so the highlights described a surface nobody could
see.

**Shading.** Diffuse; two specular lobes (sheen `(n·h)²⁴`, glint `(n·h)⁶⁴`);
a Fresnel-style rim `(1 − n·v)^2.4`; a body tint moving from deep lime
toward white across each ribbon. Sheen, glint and rim ride `crest`, never
`lit`. With real normals, some slope on the dark side always faces the
light, and on the floored term the highlights reached the copy (3.24:1,
§9).

**Gates.** It mounts only at ≥768px, with more than 4 GB device memory and
without reduced motion. Pixel density is capped at 1.5, and it stops when
the tab is hidden.

**Coordinate trap.** GL's texture origin is bottom-left; a CSS-style
coordinate once lit the wrong corner of the screen.

## 11. Shortlist store

An external store read through `useSyncExternalStore`, rather than React
context: context would need a client provider around the whole app.

- The server snapshot is a frozen empty array, so SSR renders "nothing saved"
  and React swaps in the real list after hydration, with no mismatch and
  no flash.
- Snapshots are **stable references** (React compares by identity and would
  loop on a new array per call).
- Stored slugs are **validated against the catalogue on read**. Without this,
  the navbar badge counted raw slugs (6) while the compare page counted the
  ones it could resolve (4).
- Newest first, capped at 24. Two open tabs stay in sync via the `storage` event.

**Compare winners.** A cell is highlighted only when its row has a real
winner: ties mark every tied column, rows where all values are equal mark
none, and a single-vehicle table marks nothing.

## 12. Trust gating

A vehicle is **locked** when `trustScore < vehicle.minTrustScore`. The ladder
(`TRUST_TIERS`): scooters 0 · bikes to 350cc 10 · cars 20 · EVs 40 ·
tractors 45 · goods vehicles 60 · backhoes and excavators 75. The demo account sits
at **62**, deliberately mid-ladder, so the next tier is visible and
reachable: "13 points to backhoes & excavators".

The mechanism is final; the numbers are not (open policy item). The planned
score engine is in the [Roadmap](ROADMAP.md#algorithms-still-to-build).

## 13. Input debouncing without feedback loops

Typing must not navigate on every keystroke, but the field must also accept
outside changes (Clear all, back button, a shared link).

```
local state drives the input
lastPushed = the value we last sent to the URL
on local change  → after 300 ms idle, if local ≠ lastPushed: push, lastPushed = local
on prop change   → if prop ≠ lastPushed: adopt it, lastPushed = prop
```

Without `lastPushed`, our own push returns as a prop change and restarts the
cycle. The price slider uses the same pattern at 180 ms and ignores incoming
props while a thumb is being dragged: a five-step drag produces **one**
navigation.
