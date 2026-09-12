# MOTORA — Research Brief (distilled from 10-platform competitive teardown)

> Full report (Turo, Zoomcar, Getaround, Revv, Royal Brothers, Yulu, Bounce, Trringo, United Rentals, Hertz) lives at `/docs/research/MOTORA_MASTER_REPORT.pdf` for reference. This file is the build-relevant distillation — read this first, only dig into the PDF for a specific claim's detail.

## Context
This is a portfolio/investor-demo build, not a live legally-operating platform yet. Legal/licensing/registration specifics are explicitly out of scope for now — show them as informational/trust content (badges, copy), not enforced logic.

## Model direction (working, not locked)
- Consumer vehicles (bikes/scooters/cars/EVs): design as if MOTORA is the licensed operator of record (Zoomcar/Revv pattern), not a pure P2P marketplace.
- Heavy equipment (JCB/tractors): support **both** self-drive (commercial-license-gated) and operator-included (Trringo-style, operator dispatched) as user-selectable modes.

## Cross-platform failure patterns to design against
- Damage/deposit disputes → mandatory timestamped photo check-in/check-out, not optional.
- Unreachable support / chatbot-only during active rentals → a visible live-human escalation path.
- Equipment failure billed as user's fault (Yulu battery, Royal Brothers breakdown) → auto-waive fees tied to a flagged fault.
- Vehicle substitution without consent → hard no-substitution rule or guaranteed compensation.
- Hidden fees until checkout → all conditional fees shown upfront in the booking summary.
- Any automated fraud/damage decision (à la Hertz's AI scanner) → must have a human-review gate before it becomes binding.

## UX patterns worth adopting
- **Turo**: category-first hero + trust-scored exact-vehicle listings ("book the exact vehicle, no bait-and-switch"), one-time license approval reused across all future bookings.
- **Zoomcar**: zero-deposit + unlimited-km headline framing, time+km slider, points/rewards loyalty.
- **Getaround**: contactless photo-documented check-in/out feeding a trust score; instant-book vs. request-approval toggle.
- **Revv**: live "real-time info" band per category (avg price, most-booked, dates selling fast) for urgency + transparency.
- **Royal Brothers**: licensing/RTO-authorised badge as a trust signal; founder/timeline storytelling on About.
- **Yulu**: tiered license-gating by category (no-license for low-speed EV, standard DL for cars, commercial for heavy).
- **United Rentals**: spec-forward listing cards (capacity/reach/power) for heavy equipment — separate template from lifestyle-photo consumer cards.
- **Trringo**: multi-channel access (app + phone + physical hub) for rural/heavy-equipment users — never force app-only there.

## Booking flow spine (recommended)
1. One-time license/KYC approval, reused across all categories — tiered by category (none/low-speed EV → standard DL → commercial+operator for heavy).
2. Mode select for heavy equipment (self-drive vs. operator-included).
3. Contactless photo check-in/out, feeding a trust score.
4. All fees itemized upfront; confirm; itemized invoice.
5. Guaranteed live-human escalation path for in-progress issues.
