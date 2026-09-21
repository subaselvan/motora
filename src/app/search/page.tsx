import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { VehicleCard } from "@/components/vehicle-card";
import {
  ActiveFilters,
  FilterBar,
  SortSelect,
} from "@/components/search/filter-bar";
import {
  ResultsFrame,
  SearchTransition,
} from "@/components/search/search-transition";
import {
  computeFacets,
  isEmptyQuery,
  parseSearchQuery,
  searchVehicles,
} from "@/lib/search";
import { DEMO_TRUST_SCORE } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Search vehicles | MOTORA",
  description:
    "Filter the fleet by category, city, price and licence class across both tracks.",
};

/**
 * Results surface.
 *
 * A server component on purpose. Filters live in the URL, so this page
 * re-renders on the server for every filter change — the markup a crawler
 * receives is the markup a person receives, and a filtered view is a link
 * somebody can send. The only client JavaScript here is the controls
 * themselves and the transition that keeps stale results on screen while
 * the next set renders.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseSearchQuery(await searchParams);
  const results = searchVehicles(query, DEMO_TRUST_SCORE);
  const facets = computeFacets(query, DEMO_TRUST_SCORE);

  return (
    <>
      <Navbar />
      <SearchTransition>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6 md:py-14">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-3">
              <FilterBar
                query={query}
                facets={facets}
                resultCount={results.length}
              />
            </div>

            <div className="mt-8 lg:col-span-9 lg:mt-0">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1
                    data-figure
                    className="font-heading font-bold tracking-[-0.02em] text-pearl"
                    style={{ fontSize: "var(--text-h2)" }}
                  >
                    <span className="data-primary tabular-nums">
                      {results.length}
                    </span>{" "}
                    {results.length === 1 ? "vehicle" : "vehicles"}
                  </h1>
                  <p className="mt-2 text-sm text-pearl-dim">
                    {isEmptyQuery(query)
                      ? "Everything available across both tracks."
                      : "Matching your filters."}
                  </p>
                </div>
                <SortSelect query={query} />
              </div>

              <div className="mt-5">
                <ActiveFilters query={query} />
              </div>

              <ResultsFrame>
                {results.length > 0 ? (
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {results.map((vehicle) => (
                      <li key={vehicle.id}>
                        <VehicleCard
                          vehicle={vehicle}
                          trustScore={DEMO_TRUST_SCORE}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState />
                )}
              </ResultsFrame>

              <p className="mt-12 text-xs text-pearl-muted">
                Demo inventory. Vehicles, prices and ratings shown here are
                authored for this preview, not live listings.
              </p>
            </div>
          </div>
        </main>
      </SearchTransition>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-[var(--radius-md)] border border-charcoal-1 bg-obsidian-light px-6 py-14 text-center">
      <p className="font-heading text-lg font-semibold text-pearl">
        Nothing matches that yet
      </p>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-pearl-dim">
        This preview carries a small demo fleet, so a narrow set of filters
        comes up empty quickly. Loosen one, or clear them all.
      </p>
      <Link
        href="/search"
        className="mt-6 inline-flex rounded-[var(--radius-sm)] text-sm font-medium text-orange transition-colors hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
      >
        Clear filters
      </Link>
    </div>
  );
}
