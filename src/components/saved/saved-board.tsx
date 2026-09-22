"use client";

import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedSlugs } from "@/components/saved/use-saved";
import { clearSaved, removeSaved } from "@/lib/store/saved-store";
import {
  DEMO_TRUST_SCORE,
  LICENCE_LABEL,
  VEHICLES,
  formatINR,
  type HeavyFarmVehicle,
  type RideDriveVehicle,
  type Vehicle,
} from "@/lib/vehicles";

/**
 * A spec row. `best` marks rows where one column genuinely wins — price,
 * rating, trips. Rows without it (city, transmission) are differences
 * rather than rankings and are left unmarked, because highlighting an
 * arbitrary "winner" on those would be decoration pretending to be data.
 */
type Row<V extends Vehicle> = {
  label: string;
  value: (v: V) => string;
  /** Numeric basis for the comparison; undefined excludes that column. */
  rank?: (v: V) => number | undefined;
  best?: "min" | "max";
};

const COMMON_TAIL = <V extends Vehicle>(): Row<V>[] => [
  {
    label: "Rating",
    value: (v) => `${v.rating.toFixed(1)} (${v.trips})`,
    rank: (v) => v.rating,
    best: "max",
  },
  { label: "Trips", value: (v) => String(v.trips), rank: (v) => v.trips, best: "max" },
  { label: "City", value: (v) => v.city },
  { label: "Licence needed", value: (v) => LICENCE_LABEL[v.requiredLicence] },
  {
    label: "Unlocks at trust",
    value: (v) =>
      v.minTrustScore === 0 ? "Open to all" : String(v.minTrustScore),
    rank: (v) => v.minTrustScore,
    best: "min",
  },
];

const RIDE_ROWS: Row<RideDriveVehicle>[] = [
  {
    label: "Per day",
    value: (v) => formatINR(v.perDay),
    rank: (v) => v.perDay,
    best: "min",
  },
  {
    label: "3 days",
    value: (v) => formatINR(v.perDay * 3),
    rank: (v) => v.perDay * 3,
    best: "min",
  },
  {
    label: "Engine / range",
    value: (v) =>
      v.specs.engineCc
        ? `${v.specs.engineCc} cc`
        : v.specs.rangeKm
          ? `${v.specs.rangeKm} km range`
          : "—",
  },
  { label: "Seats", value: (v) => String(v.specs.seats) },
  {
    label: "Gearbox",
    value: (v) => (v.specs.transmission === "manual" ? "Manual" : "Automatic"),
  },
  { label: "Papers checked", value: (v) => (v.verified ? "Verified" : "Pending") },
  ...COMMON_TAIL<RideDriveVehicle>(),
];

const HEAVY_ROWS: Row<HeavyFarmVehicle>[] = [
  {
    label: "Self-drive / day",
    value: (v) => formatINR(v.perDay),
    rank: (v) => v.perDay,
    best: "min",
  },
  {
    label: "With operator / day",
    value: (v) => formatINR(v.perDayWithOperator),
    rank: (v) => v.perDayWithOperator,
    best: "min",
  },
  {
    label: "Operator premium",
    value: (v) => formatINR(v.perDayWithOperator - v.perDay),
    rank: (v) => v.perDayWithOperator - v.perDay,
    best: "min",
  },
  {
    label: "Power",
    value: (v) => (v.specs.powerHp ? `${v.specs.powerHp} hp` : "—"),
    rank: (v) => v.specs.powerHp,
    best: "max",
  },
  { label: "Reach", value: (v) => (v.specs.reachM ? `${v.specs.reachM} m` : "—") },
  {
    label: "Bucket",
    value: (v) =>
      v.specs.bucketCapacityM3 ? `${v.specs.bucketCapacityM3} m³` : "—",
  },
  {
    label: "Payload",
    value: (v) => (v.specs.payloadTonnes ? `${v.specs.payloadTonnes} t` : "—"),
  },
  {
    label: "RTO registered",
    value: (v) => (v.rtoRegistered ? "Yes" : "Not yet"),
  },
  ...COMMON_TAIL<HeavyFarmVehicle>(),
];

export function SavedBoard() {
  const slugs = useSavedSlugs();

  // Resolve through the catalogue rather than trusting the stored list: a
  // slug can outlive the vehicle it names when inventory changes, and a
  // stale entry should quietly disappear rather than crash the page.
  const saved = slugs
    .map((slug) => VEHICLES.find((v) => v.slug === slug))
    .filter((v): v is Vehicle => Boolean(v));

  if (saved.length === 0) return <EmptyState />;

  const ride = saved.filter((v): v is RideDriveVehicle => v.track === "ride-drive");
  const heavy = saved.filter((v): v is HeavyFarmVehicle => v.track === "heavy-farm");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1
            data-figure
            className="font-heading font-bold tracking-[-0.02em] text-pearl"
            style={{ fontSize: "var(--text-h2)" }}
          >
            <span className="data-primary tabular-nums">{saved.length}</span>{" "}
            saved
          </h1>
          <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-pearl-dim">
            Kept on this device. Sign-in and a shortlist that follows you
            between phones arrive with the accounts work.
          </p>
        </div>
        <button
          type="button"
          onClick={clearSaved}
          className="rounded-[var(--radius-sm)] text-xs font-medium text-orange transition-colors duration-[var(--duration-short)] hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          Clear all
        </button>
      </div>

      {/* Tracks compare separately. A backhoe and a scooter share almost no
          spec rows, so one table spanning both would be mostly dashes. */}
      {ride.length > 0 && (
        <CompareTable title="Ride & Drive" vehicles={ride} rows={RIDE_ROWS} />
      )}
      {heavy.length > 0 && (
        <CompareTable title="Heavy & Farm" vehicles={heavy} rows={HEAVY_ROWS} />
      )}
    </div>
  );
}

function CompareTable<V extends Vehicle>({
  title,
  vehicles,
  rows,
}: {
  title: string;
  vehicles: V[];
  rows: Row<V>[];
}) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-pearl-muted">
          {title}
        </h2>
        <p className="text-xs text-pearl-muted">
          {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>

      {/* Scrolls horizontally past three columns rather than shrinking the
          type. tabindex makes the scroller reachable by keyboard, which an
          overflow container otherwise is not. */}
      <div
        className="compare-scroll mt-4"
        tabIndex={0}
        role="region"
        aria-label={`Compare ${title}`}
      >
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" className="compare-corner">
                <span className="sr-only">Specification</span>
              </th>
              {vehicles.map((v) => (
                <th key={v.id} scope="col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/vehicle/${v.slug}`}
                      className="rounded-[var(--radius-sm)] font-heading text-sm font-semibold leading-snug text-pearl transition-colors duration-[var(--duration-short)] hover:text-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                    >
                      <span className="block font-medium text-pearl-dim">
                        {v.brand}
                      </span>
                      {v.model}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeSaved(v.slug)}
                      aria-label={`Remove ${v.brand} ${v.model} from saved`}
                      className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-pearl-muted transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const winners = bestColumns(vehicles, row);
              return (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {vehicles.map((v) => {
                    const isBest = winners.has(v.id);
                    return (
                      <td
                        key={v.id}
                        data-best={isBest || undefined}
                        data-figure
                      >
                        {row.value(v)}
                        {isBest && (
                          <span className="sr-only"> — best of these</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <th scope="row">
                <span className="sr-only">Book</span>
              </th>
              {vehicles.map((v) => (
                <td key={v.id}>
                  {DEMO_TRUST_SCORE < v.minTrustScore ? (
                    <span className="text-xs text-orange">
                      Locked at {v.minTrustScore}
                    </span>
                  ) : (
                    <Button variant="primary" size="sm" asChild>
                      <Link href={`/vehicle/${v.slug}`}>Open</Link>
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Which columns win this row. Returns a set rather than one id so a tie
 * marks every tied column — picking one arbitrarily would tell the renter
 * something untrue about the others.
 *
 * A single-column table has no winner: "best of one" is noise.
 */
function bestColumns<V extends Vehicle>(
  vehicles: V[],
  row: Row<V>,
): Set<string> {
  if (!row.best || !row.rank || vehicles.length < 2) return new Set();

  const scored = vehicles
    .map((v) => ({ id: v.id, n: row.rank!(v) }))
    .filter((entry): entry is { id: string; n: number } =>
      Number.isFinite(entry.n),
    );
  if (scored.length < 2) return new Set();

  const target =
    row.best === "min"
      ? Math.min(...scored.map((s) => s.n))
      : Math.max(...scored.map((s) => s.n));

  // Every column equal means the row does not distinguish them.
  if (scored.every((s) => s.n === target)) return new Set();

  return new Set(scored.filter((s) => s.n === target).map((s) => s.id));
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-charcoal-2 text-pearl-muted">
        <Bookmark size={20} aria-hidden="true" />
      </span>
      <h1
        className="mt-6 font-heading font-bold tracking-[-0.02em] text-pearl"
        style={{ fontSize: "var(--text-h2)" }}
      >
        Nothing saved yet
      </h1>
      <p className="mx-auto mt-3 max-w-[48ch] leading-relaxed text-pearl-dim">
        Save vehicles as you browse and they land here side by side — price,
        specs and what each one needs from your licence, in one table.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button variant="primary" size="lg" asChild>
          <Link href="/search">Browse the fleet</Link>
        </Button>
      </div>
    </div>
  );
}
