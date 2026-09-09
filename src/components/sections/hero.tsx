"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    if (location) params.set("location", location);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-obsidian-lighter"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-light to-obsidian" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <h1
          id="hero-heading"
          className="max-w-2xl font-heading text-4xl font-bold leading-tight text-pearl md:text-5xl"
        >
          Rent any vehicle,{" "}
          <span className="text-lime">anywhere in India</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-7 text-pearl-dim">
          Bikes, cars, EVs, trucks and heavy machinery — by the hour or the
          day. Real-time GPS tracking, verified owners, delivered to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-3xl flex-col gap-3 rounded-xl border border-obsidian-lighter bg-obsidian-light p-3 shadow-[var(--shadow-3)] sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search className="h-4 w-4 shrink-0 text-pearl-muted" aria-hidden="true" />
            <label htmlFor={queryId} className="sr-only">
              Search by model, brand, or CC
            </label>
            <Input
              id={queryId}
              type="text"
              placeholder="Search by model, brand, or CC"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-0"
            />
          </div>

          <div className="hidden h-8 w-px bg-obsidian-lighter sm:block" aria-hidden="true" />

          <div className="flex flex-1 items-center gap-2 px-2">
            <MapPin className="h-4 w-4 shrink-0 text-pearl-muted" aria-hidden="true" />
            <label htmlFor={locationId} className="sr-only">
              Location
            </label>
            <Input
              id={locationId}
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-0"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
            Search vehicles
          </Button>
        </form>
      </div>
    </section>
  );
}
