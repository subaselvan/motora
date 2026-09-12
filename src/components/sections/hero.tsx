"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroField } from "@/components/hero-field";
import { TrustLedger } from "@/components/trust-ledger";
import { CATEGORIES, type Category } from "@/lib/vehicles";

/** Each line answers a documented industry complaint from RESEARCH_BRIEF.md —
 *  commitments against known failures, not feature boasts. */
const COMMITMENTS: [string, string][] = [
  ["Photo check-in", "Timestamped, both ends. Never optional."],
  ["Every fee upfront", "Nothing new appears at checkout."],
  ["A human, on call", "Reachable mid-rental, not a chatbot."],
];

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
    if (location) params.set("location", location);
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
      <HeroField className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_36%,black_100%)]" />

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
              Rent a scooter this morning and an excavator next season — same
              account, same licence check, and the trust you already earned
              carries across every one of them.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-charcoal-1 bg-obsidian-light/85 p-2 backdrop-blur-sm sm:flex-row"
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
                  className="h-12 border-transparent bg-transparent pl-9 text-base"
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
                  className="h-12 border-transparent bg-transparent pl-9 text-base"
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

            <dl className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-charcoal-1 bg-charcoal-1 sm:grid-cols-3">
              {COMMITMENTS.map(([term, detail]) => (
                <div key={term} className="bg-obsidian px-4 py-3.5">
                  <dt className="font-heading text-sm font-medium text-lime">
                    {term}
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-pearl-muted">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
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
