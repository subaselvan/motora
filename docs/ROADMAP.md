# Roadmap

Where the project stands, what comes next (specified), the database it will
move to, and the algorithms still to build.

## Status

| Area | State |
|---|---|
| Homepage (hero, tracks, comparison, trust ledger, booking spine, product preview, FAQ, footer) | ✅ Done |
| Search: where + when, filters, facets, sort, trip pricing | ✅ Done |
| Type-ahead with synonyms and recent searches | ✅ Done |
| Save and compare | ✅ Done |
| Vehicle pages (specs, both rates for heavy, licence, trust gate) | ✅ Done; dates passed through, not yet displayed as a trip quote |
| Info pages (about, FAQ, help, contact, terms, privacy), host landing | ✅ Done (legal pages are placeholders) |
| **Booking flow** | ⏳ Next: the sequence is shown; the steps are not built |
| **Sign-in** (phone + OTP) | ⏳ Screen exists, not functional |
| **Database** | ⏳ Demo data in memory |
| Renter dashboard, host dashboard, map view | Later |

## Next, in order

### 1. Booking flow: `/booking/[slug]?from=…&to=…`

Inherits the trip window from search and never asks for dates again.

1. **Trip**: pre-filled window, editable in place with the same date and slot
   fields; the quote recalculates live (`quoteTrip`).
2. **Mode** (Heavy & Farm only): self-drive or with operator, both prices
   shown. Self-drive requires a commercial licence; operator bookings don't.
3. **Kilometre plan** (Ride & Drive only): limited, with the per-km excess
   shown, or unlimited.
4. **Hand-over**: hub pick-up, or doorstep delivery for a fee. Heavy & Farm is
   always delivered: a site address and the transport fee.
5. **Licence check** (demo): confirm the licence class; one approval is
   reused for every later booking.
6. **Review**: every line itemised (rental, operator, km plan, delivery,
   refundable deposit, taxes), with provisional values labelled.
7. **Payment (demo)**: test mode only, under the mandatory demo banner.
   Never accept a real card number as if live.
8. **Confirmation**: a booking reference, what happens at hand-over, and the
   photo check-in steps.

State: the draft lives in `sessionStorage`, so a reload doesn't lose it. Each
step validates before it moves on. Afterwards, a "My bookings" list
(localStorage until accounts exist).

### 2. Sign-in (demo)

Phone number (10 digits, starting 6–9) → OTP (6 digits; the demo code is
shown on screen) → a demo session. The navbar shows the account; bookings and
the shortlist attach to it. No password field, ever. The real version is
NextAuth with phone OTP and Google.

### 3. Backend

PostgreSQL (Neon or Supabase) with Drizzle. Seed from `src/lib/vehicles.ts`,
then swap the bodies of `searchVehicles`, `computeFacets`, `isAvailable` and
the shortlist store. Signatures stay; see
[Architecture: where the backend plugs in](ARCHITECTURE.md#where-the-backend-plugs-in).

### 4. After that

Renter dashboard (rentals, extend, points, fines) · host onboarding and
earnings · map and list toggle on search · an India-wide vehicle dataset
(category → brand → model → variant) · Razorpay in **test mode** ·
Playwright end-to-end and Vitest unit tests in CI.

## Database schema (proposed)

```sql
create extension if not exists btree_gist;

create table hubs (
  id          uuid primary key default gen_random_uuid(),
  city        text not null,
  name        text not null,
  location    geography(point),              -- PostGIS, for "near me"
  opens_at    time not null default '08:00',
  closes_at   time not null default '21:30'
);

create table vehicles (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique not null,
  track                  text not null check (track in ('ride-drive','heavy-farm')),
  category               text not null,
  brand                  text not null,
  model                  text not null,
  hub_id                 uuid references hubs,
  required_licence       text not null,       -- none | two-wheeler | lmv | commercial
  per_day                integer not null,     -- rupees
  per_day_with_operator  integer,              -- heavy-farm only
  min_trust_score        integer not null default 0,
  verified               boolean not null default false,
  rto_registered         boolean not null default false,
  specs                  jsonb not null default '{}'
);

create table users (
  id             uuid primary key default gen_random_uuid(),
  phone          text unique not null,
  licence_class  text,
  kyc_status     text not null default 'pending',
  created_at     timestamptz not null default now()
);

create table bookings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users,
  vehicle_id      uuid not null references vehicles,
  period          tstzrange not null,
  mode            text not null default 'self-drive',   -- or 'operator'
  status          text not null default 'held',         -- held | confirmed | active | completed | cancelled
  hold_expires_at timestamptz,
  billing_unit    text not null,                        -- hour | shift | day | week
  total           integer not null,
  lines           jsonb not null,                       -- the itemised quote, frozen at booking
  handover        text not null,                        -- hub | doorstep | site
  address         text,
  -- No double booking, enforced by the database rather than by application code:
  exclude using gist (vehicle_id with =, period with &&)
    where (status in ('held','confirmed','active'))
);

create table trust_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users,
  booking_id  uuid references bookings,
  kind        text not null,        -- clean_return | late_return | damage | ...
  delta       integer not null,
  status      text not null default 'pending_review',   -- a human confirms negatives
  created_at  timestamptz not null default now()
);

create table saved_vehicles (
  user_id     uuid references users,
  vehicle_id  uuid references vehicles,
  created_at  timestamptz not null default now(),
  primary key (user_id, vehicle_id)
);

create table checkin_photos (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings,
  phase        text not null,       -- check_in | check_out
  angle        text not null,       -- front | rear | left | right | odometer | fuel
  url          text not null,
  sha256       text not null,
  captured_at  timestamptz,         -- from EXIF
  uploaded_at  timestamptz not null default now()
);
```

## Algorithms still to build

1. **Hour-level availability.** A vehicle is free if no active booking's
   `period` overlaps the request widened by a turnaround buffer (cleaning and
   inspection, around 60 minutes):
   `NOT EXISTS (… WHERE period && tstzrange(from − buffer, to + buffer))`. The
   exclusion constraint above makes the database the final judge, so two
   renters can't win the same slot.
2. **Checkout holds.** Starting checkout inserts a `held` booking with a
   10-minute expiry. The constraint reserves the slot, and a sweep releases
   expired holds, so there's no race between "looks free" and "paid".
3. **Trust score engine.** The score is computed from the `trust_events`
   log, never stored as truth:
   `score = clamp(0, 100, base + Σ deltaᵢ · e^(−ageᵢ / τ))`.
   Old incidents fade; clean returns restore points. **Negative events only
   count once a person has reviewed them** (the Hertz lesson). Tier unlocks
   read from the score.
4. **Pricing engine.** Today's `quoteTrip` plus every itemised line: operator
   premium, km plan and excess, delivery or transport, a refundable deposit
   (candidate: lower for higher trust), and late fees per 10-minute block after a
   grace period, **auto-waived when a vehicle fault is flagged**. Every rate
   comes from a `pricing_rules` table, not constants.
5. **Photo check-in verification.** A required angle checklist per category;
   EXIF capture time checked against server time (flag drift); SHA-256 to
   catch re-used images; check-out compared with check-in. A damage claim
   is never automatic and always goes to a person.
6. **Geo search.** Distance from the renter to each hub (PostGIS), a "near me"
   sort, and the delivery-fee band by distance.
7. **Search index.** Meilisearch or Algolia once the catalogue is large. The
   synonym list in `src/lib/suggest.ts` becomes the index's synonym set; add
   typo tolerance and facet counts from the index.
8. **Fraud and abuse signals.** Licence reuse across accounts, booking
   velocity, repeated disputes. These only flag for human review, never
   block automatically.

## Open policy decisions

Not engineering calls; each needs an owner decision. Placeholders are marked
in the UI until then.

- Deposit per category, and whether trust lowers it
- Late fee per 10-minute block, and the grace period
- Trust score start value, event weights, decay, restoration rate
- Hourly share, hourly minimum, weekly discount, shift share (currently ⅛, 4 h, 20%, 65%)
- Km limits per plan and the per-km excess
- Delivery and transport fee bands
- Hub hours per city (currently 08:00–21:30 everywhere)
- Fleet versus peer-to-peer mix; owner commission
- KYC: automated API or manual review
- Support channels during an active rental
