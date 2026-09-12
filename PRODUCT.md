# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **renters in India** looking for a vehicle by the hour or day — across seven categories spanning two very different audiences. Ride & Drive renters (bikes, scooters, cars, EVs) are urban, app-native, price- and availability-sensitive, often booking same-day for commuting, touring or a weekend trip. Heavy & Farm renters (trucks, JCBs/excavators, tractors) are contractors, builders and farmers renting by job or season; less app-native, frequently rural, and may prefer phone or a physical hub over an app-only path.

Secondary: **vehicle owners** listing idle vehicles to earn. They set price and approval terms.

Watching audience: **investors**. The site is a live demo shown in pitch settings, so the product must read as real and working. It is written for renters first; investors judge it by seeing a product that obviously works, not by being pitched to.

## Product Purpose

Let someone rent any class of vehicle — from a scooter to an excavator — through one account, one trust record, and one booking spine. Success is a renter completing a booking in a category they have never rented before without relearning the product, and an owner earning from a vehicle that would otherwise sit idle.

## Positioning

Two tracks sharing one account and one trust system, which no single competitor spans. Consumer rental platforms (Zoomcar, Revv, Royal Brothers) do not touch heavy equipment; equipment platforms (Trringo) do not touch consumer vehicles. MOTORA's claim is that the trust record a renter earns on a scooter is the same record that unlocks a JCB.

Supporting mechanism: a trust/points score built from real rental behaviour (late returns, damage, communication) that gates access to higher-value vehicles — a reputation that travels across categories.

## Operating Context

- Indian market, rupee pricing, hourly and daily rental periods.
- Ride & Drive: MOTORA presents as the licensed operator of record, not a pure P2P marketplace.
- Heavy & Farm: renter chooses self-drive or operator-included as a live toggle at booking time, so both modes need pricing and availability per listing.
- Licence gating is tiered by category: none/low-speed EV → standard DL → commercial for heavy self-drive. Operator-included bookings bypass the renter's own licence requirement.
- Heavy & Farm's audience must not be forced into an app-only path.

## Capabilities and Constraints

- **This is a portfolio/investor-demo build, not a live transactional product.** It must look and behave like a complete product, but nothing connects to live real-world systems.
- Payment UI is built and functional-looking but wired to nothing; any checkout carries a visible "Demo — no real payment processed" notice and never treats a real card number as live.
- Legal/compliance pages are placeholders, not real legal work.
- No real fleet, no RTO licensing, no payment-processor onboarding. Do not block progress on real-world compliance.
- Booking spine: one-time tiered licence/KYC approval reused across categories → (Heavy & Farm) mode select → timestamped photo check-in/out feeding the trust score → all fees itemised upfront → live-human escalation during an active rental.
- Terminology: the two tracks are **Ride & Drive** and **Heavy & Farm**. Primary CTA is "Book Now" wherever relevant.
- Undecided (do not hardcode as final): pricing and deposits per category, late-fee increments, points values and restoration rate, fleet vs P2P mix, KYC automation, CMS choice, owner commission, support channels, promo/referral.

## Brand Commitments

- Name: MOTORA.
- Logo: go-kart badge, red `#C81E2E` / yellow `#F4B800` / black. **Logo-only colours — they never appear in UI tokens or components.** The user holds the asset file and will supply it; until it lands, layout reserves its space.
- UI world is separate from the logo: Obsidian grounds, lime as the functional accent, orange secondary, Space Grotesk headings with Inter body. Dark-only, confirmed — no light mode.
- Voice: direct, mechanical, motion-oriented. Trustworthy for safety, energetic for touring, professional for commercial rentals.

## Evidence on Hand

- Competitive research across ten platforms (Turo, Zoomcar, Getaround, Revv, Royal Brothers, Yulu, Bounce, Trringo, United Rentals, Hertz), distilled in `RESEARCH_BRIEF.md`. This is real analysis and may be drawn on for design decisions.
- **No real fleet, no real listings, no real customers, no real bookings, no press, no funding, no user numbers.** Vehicle listings, prices, ratings, trust scores, cities and availability shown on the site are authored demo data. They may be authored at full production fidelity, but must never be presented as real commercial claims — no invented customer counts, revenue, partnerships, or press.
- No photography library. No 3D render assets. The hero's dimensional visual is built in code (WebGL/CSS), confirmed with the user, because no image-generation tool is available in this environment.

## Product Principles

1. **One trust record, seven categories.** Anything that makes a category feel like a separate product is a failure of the core claim.
2. **Demonstrate, don't assert.** The page shows the product working — real interface, real interaction — rather than describing benefits.
3. **Design against the industry's known failures.** Photo check-in is mandatory not optional; fees are itemised before checkout not at it; a human is always reachable; no automated damage decision binds without human review; no vehicle substitution without consent.
4. **Heavy & Farm is a first-class citizen, not a bolt-on.** Its renters get spec-forward information and non-app access paths, not the consumer template with different photos.
5. **Honest demo.** Authored content may be production-fidelity; commercial claims may not be invented.

## Accessibility & Inclusion

Dark-only surface, so contrast is carried deliberately: lime on obsidian ≈15:1, orange on obsidian ≈6.4:1 (needs bold or larger sizing for small labels). `prefers-reduced-motion` is respected globally and must stay respected as motion is added. Heavy & Farm's rural, less app-native audience is an inclusion constraint, not just a UX preference.
