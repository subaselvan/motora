"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, MapPin, ReceiptText, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeroTrustRing } from "@/components/hero-trust-ring";
import { CATEGORIES } from "@/lib/vehicles";

/** Inline proof, not a card row. Each line is backed by something the product
 *  actually does: a data field (verified / rtoRegistered) or a step in the
 *  booking spine. Nothing here states an undecided policy. */
const PROOF = [
  { icon: ShieldCheck, label: "RTO-verified fleet" },
  { icon: ReceiptText, label: "Fees shown upfront" },
  { icon: Camera, label: "Photo-verified condition" },
] as const;

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
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
    <section aria-labelledby="hero-heading" className="relative isolate">
      {/* Legibility scrim for the copy column only. The page's light source
          sits top-right behind the ring, so the left column is already the
          dim side of the frame; this holds it there as the field breathes.
          Scoped to md and up because the shader only mounts there — below
          that the CSS field is already measured safe and scrimming it would
          just dim the design for nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] hidden bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-obsidian-sunken)_80%,transparent)_0%,color-mix(in_srgb,var(--color-obsidian-sunken)_62%,transparent)_42%,transparent_72%)] md:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 md:px-6 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div data-reveal className="flex flex-wrap gap-2">
              <Badge variant="outline-trust">Self-drive</Badge>
              <Badge variant="outline-urgent">Seven categories</Badge>
            </div>

            <h1
              id="hero-heading"
              data-reveal
              data-reveal-delay="1"
              className="mt-5 font-heading font-bold leading-[1.03] tracking-[-0.03em] text-pearl"
              style={{ fontSize: "var(--text-display)" }}
            >
              Rent anything
              <br />
              <span className="text-lime">that moves.</span>
            </h1>

            <p
              data-reveal
              data-reveal-delay="2"
              className="mt-5 max-w-[52ch] text-lg leading-relaxed text-pearl-dim"
            >
              From Royal Enfields to JCBs. One account, one licence check, and a
              trust record that follows you across every category.
            </p>

            <form
              onSubmit={handleSubmit}
              data-reveal
              data-reveal-delay="3"
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
                Explore vehicles
              </Button>
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

        <nav
          aria-label="Vehicle categories"
          className="mt-14 border-t border-charcoal-1 pt-4 md:mt-20"
        >
          <ul className="-mx-1 flex snap-x gap-1 overflow-x-auto pb-4">
            {CATEGORIES.map((category) => (
              <li key={category.id} className="snap-start">
                <Link
                  href={`/search?category=${category.id}`}
                  className="flex min-w-[7.5rem] flex-col gap-1 rounded-[var(--radius-sm)] border border-transparent px-3 py-2.5 transition-colors duration-[var(--duration-short)] ease-[var(--ease-base)] hover:border-charcoal-2 hover:bg-obsidian-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <span className="font-heading text-sm font-medium text-pearl">
                    {category.label}
                  </span>
                  <span className="text-xs text-pearl-muted">
                    {category.track === "ride-drive"
                      ? "Ride & Drive"
                      : "Heavy & Farm"}
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
