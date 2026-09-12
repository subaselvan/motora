# MOTORA — Design System (working draft, direction not mandate)

> For Claude Code: the color roles, dark-first approach, and dual card-template split are the parts worth holding onto. Exact hex/spacing/type numbers are sensible starting defaults — adjust freely based on the actual codebase, component libraries (shadcn/ui, Tailwind config, etc.), and your own judgment rather than treating them as locked.

## Color roles
- **Obsidian** `#0B0B0D` — primary background
- **Obsidian 2** `#141417` — surface / cards
- **Obsidian 3** `#1D1D21` — inputs / raised surface
- **Lime** `#C6FF3D` — primary CTA, price, success, trust score (functional: earned trust, money, "go")
- **Orange** `#FF7A1A` — badges, urgency, secondary CTA
- **Warm Pearl** `#F4F1E8` — body text on dark surfaces
- **Charcoal 1/2/3** `#2A2A2E` / `#3C3C41` / `#54545A` — borders, muted text on dark
- **Logo Red** `#C81E2E` / **Logo Yellow** `#F4B800` — go-kart badge ONLY, never in UI tokens

Contrast: Lime on Obsidian ≈15:1 (AAA), Orange on Obsidian ≈6.4:1 (AA for normal text; use bold/larger for small labels).

## Typography
- Headings: Space Grotesk (500/600/700)
- Body/UI: Inter (400/500/600)
- Modular scale, 16px base × ~1.25: Display 40 / H1 32 / H2 25 / H3 20 / Body 16 / Small 13

## Spacing
8px base scale: 4, 8, 16, 24, 32, 48, 64px. All vertical rhythm should be a multiple.

## Radius
- sm 6px (buttons, inputs, badges)
- md 10px (cards)
- lg 16px (modals, hero panels)

## Elevation (prefer 1px borders over soft shadows per anti-slop rule)
0. Page — flat, no shadow
1. Card — 1px border only
2. Dropdown — slight lift
3. Modal — visible depth
4. Toast/Alert — nearest layer

## Motion
cubic-bezier(.4,0,.2,1), 180–240ms. Respect `prefers-reduced-motion` (disable transform/scale, keep opacity crossfades only).

## Mode
Dark-only per the report's default — **open question for Hari**: confirm this holds for the investor demo, or whether a light-mode toggle is wanted.

## Dual card templates
| | Consumer vehicles (bikes/cars/EVs) | Heavy equipment (JCB/tractors) |
|---|---|---|
| Emphasis | Lifestyle photo, model name, rating | Capacity/reach/power specs first |
| Price | ₹/day, prominent | ₹/day or ₹/month, secondary to specs |
| Trust signal | Verified badge + trust score | Operator-included / self-drive tag + RTO status |

## Core component notes
- Buttons: primary = Lime fill / dark text; secondary = Orange outline; ghost = dark surface fill
- Badges: verified/trust = Lime tint; urgency = Orange tint
- Inputs: Obsidian-3 fill, Charcoal-2 border, Lime focus ring
- Full interactive reference (buttons, badges, card, input previews): see the published artifact linked in the project notes, or ask for a fresh export.

## Still open
- Exact icon set
- Form validation states (error/empty)
- Light-mode decision (see "Mode" above)
