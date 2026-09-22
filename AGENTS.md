<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MOTORA: guide for AI assistants

You are continuing an existing, carefully built project. Read this file,
then [README](README.md), then [docs/DECISIONS.md](docs/DECISIONS.md), before
changing anything. `CLAUDE.md` is the owner's original instruction file; its
product and brand decisions still hold, but where its token values differ,
`src/app/globals.css` and `docs/DESIGN-SYSTEM.md` are current.

## What this is

A multi-category vehicle rental marketplace for India (bikes, scooters,
cars, EVs, trucks, JCBs, tractors) built as an **investor demo**: it must
look and work like a finished product, but no booking is created and no
payment is processed. Next.js 16 · React 19 · TypeScript · Tailwind 4 ·
GSAP + Lenis · ogl (WebGL). No backend yet. Live:
https://motora-preview.onrender.com (auto-deploys on push to `main`).

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npx tsc --noEmit       # must pass
npx eslint src --max-warnings=0   # must pass: zero warnings, not just zero errors
npm run build          # must pass before any commit
```

## Rules that must not be broken

1. **Never process real payments.** Any checkout carries a visible "Demo, no
   payment processed" banner and never accepts a real card number as if live.
2. **Never fabricate social proof** (testimonials, press logos, user counts,
   ratings for real companies). Never invent policy numbers (deposits, late
   fees, point values); use clearly labelled placeholders.
3. **Colours come from tokens only.** The palette is fixed (see
   docs/DESIGN-SYSTEM.md). The logo's original red and yellow never enter UI
   tokens. Dark mode only.
4. **Lime is light, not paint.** Any lime must be explainable as light from the
   source behind the trust ring.
5. **Text contrast ≥ 4.5:1, measured, not assumed.** Anything that changes the
   hero, the scrims or the shader must be re-measured with the method in
   docs/ALGORITHMS.md §9, at 1440px **and** 900px, worst of several frames.
6. **No horizontal scroll at 375px.** Check with a real 375px viewport, not a
   scaled preview.
7. **`src/lib` stays pure**: no React, DOM or fetch. It is the swap point for the
   database.
8. **Search state lives in the URL.** Don't move filters into component state.
9. **Trip times are wall-clock strings.** Never `new Date("2026-09-24T10:00")`;
   use the helpers in `src/lib/rental.ts`.
10. **Respect `prefers-reduced-motion`** in anything animated.
11. Don't reintroduce anything in DECISIONS.md → "Removed or rejected on
    purpose" without the owner's say-so.

## How the owner likes to work

- Work step by step. Finish each task completely (built, verified in a real
  browser, committed) before starting the next, and never leave work half-done.
- Take the lead like a senior engineer: research the references yourself,
  make the call, explain why, and suggest improvements. Ask only for decisions
  that are genuinely the owner's (pricing, policy, visibility).
- After each step, report what was done, how it was verified, and how it
  compares with the best products in the category.
- Commit messages explain **why**, with the evidence (measurements, before and
  after).

## Traps already hit (don't repeat them)

| Trap | What happened | Rule |
|---|---|---|
| Tailwind 4 layering | An unlayered rule in `globals.css` beat `pl-9` regardless of specificity | Component classes must not set properties that call sites override with utilities |
| Implicit grid column | A scrolling tab row's min-content pushed the phone layout to 555px | Use explicit `grid-cols-1` below breakpoints |
| `peer-checked:` on a nested child | It compiles to a sibling selector, so it never matched | Target through the sibling: `peer-checked:[&>svg]:…` |
| GL texture origin | Bottom-left, so a CSS-style coordinate lit the wrong corner | Flip Y when converting from CSS |
| Backticks in shader comments | The GLSL lives in a JS template literal, so a backtick ended the string | Use quotes in shader comments |
| Normal from a different function | The lighting described an invisible surface | Differentiate the same function that draws the surface |
| Floored light term on highlights | Highlights reached the copy (3.24:1) | Highlights ride the unfloored `crest` gate |
| Light pinned to a screen position | Sat behind the copy on tablets (1.08:1) | The light is measured from `[data-light-anchor]` |
| Split-text space inside the mask | `overflow:hidden` clipped it: "Rentanything" | The separator is a sibling of the mask |
| Function props into client components | Functions can't cross the RSC boundary; only `next build` caught it | Pass names or data, not functions |
| `setState` in `useEffect` for a client-only value | Fails the React lint rules | `useSyncExternalStore` with a server snapshot |
| Counter mutated during render | Fails the React compiler lint | Precompute offsets |
| Next 16 `<Image priority>` | Deprecated | `loading="eager"` (or `preload`) |
| ScrollTrigger on `documentElement` | Its box is the viewport, so start and end coincide | Trigger on `document.body` |
| Demo availability by independent days | Long trips found almost nothing | Bookings in multi-day blocks |

## Verifying in a browser

- Real interactions matter. Some embedded preview browsers don't deliver
  pointer events or `:hover` to React, don't run `requestAnimationFrame` while
  hidden, and scale emulated viewports. If a result looks impossible, confirm
  with Playwright at a true viewport size before "fixing" working code.
- Check every change at 1440px, 900px and 375px.

## Where things are

- `src/lib/`: domain logic (search, rental, suggest, vehicles, store)
- `src/components/search/`: filter rail, type-ahead, trip dates, transition
- `src/components/ui/ambient-field.tsx`: the WebGL light field
- `src/app/globals.css`: every design token and component class
- `docs/`: architecture, algorithms, design system, decisions, roadmap

## What to do next

See [docs/ROADMAP.md](docs/ROADMAP.md) → "Next, in order". The next task is
the **booking flow**, fully specified there.
