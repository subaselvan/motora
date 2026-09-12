import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { VehicleCard } from "@/components/vehicle-card";
import {
  CATEGORIES,
  DEMO_TRUST_SCORE,
  VEHICLES,
  type Category,
  type Track,
} from "@/lib/vehicles";

/**
 * Results surface. Filtering runs against the demo inventory in memory —
 * the real /search (map/list toggle, price and CC filters, availability) is
 * still to build. This exists so the homepage's primary action resolves.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const q = first(params.q)?.trim().toLowerCase() ?? "";
  const city = first(params.city)?.trim().toLowerCase() ?? "";
  const category = first(params.category) as Category | undefined;
  const track = first(params.track) as Track | undefined;

  const results = VEHICLES.filter((vehicle) => {
    if (category && vehicle.category !== category) return false;
    if (track && vehicle.track !== track) return false;
    if (city && !vehicle.city.toLowerCase().includes(city)) return false;
    if (q) {
      const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.category}`.toLowerCase();
      const cc =
        vehicle.track === "ride-drive" ? String(vehicle.specs.engineCc ?? "") : "";
      if (!haystack.includes(q) && !cc.includes(q)) return false;
    }
    return true;
  });

  const activeFilters = [
    track && (track === "ride-drive" ? "Ride & Drive" : "Heavy & Farm"),
    category && CATEGORIES.find((c) => c.id === category)?.label,
    q && `“${first(params.q)}”`,
    city && first(params.city),
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-heading text-3xl font-bold tracking-[-0.02em] text-pearl md:text-4xl">
          {results.length} {results.length === 1 ? "vehicle" : "vehicles"}
        </h1>
        <p className="mt-3 text-pearl-dim">
          {activeFilters.length > 0 ? (
            <>Matching {activeFilters.join(" · ")}</>
          ) : (
            <>Everything available across both tracks.</>
          )}
        </p>

        <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
          <FilterChip href="/search" active={!category && !track}>
            All
          </FilterChip>
          {CATEGORIES.map((option) => (
            <FilterChip
              key={option.id}
              href={`/search?category=${option.id}`}
              active={category === option.id}
            >
              {option.label}
            </FilterChip>
          ))}
        </nav>

        {results.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((vehicle) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} trustScore={DEMO_TRUST_SCORE} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-[var(--radius-md)] border border-charcoal-1 bg-obsidian-light px-6 py-12 text-center">
            <p className="font-heading text-lg font-semibold text-pearl">
              Nothing matches that yet
            </p>
            <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-pearl-dim">
              This preview carries a small demo fleet, so most searches come up
              empty. Clear the filters to see everything available.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-flex rounded-[var(--radius-sm)] text-sm font-medium text-orange transition-colors hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              Clear filters
            </Link>
          </div>
        )}

        <p className="mt-10 text-xs text-pearl-muted">
          Demo inventory. Vehicles, prices and ratings shown here are authored
          for this preview, not live listings.
        </p>
      </main>
      <Footer />
    </>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "rounded-[var(--radius-sm)] border px-3 py-1.5 text-sm transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime",
        active
          ? "border-lime bg-lime/10 text-lime"
          : "border-charcoal-2 text-pearl-dim hover:border-charcoal-3 hover:text-pearl",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
