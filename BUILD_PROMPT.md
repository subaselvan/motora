# MOTORA — Build Kickoff for Claude Code

## What this is
MOTORA is a multi-category vehicle rental platform for India (bikes, scooters, cars, EVs, trucks, JCBs/excavators, tractors), currently being built as a **portfolio/investor-demo website** — not a live legally-operating product yet. Legal/licensing/registration mechanics are intentionally out of scope; show them as trust/informational content, not enforced logic.

## Your role vs. this brief
This document (and the linked design system / IA) is **direction, not a locked spec**. You have more context on the actual codebase, available components, and current best practices than this brief does — use your judgment on implementation details, exact values, and structure. Hold onto the intent; don't feel bound to any specific number here if something better fits the real build.

## Reference docs (in this repo)
- `RESEARCH_BRIEF.md` — distilled competitive research (read this, not the full PDF, for day-to-day building)
- `docs/research/MOTORA_MASTER_REPORT.pdf` — full 10-platform teardown, for digging into a specific claim
- `DESIGN_SYSTEM.md` + `design-tokens.json` — color/type/spacing/component direction
- `IA.md` (sitemap/page types — see below, generate if not present)

## Product direction
- Two tracks sharing one account/trust system: **Ride & Drive** (bikes/scooters/cars/EVs, MOTORA as licensed operator) and **Heavy & Farm** (trucks/JCBs/tractors, self-drive OR operator-included per booking).
- Booking spine: one-time tiered license/KYC approval → (heavy only) mode select → photo check-in/out feeding a trust score → upfront itemized fees → live-human escalation available.
- Brand: go-kart badge logo (red/yellow/black, logo-only) is separate from the UI system (Obsidian/Lime/Orange, Space Grotesk + Inter, dark-first).
- Landing page: professional, non-generic — high-quality 3D-style rendered hero visuals (not necessarily fully interactive WebGL; a small lightweight interactive accent like a rotating logo mark is fine), prioritizing load performance since this will be shown live to investors. No stock photography, no default gradient-hero-plus-3-card-row template.
- Dual card templates: lifestyle-photo + spec-icons for consumer vehicles vs. spec-forward (capacity/reach/power) for heavy equipment.

## Stack
Follow this project's existing tech-stack defaults (Next.js/Astro/SvelteKit + Tailwind + shadcn/ui + TypeScript per the professional-fullstack-web-builder project instructions) unless the repo already establishes something different — match what's there.

## Use everything available to you
Before defaulting to hand-written-from-scratch code, actively check for and use whatever skills, MCP connectors, and plugins you have configured that fit the task — e.g. a Figma connector for translating design direction into implementable components, a design/UI-generation skill for the 3D hero and dual card templates, deployment or testing connectors if configured, or any project-specific skill already set up in this repo. Don't silently skip a relevant tool just because this brief didn't name it. If something in this brief would go faster or better through a specific skill/connector/plugin you have, use it — and say so if you had to work around not having one that would've helped.

Model/effort: Opus at medium effort for this build work specifically (visual/design work — medium avoids Opus's tendency to overcomplicate at high effort). Switch to high effort only for genuinely architectural decisions (data model, auth, booking-flow state) rather than UI work.

## Open items to flag back if they matter
- Whether heavy self-drive vs. operator-included is a per-listing property or always a live toggle at booking.
- Final call on any light-mode support (current direction: dark-only).
