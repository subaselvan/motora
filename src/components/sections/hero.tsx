"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroTrustRing } from "@/components/hero-trust-ring";
import { SplitText } from "@/components/ui/split-text";
import { TripWindowFields } from "@/components/search/trip-window-fields";
import { SearchCombobox } from "@/components/search/search-combobox";
import { pushRecent, type Suggestion } from "@/lib/suggest";
import { CATEGORIES, INVENTORY_CITIES } from "@/lib/vehicles";

/** Inline proof, not a card row. Each line is backed by something the product
 *  actually does: a data field (verified / rtoRegistered) or a step in the
 *  booking spine. Nothing here states an undecided policy. */
const PROOF = [
  { icon: ShieldCheck, label: "RTO-verified fleet" },
  { icon: ReceiptText, label: "Fees shown upfront" },
  { icon: Camera, label: "Photo-verified condition" },
] as const;

/** A filter toggle, not a link: aria-pressed rather than tab semantics,
 *  because nothing swaps panels — it only narrows what the search submits. */
function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "shrink-0 whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 font-body text-sm",
        "transition-colors duration-[var(--duration-short)] ease-[var(--ease-base)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime",
        active
          ? "bg-lime text-lime-ink font-medium"
          : "text-pearl-dim hover:bg-obsidian-lighter hover:text-pearl",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [trip, setTrip] = useState({ from: "", to: "" });
  const locationId = useId();

  function tripParams() {
    return trip.from && trip.to
      ? new URLSearchParams({ from: trip.from, to: trip.to }).toString()
      : "";
  }

  function go(q: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("city", location);
    if (category) params.set("category", category);
    // Dates are optional here: browsing without them is a supported path.
    // The results page validates the window and says why if it cannot be
    // booked, so a bad window never silently becomes "everything".
    if (trip.from && trip.to) {
      params.set("from", trip.from);
      params.set("to", trip.to);
    }
    pushRecent(q);
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(query);
  }

  /** What each kind of suggestion does, following the reference sites:
   *  a category or city narrows the form rather than searching at once
   *  (the renter may still be choosing dates), a specific vehicle goes
   *  straight to its page like a Cars24 model hit, and a recent search
   *  re-runs immediately as it does on OLX. */
  function handleSuggestion(item: Suggestion) {
    switch (item.kind) {
      case "category":
        setCategory(item.id);
        setQuery("");
        break;
      case "city":
        setLocation(item.label);
        setQuery("");
        break;
      case "brand":
        setQuery(item.label);
        break;
      case "recent":
        setQuery(item.label);
        go(item.label);
        break;
      case "model":
      case "popular": {
        const qs = tripParams();
        router.push(`/vehicle/${item.slug}${qs ? `?${qs}` : ""}`);
        break;
      }
    }
  }

  return (
    <section aria-labelledby="hero-heading" className="relative isolate">
      {/* Legibility scrim for the copy. The page's light source sits behind
          the ring (measured from it, see ambient-field.tsx), so the copy is
          always on the dim side of the frame; this holds it there as the
          field breathes. Scoped to md and up because the shader only mounts
          there — below that the CSS field is already measured safe and
          scrimming it would just dim the design for nothing. */}
      {/* Hero-only mesh, under the scrim at -z-6 so the scrim above still
          protects the copy column. The page's ambient field is unchanged
          everywhere else. */}
      <div aria-hidden="true" className="hero-mesh -z-[6]">
        <span className="hero-blob-1" />
        <span className="hero-blob-2" />
        <span className="hero-blob-3" />
      </div>

      {/* Desktop scrim, left to right: from lg the ring and its light sit
          right and the copy left. Between md and lg the hero stacks and the
          copy spans the full width, so that case is handled by a scrim on
          the copy column itself (below) rather than by stops on this one —
          percentage stops here only fitted one copy height, and adding the
          trip dates to the search moved the copy's end from 47% to 52% of
          the hero and left the proof line under-covered. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] hidden bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-obsidian-sunken)_80%,transparent)_0%,color-mix(in_srgb,var(--color-obsidian-sunken)_62%,transparent)_42%,transparent_72%)] lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 md:px-6 md:pt-24">
        {/* grid-cols-1, not an implicit column. An implicit track is sized
            `auto`, which grows to its widest child's min-content — and the
            category tab row, although it scrolls, reports its full 530px of
            tabs as min-content. At 375px that pushed the page to 555px wide
            and the tabs never scrolled; the page did. grid-cols-1 is
            minmax(0, 1fr), which cannot be pushed past the viewport, so the
            row's own overflow-x takes over as intended. */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-6">
            {/* Tablet scrim (md to lg), sized by the copy column itself so
                it covers exactly the copy whatever the copy's height. Its
                -z-[5] resolves in the section's isolated stacking context,
                the same layer as the desktop scrim: above the hero mesh,
                below the text. Feathered top and bottom so it reads as the
                frame dimming, not as a panel. The feathers are fixed pixel
                lengths, not percentages: a percentage fade scales with the
                copy's height and at 14% it swallowed the proof line. The
                fade-out sits in the 48px gap above the ring, which keeps
                its light. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -bottom-12 -top-10 -z-[5] hidden bg-[color-mix(in_srgb,var(--color-obsidian-sunken)_74%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_40px,black_calc(100%_-_44px),transparent)] md:block lg:hidden"
            />
            <div data-reveal className="flex flex-wrap gap-2">
              <Badge variant="outline-trust">Self-drive</Badge>
              <Badge variant="outline-urgent">Seven categories</Badge>
            </div>

            {/* Masked word reveal rather than the page's standard fade-up:
                this is the one headline on the site that earns a bespoke
                entrance, and it is the pattern every reference uses on its
                own hero. The two lines are separate SplitText calls so the
                second continues the stagger where the first ended, which a
                single call containing a <br> could not express. */}
            <h1
              id="hero-heading"
              className="mt-6 font-heading font-bold leading-[1.03] tracking-[-0.03em] text-pearl"
              style={{ fontSize: "var(--text-display)" }}
            >
              <SplitText as="span" className="block">
                Rent anything
              </SplitText>
              <SplitText as="span" className="block text-lime" delay={110}>
                that moves.
              </SplitText>
            </h1>

            <p
              data-reveal
              data-reveal-delay="2"
              className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pearl-dim"
            >
              From Royal Enfields to JCBs. One account, one licence check, and a
              trust record that follows you across every category.
            </p>

            <form
              onSubmit={handleSubmit}
              data-reveal
              data-reveal-delay="3"
              /* Shares the single shadow tier; the page's primary action. */
              className="mt-8 rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light p-2 shadow-[var(--elev)]"
            >
              {/* Category lives inside the search rather than in its own row
                  below the fold. Turo and Sixt both do this, and it is the
                  one structural move that makes the search the single
                  dominant object on the page instead of one element among
                  several. The seven categories remain crawlable as real
                  links in the footer's long-tail section, so folding them
                  into filter state here costs no SEO. */}
              <div
                role="group"
                aria-label="Filter by category"
                // Below lg the tabs overflow and scroll. The bar is hidden
                // and the right edge fades instead (Airbnb's category bar):
                // a clipped tab under a fade says "more this way" without a
                // 10px scrollbar strip. From lg every tab fits, so no fade.
                className="scroll-row -mx-1 mb-2 flex gap-1 overflow-x-auto border-b border-charcoal-1 px-1 pb-2 max-lg:[mask-image:linear-gradient(to_right,black_calc(100%_-_32px),transparent)]"
              >
                <CategoryTab
                  active={category === null}
                  onClick={() => setCategory(null)}
                >
                  All
                </CategoryTab>
                {CATEGORIES.map((c) => (
                  <CategoryTab
                    key={c.id}
                    active={category === c.id}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.label}
                  </CategoryTab>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
              <div className="min-w-0 flex-1">
                <SearchCombobox
                  value={query}
                  onChange={setQuery}
                  onSelect={handleSuggestion}
                  placeholder="Model or brand"
                  inputClassName="h-12 pl-9 text-base"
                />
              </div>

              {/* A picker, not free text. The fleet is in five cities; a
                  text box invites "Bangalore" against "Bengaluru" and a
                  confident search that returns nothing. Listing the real
                  cities is also the honest statement of coverage. */}
              <div className="relative min-w-0 flex-1 sm:max-w-[11rem]">
                <label htmlFor={locationId} className="sr-only">
                  City
                </label>
                <MapPin
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-pearl-muted"
                />
                <select
                  id={locationId}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="field-select h-12 w-full pl-9 text-base"
                >
                  <option value="">Any city</option>
                  {INVENTORY_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="h-12 shrink-0 px-6"
              >
                Explore vehicles
              </Button>
              </div>

              <div className="mt-2 border-t border-charcoal-1 px-1 pb-1 pt-3">
                <TripWindowFields
                  from={trip.from}
                  to={trip.to}
                  onChange={(from, to) => setTrip({ from, to })}
                />
              </div>
            </form>

            <ul
              data-reveal
              data-reveal-delay="4"
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {PROOF.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-pearl-dim"
                >
                  <Icon size={14} aria-hidden="true" className="text-lime" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* The subject of the page. Built from data and type rather than
              photography, which is what makes it finishable today and what
              makes it unlike every competitor's hero. */}
          <div data-reveal data-reveal-delay="2" className="lg:col-span-6">
            <HeroTrustRing />
          </div>
        </div>

        {/* The standalone category rail that used to sit here was folded
            into the search widget above on 2026-09-21. Its seven
            destinations survive as crawlable links in the footer's
            long-tail section, so nothing was lost to search engines. */}
        <div className="h-16 md:h-24" aria-hidden="true" />
      </div>
    </section>
  );
}
