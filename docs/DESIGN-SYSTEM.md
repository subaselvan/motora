# Design system

The implemented system. The source of truth is `src/app/globals.css`; if
this page and the CSS ever disagree, the CSS wins and this page is wrong.

## The one rule

**Lime is a light source, not a paint colour.** Every lime surface must be
explainable as light arriving from somewhere: the page's light sits behind
the trust ring, with steep falloff, and the frame is roughly 85% true
obsidian. A flat acid-green wash on near-black is one of the most common
signs of generated web design; that is the failure this rule exists to
prevent.

## Colour

Dark only; there is no light mode, by decision.

| Token | Value | Role |
|---|---|---|
| `--color-obsidian` | `#0B0B0D` | Page background |
| `--color-obsidian-sunken` | `#070709` | Below the page: inputs, wells |
| `--color-obsidian-light` | `#141417` | Cards, panels |
| `--color-obsidian-lighter` | `#1D1D21` | Raised surfaces, hover |
| `--color-lime` | `#C6FF3D` | **Primary action, price, trust, success** |
| `--color-lime-dark` / `-active` | `#B2EE22` / `#9FD916` | Hover / pressed; deep tint in the shader |
| `--color-lime-ink` | `#0B0B0D` | Text on lime |
| `--color-orange` | `#FF7A1A` | Secondary: urgency, locked targets, outline actions |
| `--color-pearl` | `#F4F1E8` | Primary text |
| `--color-pearl-dim` | `#B8B3A8` | Secondary text |
| `--color-pearl-muted` | `#8A857C` | Tertiary text, placeholders |
| `--color-charcoal-1…3` | `#2A2A2E` `#3C3C41` `#54545A` | Borders and dividers, never text |
| `--color-error` | `#EF4444` | Form validation only |
| `--color-shadow` | `#040408` | The tint of every shadow |

The badge logo was delivered in red `#D8050A` and yellow `#FCCF00`; those
two **never** appear in UI tokens. On 2026-09-20 the badge itself was
recoloured onto the palette (red → orange, yellow → lime, black → obsidian,
white → pearl), with inverse-distance colour weighting so the edges stay
smooth; the original is archived outside this repo. Unused semantic colours
(success, warning, info) were deleted, so no off-brand hue sits in the
palette waiting to be reached for.

## Typography

Space Grotesk for headings and figures, Inter for body, both self-hosted as
variable fonts.

Fluid scale, used for headings and display figures only (deliberately not
mapped over Tailwind's `text-*` utilities):

| Token | Value |
|---|---|
| `--text-display` | `clamp(2.7rem, 1.6rem + 4.6vw, 4.75rem)` |
| `--text-h1` | `clamp(2.1rem, 1.4rem + 2.9vw, 3.25rem)` |
| `--text-h2` | `clamp(1.6rem, 1.2rem + 1.7vw, 2.35rem)` |
| `--text-figure` | `clamp(2.4rem, 1.7rem + 3vw, 3.9rem)` |
| `--text-figure-sm` | `clamp(1.9rem, 1.45rem + 1.5vw, 2.6rem)` |

Figures use `tabular-nums` so columns of prices align. Small labels are
uppercase with `0.14em` tracking.

## Space, radius, rhythm

- **Spacing**: 8px base, `--space-1…10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
  These are **not** mapped into Tailwind's spacing namespace: doing that
  rebinds every numeric utility (`h-8` became 64px while `mt-12` stayed 48px).
- **Section rhythm**: one token for every section seam,
  `--section-y: clamp(4.5rem, 7.5vw, 8.5rem)`.
- **Radius**: sm 6px (buttons, inputs, badges) · md 10px (cards) · lg 16px
  (panels, hero search) · xl 20px · full.
- **Grid**: 12 columns from 1024px. Any grid whose content can overflow uses
  an explicit `grid-cols-1` below that. An implicit column grows to its
  widest child's minimum width and once pushed the phone layout to 555px.

## Elevation

**One shared shadow**, `--elev`, for cards, panels, the search bar and
dropdowns. Depth comes from **surface tone** (sunken → page → light →
lighter) and border strength, never from stacking shadow weights.
`--elev-sunken` is an inset for inputs: a recess, not a level.

## Motion

Porsche Design System timing scale on one curve,
`--ease-base: cubic-bezier(0.25, 0.1, 0.25, 1)`:

| Token | Duration | Use |
|---|---|---|
| `--duration-short` | 250ms | hover, press, popovers |
| `--duration-moderate` | 400ms | reveals, tab switches |
| `--duration-long` | 600ms | flyouts |
| `--duration-xlong` | 1200ms | count-ups, ceremonial moments |

- **Smooth scroll**: Lenis on GSAP's ticker; scroll-scrubbed parallax on one
  ScrollTrigger timeline.
- **Headline**: words, not characters, rise out of a mask with a 55ms stagger.
  The space between words sits outside the mask, since `overflow: hidden`
  clips a trailing space and welds the words together ("Rentanything").
- **Trust ring**: the go-kart drives the arc to the score in 2.1s on
  exponential ease-out (`1 − 2^(−10t)`), with its heading equal to
  progress × 360°.
- **Search, filtering and browsing stay fast and unanimated.** Ceremony is
  saved for moments that earn it.
- **`prefers-reduced-motion`** is honoured everywhere: the shader never
  mounts, and animations resolve to their final state instead of snapping.

## Components

- **Buttons**: primary is a lime fill with ink text; secondary is an orange
  outline; ghost is pearl text. There is no separate "lime" variant, because
  primary *is* lime.
- **Inputs, selects, date fields**: sunken fill with the inset shadow and a
  charcoal border; focus is a lime border plus a 2px lime ring. Native
  `<select>` and date inputs keep the phone's own pickers, with only the
  closed state restyled.
- **Cards**: two templates. **Ride & Drive** leads with the object (visual,
  model, rating, price). **Heavy & Farm** leads with capability (power, reach,
  payload), then both day rates (self-drive and with operator).
- **Locked state**: orange, not grey. A tier you are working toward reads as a
  target, not a dead control.
- **Focus rings** are lime everywhere and land on the element that has the
  keyboard (for example, a range slider's thumb, not the whole track).

## Accessibility floor

- Text contrast of at least **4.5:1**, measured over the live background (see
  [Algorithms §9](ALGORITHMS.md#9-contrast-measurement)). Shipped hero copy
  measures 8.6:1 or better.
- No horizontal scroll at 375px.
- Every interactive element is reachable and operable by keyboard;
  custom widgets follow their WAI-ARIA pattern.

## CSS layering gotcha

Tailwind 4 puts utilities in `@layer utilities`. Any **unlayered** rule in
`globals.css` beats every utility regardless of specificity, so a component
class must never set a property that call sites override with utilities
(for example, `.field-select` sets only `padding-right`, so `pl-9` still works).
