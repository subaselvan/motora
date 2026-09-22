"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, ReceiptText, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeroTrustRing } from "@/components/hero-trust-ring";
import { SplitText } from "@/components/ui/split-text";
import { CATEGORIES } from "@/lib/vehicles";

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
  const queryId = useId();
  const locationId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("city", location);
    if (category) params.set("category", category);
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
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

      {/* Two orientations because the dark side of the frame moves with the
          layout. From lg the hero is two columns, the ring and its light sit
          right, and the copy is on the left: scrim left to right. Between md
          and lg the hero stacks, the ring drops below the copy, and the copy
          spans the full width: scrim top to bottom, clearing just under the
          proof line (copy ends at ~47% of the hero's height there, the ring
          begins at ~51%). The horizontal-only version left the right half of
          the paragraph unscrimmed at tablet widths — measured at 900px, the
          subcopy fell to 2.59:1 with the light already moved behind the ring. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] hidden md:block md:bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-obsidian-sunken)_80%,transparent)_0%,color-mix(in_srgb,var(--color-obsidian-sunken)_62%,transparent)_47%,transparent_60%)] lg:bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-obsidian-sunken)_80%,transparent)_0%,color-mix(in_srgb,var(--color-obsidian-sunken)_62%,transparent)_42%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 md:px-6 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
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
                className="-mx-1 mb-2 flex gap-1 overflow-x-auto border-b border-charcoal-1 px-1 pb-2"
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
              <div className="relative min-w-0 flex-1">
                <label htmlFor={queryId} className="sr-only">
                  Search by model, brand, or CC
                </label>
                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pearl-muted"
                />
                <Input
                  id={queryId}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Model or brand"
                  className="h-12 pl-9 text-base"
                />
              </div>

              <div className="relative min-w-0 flex-1 sm:max-w-[11rem]">
                <label htmlFor={locationId} className="sr-only">
                  Location
                </label>
                <MapPin
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pearl-muted"
                />
                <Input
                  id={locationId}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="h-12 pl-9 text-base"
                />
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
