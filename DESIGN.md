---
name: MOTORA
description: A multi-category vehicle rental platform for India, built as a trust ledger — one score that unlocks a scooter through an excavator.
colors:
  obsidian: "#0B0B0D"
  obsidian-light: "#141417"
  obsidian-lighter: "#1D1D21"
  obsidian-sunken: "#070709"
  circuit-lime: "#C6FF3D"
  circuit-lime-dark: "#B2EE22"
  circuit-lime-active: "#9FD916"
  circuit-lime-ink: "#0B0B0D"
  signal-orange: "#FF7A1A"
  signal-orange-hover: "#E66A0D"
  signal-orange-active: "#CC5A06"
  pearl: "#F4F1E8"
  pearl-dim: "#B8B3A8"
  pearl-muted: "#8A857C"
  charcoal-1: "#2A2A2E"
  charcoal-2: "#3C3C41"
  charcoal-3: "#54545A"
  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
  info: "#3B82F6"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
  9: "96px"
  10: "128px"
components:
  button-primary:
    backgroundColor: "{colors.circuit-lime}"
    textColor: "{colors.circuit-lime-ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.circuit-lime-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.signal-orange}"
    rounded: "{rounded.sm}"
  button-secondary-hover:
    backgroundColor: "{colors.signal-orange}"
  card:
    backgroundColor: "{colors.obsidian-light}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.obsidian-sunken}"
    textColor: "{colors.pearl}"
    rounded: "{rounded.sm}"
---

# Design System: MOTORA

## Overview

**Creative North Star: "The Trust Ledger"**

MOTORA is a rented record-book, not a storefront. Every screen is built from the vocabulary of a ledger: ruled rows, grid cells, tabular figures, and a state that is either entered or it isn't — locked or unlocked, verified or not. The system does not decorate; it accounts. Depth comes from rules, borders and surface tone first. The system has exactly one shadow weight, shared by every surface that casts one; it never stacks shadow weights to create hierarchy.

The palette is a night garage under one instrument light: obsidian grounds throughout, circuit lime as the single functional signal (price, unlock, primary action, success), signal orange held to a narrow secondary role (badges, urgency, outline actions). The go-kart badge logo's red and yellow are a separate asset system and never enter the UI palette — that boundary is load-bearing, not a style preference.

Confirmed visual rejections: no stacked shadow weights and no glows as a depth device (one shared tier only); no light mode (dark-only, confirmed 2026-09-12); no stock photography; no gradient-hero-plus-three-cards template. Components are precise and mechanical — sharp small radii, instant colour response, no bounce or overshoot in any transition.

**Key Characteristics:**
- Ruled construction: 1px hairlines and grid cells carry structure and depth
- One functional accent (circuit lime) carrying every signal that matters: price, unlock, primary action, success
- Tabular numerals wherever a figure appears, so numbers can be compared at a glance
- Precise, mechanical component feel — sharp corners, instant response, no bounce

## Colors

Two functional colours on a black ground, plus a warm off-white for text — nothing else competes for attention.

### Primary
- **Circuit Lime** (`#C6FF3D`): the system's only "go" signal. Primary CTA fills, prices, unlocked-tier checks, focus rings, the hero field's horizon glow. Contrast against Obsidian is ≈15:1 (AAA) — it is meant to be the brightest thing on any screen it appears on.

### Secondary
- **Signal Orange** (`#FF7A1A`): urgency and choice-points only — mode badges ("Self-drive or operator"), the "Prevents" label in the booking spine, secondary/outline buttons, locked-tier thresholds. Contrast ≈6.4:1 (AA); small orange text ships bold or larger per **The Small-Signal Rule** below.

### Neutral
- **Obsidian** (`#0B0B0D`): primary background, nav, footer — the ground everything else sits on.
- **Obsidian Light** (`#141417`): card and panel surfaces one step off the ground.
- **Obsidian Lighter** (`#1D1D21`): raised surfaces and hover backgrounds.
- **Obsidian Sunken** (`#070709`): below the page plane. Input fills and wells, which recede rather than float.
- **Pearl** (`#F4F1E8`): primary text on dark.
- **Pearl Dim** (`#B8B3A8`): secondary text, descriptions.
- **Pearl Muted** (`#8A857C`): tertiary text, placeholders, captions.
- **Charcoal 1/2/3** (`#2A2A2E` / `#3C3C41` / `#54545A`): borders and dividers only, never text — 1 is the resting border, 2 is hover, 3 is the strongest still-neutral border before a colour takes over.

### Named Rules
**The Logo-Colour Firewall.** The go-kart badge's red (`#D8050A`) and yellow (`#FCCF00`, sampled from the delivered asset) never appear in a UI token, a component, or an inline style. The badge is a separate asset system. The badge itself (`public/logo.png`) reads as a full illustrated mark only at ~48px and above (footer, 56px); at nav (32px) and favicon (16px) it's used by explicit user choice as a recognisable colour mark rather than a legible badge — the wordmark isn't readable at those sizes, and that's accepted, not a defect.

**The Small-Signal Rule.** Orange at a small size (a threshold number, a caption) ships bold or larger — never small and regular. This is the product's own legibility rule, confirmed during the homepage build, not a generic accessibility minimum.

## Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** Space Grotesk carries every heading with a grounded, faintly mechanical geometry; Inter carries all reading text at a neutral, high-legibility register. The pairing never mixes mid-sentence — a heading is entirely display, a paragraph is entirely body.

Both faces are self-hosted variable fonts with narrow weight ranges (Inter 400–500, Space Grotesk 500–700). No weight outside those ranges is used anywhere in the system — a heavier weight would synthesise rather than render the real face.

### Hierarchy
- **Display** (700, `clamp(2.6rem, 6vw, 4.2rem)`, 1.03 line-height, -0.03em tracking): the hero headline only.
- **Headline** (700, 1.875rem–2.25rem, 1.2 line-height, -0.02em tracking): section headings.
- **Title** (600, 1.125rem, 1.4 line-height): card titles, sub-headings.
- **Body** (400–500, 1rem, 1.6 line-height, 58–62ch max measure): paragraph copy.
- **Label** (500, 0.75rem, 0.14em tracking, uppercase where used): category badges, corner tags, kickers.

Figures — prices, scores, thresholds, ratings — always carry tabular numerals (`font-variant-numeric: tabular-nums`), applied via the `data-figure` attribute or the `.tabular` class, so adjacent numbers align rather than jitter.

### Named Rules
**The One-Face-Per-Line Rule.** A single line of text is never split between Space Grotesk and Inter. Mixed emphasis within a heading stays in the display face at a different weight, not a face swap.

## Layout

12-column grid, 24px gutter on desktop, 16px on mobile. Breakpoints: sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536.

Spacing runs on an 8px-rooted step scale (4/8/12/16/24/32/48/64/96/128, tokens `--space-1`…`--space-10` in `:root`), reached explicitly with `var(--space-N)` rather than through Tailwind's numeric spacing utilities — those resolve to the framework default 0.25rem step. **Do not remap the step scale into Tailwind's `--spacing-*` namespace**: doing so once made `h-8` resolve to 64px while `mt-12` stayed 48px, and the page's whole rhythm ran non-monotonic until it was caught in review. Vertical rhythm always carries more space above a heading than below it.

Content sections run at `max-w-7xl` centred, with generous vertical padding (`py-16 md:py-24` for major sections). Cards lay out in responsive grids (1 column mobile → 2 → 3), never fixed-pixel widths.

## Elevation & Depth

**One shared shadow tier** (`--elev`, decided 2026-09-14 from the design scan's Airbnb pattern). The search bar, the trust ledger and hovered cards all cast the same single weight. Everything else about depth is ruled: 1px charcoal borders separate surfaces, surface tone steps from `obsidian-sunken` (inputs) through `obsidian` (page) to `obsidian-light` (cards, panels), and interactive elements signal state with a border-colour shift and a `translateY(-2px)` lift. Inputs carry `--elev-sunken`, an inset that makes them recede; that is a recess, not a second tier.

This section has changed twice, so here is the record: 2026-09-12 shipped no shadows; a five-level ladder was built on 2026-09-14 on request; later that day the single tier replaced it.

### Named Rules
**The One-Tier Rule.** There is one shadow weight. If a surface needs to read as further forward than another, change its surface tone or border, never its shadow. A second shadow weight is a design error, not a refinement.

## Shapes

Small, consistent radii read as precise rather than soft: 6px on buttons, inputs and badges; 10px on cards; 16px on modals and hero-scale panels; 20px reserved for the largest hero containers; full pill radius on avatars and pills only. Borders are always 1px. No clipping masks, no organic or blob shapes — every silhouette is a rectangle with a small corner radius.

## Components

### Buttons
- **Shape:** 6px radius, heights 32/40/48/56px (sm/md/lg/xl).
- **Primary:** Circuit Lime fill, Obsidian-ink text. The only fill this saturated in the whole system — it is meant to be found first.
- **Secondary:** transparent fill, Signal Orange text and 1px border; fills to a 10%-opacity orange wash on hover.
- **Ghost:** transparent, Pearl text, fills to Obsidian-Lighter on hover.
- **Hover / Focus:** every variant lifts `translateY(-2px)` on hover (**The Anything-Clickable Rule** — confirmed 2026-09-12: any actionable control lifts, not only content cards) and carries a 2px Circuit Lime focus ring, offset 2px, on keyboard focus. Colour and transform both animate over 180ms on the system's standard ease.

### Cards
- **Corner Style:** 10px radius.
- **Background:** Obsidian Light, sitting one step off the page ground.
- **Border:** 1px Charcoal 1 at rest, Charcoal 3 on hover.
- **Hover:** `translateY(-2px)`, border brightens to Charcoal 3, and the card takes the single `--elev` shadow. Flat at rest.
- **Internal Padding:** 16px (mobile) to 24px (desktop) depending on card density.

### Inputs
- **Style:** Obsidian-Sunken fill with the `--elev-sunken` inset so fields recede below the page, 1px Charcoal-2 border, 6px radius.
- **Focus:** border and ring both switch to Circuit Lime, ring offset 2px.
- **Error:** border switches to the semantic error red; no other component currently uses the warning/info tokens.

### Badges
- **Style:** small rounded-sm tags, no border — colour comes from a low-opacity tint of the semantic hue (`bg-lime/12` for trust/verified, `bg-orange/12` for urgency/mode, `bg-obsidian-lighter` for neutral).
- **Use:** "Verified", "RTO registered" (trust — lime tint); "Self-drive or operator" (urgency/mode — orange tint); category and licence-class corner tags (neutral).

### Navigation
- Sticky header, Obsidian at 90% opacity with backdrop blur, 1px Charcoal-1 bottom border. Primary links sit in Pearl-Dim, brightening to Pearl on hover/focus; the two primary CTAs (Log in / List your vehicle) live at the trailing edge. Below `md`, primary links and CTAs collapse into a hamburger-toggled panel rather than disappearing — every link stays reachable at every width.

### The Trust Ledger (signature component)
A ruled panel: a score readout in tabular Circuit Lime numerals at display weight, over a `divide-y` list of tier rows. Each row carries a lock/check icon, a label, and a threshold or "Unlocked" status; locked rows dim to Pearl-Muted, unlocked rows read in full Pearl. The panel is wired to the page's category rail — focusing or hovering a category lights its owning tier row (`bg-lime/[0.07]`) — so the ledger and the navigation share one state rather than existing as separate components. On entry, the score counts up over ~1100ms on an exponential ease-out and tiers unlock progressively; this is the system's one deliberate exception to the 180–240ms standard transition duration, because a climbing figure needs to read as climbing, not flicker. `prefers-reduced-motion` collapses it straight to the final state.

## Do's and Don'ts

### Do:
- **Do** keep Circuit Lime to functional signals only — price, unlock, primary action, success. If a screen has more than one "brightest thing," lime is being spent on decoration.
- **Do** use `var(--space-N)` for explicit rhythm steps, and Tailwind's default numeric utilities for everything else. Never map the step scale into `--spacing-*`.
- **Do** carry tabular numerals on every figure that sits near another figure (prices, scores, thresholds, specs).
- **Do** lift any clickable element `translateY(-2px)` on hover and brighten its border — that pairing is the system's entire depth vocabulary.
- **Do** ship orange text bold or larger when it appears below body size.

### Don't:
- **Don't** introduce a second shadow weight. `--elev` and the `--elev-sunken` inset are the only shadows in the system.
- **Don't** let the logo's red or yellow enter a component, a token, or an inline style.
- **Don't** set a font-weight above 500 on Inter or below 500 on Space Grotesk — both faces are self-hosted with narrow ranges and a heavier weight synthesises rather than renders.
- **Don't** build a light theme. Dark-only is confirmed, not a placeholder.
- **Don't** present demo data (inventory, prices, ratings, the trust score itself) as though it belongs to the viewer or is a live commercial claim — label it as sample/preview wherever it could be mistaken for real.
