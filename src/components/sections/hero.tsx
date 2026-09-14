"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Headset, MapPin, ReceiptText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroField } from "@/components/hero-field";
import { HeroKart } from "@/components/hero-kart";
import { TrustLedger } from "@/components/trust-ledger";
import { CATEGORIES, type Category } from "@/lib/vehicles";

/** Each line answers a documented industry complaint from RESEARCH_BRIEF.md —
 *  commitments against known failures, not feature boasts.
 *
 *  Deliberately NOT a three-up card row: that arrangement is ruled out by
 *  CLAUDE.md, DESIGN.md and BUILD_PROMPT.md. These render as one continuous
 *  hairline-divided strip with weighted emphasis, not three equal boxes. */
const COMMITMENTS = [
  {
    icon: Camera,
    term: "Photo check-in",
    detail: "Timestamped at both ends. Never optional.",
  },
  {
    icon: ReceiptText,
    term: "Every fee upfront",
    detail: "Nothing new appears at checkout.",
  },
  {
    icon: Headset,
    term: "A human, on call",
    detail: "Reachable mid-rental, not a chatbot.",
  },
] as const;

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const queryId = useId();
  const locationId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("city", location);
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* CSS ground sits under the canvas so the hero still has a floor when
          WebGL is unavailable and HeroField renders nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(198,255,61,0.05)_0%,transparent_70%)]"
      />
      {/* Shader horizon sits at 42% from the top (uv.y=0.58 in bottom-up
          fragcoord space). The mask's opaque stop must sit above that line,
          not below it — put it below and you fade out exactly the densest,
          most legible rows: the ones that actually sell recession. */}
      {/* The kart is the hero's visual now, so the ground plane drops back to
          being a floor. Masked to a band that closes above the guarantee
          strip: at full height its horizon ran straight through that copy. */}
      <HeroField className="pointer-events-none absolute inset-0 h-full w-full opacity-50 [mask-image:linear-gradient(to_bottom,transparent_0%,black_28%,black_44%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 md:px-6 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="font-heading font-bold leading-[1.03] tracking-[-0.03em] text-pearl text-[clamp(2.6rem,6vw,4.2rem)]"
            >
              One record.
              <br />
              <span className="text-lime">Seven categories.</span>
            </h1>

            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-pearl-dim">
              Rent a scooter today and an excavator next season. Same account,
              same licence check, same trust you already earned.
            </p>

            <form
              onSubmit={handleSubmit}
              /* Shares the single shadow tier; the page's primary action. */
              className="mt-8 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light p-2 shadow-[var(--elev)] sm:flex-row"
            >
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
                Search vehicles
              </Button>
            </form>

            {/* Deliberately the flattest thing in the hero, no shadow.
                One continuous strip on the page plane, hairline-divided,
                so it supports the search bar instead of competing with it. */}
            <div className="mt-7 border-t border-charcoal-1 pt-5">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-pearl-muted">
                Every rental, guaranteed
              </p>
              <dl className="mt-4 flex flex-col divide-y divide-charcoal-1 sm:flex-row sm:divide-x sm:divide-y-0">
                {COMMITMENTS.map(({ icon: Icon, term, detail }, i) => (
                  <div
                    key={term}
                    className={[
                      "flex items-start gap-2.5 py-3 sm:py-0",
                      i === 0 ? "sm:pr-5" : "sm:px-5",
                      i === COMMITMENTS.length - 1 ? "sm:pr-0" : "",
                    ].join(" ")}
                  >
                    <Icon
                      size={15}
                      aria-hidden="true"
                      className={
                        i === 0
                          ? "mt-0.5 shrink-0 text-lime"
                          : "mt-0.5 shrink-0 text-pearl-muted"
                      }
                    />
                    <div className="min-w-0">
                      <dt
                        className={
                          i === 0
                            ? "font-heading text-sm font-medium text-pearl"
                            : "font-heading text-sm font-medium text-pearl-dim"
                        }
                      >
                        {term}
                      </dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-pearl-muted">
                        {detail}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* The dimensional object gets its own space above the ledger
                rather than sitting behind it — a 3D object hidden behind an
                opaque panel is not a 3D object. */}
            <HeroKart className="pointer-events-none mb-5 hidden h-[300px] w-full lg:block" />
            <TrustLedger activeCategory={activeCategory} />
          </div>
        </div>

        <nav
          aria-label="Vehicle categories"
          className="mt-12 border-t border-charcoal-1 pt-4 md:mt-16"
          onMouseLeave={() => setActiveCategory(null)}
        >
          <ul className="-mx-1 flex snap-x gap-1 overflow-x-auto pb-4">
            {CATEGORIES.map((category) => (
              <li key={category.id} className="snap-start">
                <Link
                  href={`/search?category=${category.id}`}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onFocus={() => setActiveCategory(category.id)}
                  onBlur={() => setActiveCategory(null)}
                  className="flex min-w-[7.5rem] flex-col gap-1 rounded-[var(--radius-sm)] border border-transparent px-3 py-2.5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-charcoal-2 hover:bg-obsidian-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <span className="font-heading text-sm font-medium text-pearl">
                    {category.label}
                  </span>
                  <span className="text-xs text-pearl-muted">
                    {category.track === "ride-drive" ? "Ride & Drive" : "Heavy & Farm"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
