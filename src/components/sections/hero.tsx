"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, MapPin, ReceiptText, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeroMesh } from "@/components/hero-mesh";
import { LiquidChrome } from "@/components/ui/liquid-chrome";
import { HeroTrustBadge } from "@/components/hero-trust-badge";
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
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Hero only. The rails, spine and footer keep the flat obsidian
          ground; this is the page's one moving surface.

          Two layers, deliberately: the CSS mesh always renders, and the
          shader paints over it on capable devices. Phones, low-memory
          devices and reduced-motion users keep the mesh, which is a
          finished background in its own right rather than a fallback
          that looks like something failed to load. */}
      <HeroMesh />
      <LiquidChrome />
      {/* Legibility scrims, two axes.

          Measured: the shader's brightest crest is #5d6b3a, and under the
          vertical scrim alone the subhead bottomed out at 4.30:1 — under
          the 4.5 AA floor. Dimming the whole shader to fix that would have
          cost the effect everywhere, so the copy column gets its own
          horizontal scrim instead. The right side keeps the full ribbons. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(6,6,9,0.55)_0%,rgba(6,6,9,0.28)_45%,rgba(6,6,9,0.72)_100%)]"
      />
      {/* Column scrim exists to hold the copy off the shader, and the shader
          only mounts at md and up — below that the CSS mesh is already
          measured safe, so applying it there would just dim the design for
          no reason. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgba(6,6,9,0.82)_0%,rgba(6,6,9,0.62)_45%,rgba(6,6,9,0.25)_62%,transparent_75%)] md:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 md:px-6 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="rise flex flex-wrap gap-2">
              <Badge variant="outline-trust">Self-drive</Badge>
              <Badge variant="outline-urgent">Seven categories</Badge>
            </div>

            <h1
              id="hero-heading"
              className="rise stagger-1 mt-5 font-heading font-bold leading-[1.03] tracking-[-0.03em] text-pearl text-[clamp(2.6rem,6vw,4.2rem)]"
            >
              Rent anything
              <br />
              <span className="text-lime">that moves.</span>
            </h1>

            <p className="rise stagger-2 mt-5 max-w-[52ch] text-lg leading-relaxed text-pearl-dim">
              From Royal Enfields to JCBs. One account, one licence check, and a
              trust record that follows you across every category.
            </p>

            <form
              onSubmit={handleSubmit}
              /* Shares the single shadow tier; the page's primary action. */
              className="rise stagger-3 mt-8 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light p-2 shadow-[var(--elev)] sm:flex-row"
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

            <ul className="rise stagger-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
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

          {/* Photo slot. Built at the shape and treatment the real vehicle
              photography will drop into: swap this plate for next/image with
              object-cover and the scrim, badge and frame stay put. */}
          <div className="settle lg:col-span-6">
            <div className="relative aspect-[624/540] overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-[radial-gradient(120%_100%_at_25%_0%,#23232c_0%,#141419_55%,#0c0c0f_100%)] shadow-[var(--elev)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,#54545a_1px,transparent_1px),linear-gradient(to_bottom,#54545a_1px,transparent_1px)] [background-size:42px_42px]"
              />
              {/* Lime rake across the plate, the one warm edge in the frame. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(198,255,61,0.10)_52%,transparent_62%)]"
              />
              {/* Bottom scrim: present now so the floating card keeps its
                  contrast once a real photograph sits underneath. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(6,6,9,0.92)_0%,rgba(6,6,9,0.45)_45%,transparent_100%)]"
              />

              <HeroTrustBadge className="absolute bottom-4 left-4 right-4 sm:right-auto sm:min-w-[15rem]" />
            </div>
          </div>
        </div>

        <nav
          aria-label="Vehicle categories"
          className="mt-12 border-t border-charcoal-1 pt-4 md:mt-16"
        >
          <ul className="-mx-1 flex snap-x gap-1 overflow-x-auto pb-4">
            {CATEGORIES.map((category) => (
              <li key={category.id} className="snap-start">
                <Link
                  href={`/search?category=${category.id}`}
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
