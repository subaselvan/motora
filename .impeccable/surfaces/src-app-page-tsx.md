---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/sections"]
---

# Homepage — surface brief

Scope: `/` (src/app/page.tsx) and its sections. Visitor mode: **Persuade**.

Audience: renters in India, both tracks, with investors watching. Job: find and book a vehicle by hour or day. Action: run a search, or open a vehicle. Proof available: competitive research, authored demo inventory, the trust mechanism itself. Constraints: dark-only; no stock photography; no image-generation tool in this environment, so every visual is code-rendered; logo asset pending from the user; no invented commercial claims.

## Direction contract

THESIS: This page leads with the reputation engine, not the inventory. It refuses the category default — search hero, category strip, three how-it-works steps, featured grid, host CTA — because that arrangement argues MOTORA is one more rental site. The idea this surface owns: one trust record spans a ₹399 scooter to a ₹18,900 excavator.

OWN-WORLD: Obsidian grounds, lime carrying every functional signal (score, price, unlock, primary action), orange confined to mode tags and urgency. Space Grotesk headings, Inter body, tabular numerals everywhere a figure appears. Ledger ruling: 1px charcoal hairlines and grid cells, never soft shadows. Recognisable with all content stripped by its ruled rows, its locked-versus-unlocked tier states, and lime numerics on black.

STORY: The renter understands any vehicle class is available here, believes access is earned and therefore that other renters were vetted too, and searches. The investor reads a defensible mechanism rather than a listings page.

FIRST VIEWPORT: Nav across the top, badge logo left. Left seven columns: headline "One record. Seven categories.", a short subhead, the search bar as the primary action, and a three-item proof strip (photo check-in, fees upfront, human escalation). Right five columns: the live trust ledger — a score readout and ruled tier rows unlocking in sequence, scooter through excavator, the top rows still locked. Category rail spans full width beneath. Signature interaction: the rail and the ledger are bound — the score counts up and tier rows release on entry, and focusing any category lights the tier it belongs to. Motion grammar is 180–240ms on cubic-bezier(.4,0,.2,1) for every state transition — hovers, colour and border changes, tier lock/unlock. The signature count-up is the one deliberate exception: it runs ~1100ms on an exponential ease-out, because it has to be readable as a climbing figure rather than a flicker, and it is the page's single authored moment. Reduced-motion collapses all of it to opacity only and the ledger renders at its final state.

FORM: The Trust Ledger — candidate 3 of 7 on the ordered structural list, dealt the lead by the roll and locked by the user with no steer. Seed key 245d665a.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- Go-kart badge logo asset pending from the user; nav and hero reserve its space and ship a temporary geometric seal.
- No vehicle photography. Card visual regions are designed plates, not photos, until real imagery exists.
- `/search` ships as a results surface over the demo inventory (filters by category, track, query, city). The full search — map/list toggle, price and CC ranges, availability — is not built.
