import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VehicleCard } from "@/components/vehicle-card";
import { DEMO_TRUST_SCORE, VEHICLES } from "@/lib/vehicles";

const TRACKS = [
  {
    id: "ride-drive" as const,
    name: "Ride & Drive",
    blurb:
      "Bikes, scooters, cars and EVs. MOTORA is the operator of record, so the vehicle is ours to answer for. Always self-drive, licence-gated by class.",
    href: "/search?track=ride-drive",
  },
  {
    id: "heavy-farm" as const,
    name: "Heavy & Farm",
    blurb:
      "Trucks, backhoes and tractors. Drive it yourself with a commercial licence, or book it with an operator. You choose at checkout, and both rates are priced upfront.",
    href: "/search?track=heavy-farm",
  },
];

export function Tracks() {
  return (
    <section
      aria-labelledby="tracks-heading"
      className="border-t border-charcoal-1"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-[55ch]">
          <h2
            id="tracks-heading"
            className="font-heading text-3xl font-bold tracking-[-0.02em] text-pearl md:text-4xl"
          >
            Two tracks, one account
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pearl-dim">
            A commuter and a contractor need different things from a rental.
            They should not need different companies.
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {TRACKS.map((track) => {
            const vehicles = VEHICLES.filter((v) => v.track === track.id).slice(0, 3);
            return (
              <div key={track.id}>
                <div className="flex flex-col gap-4 border-b border-charcoal-1 pb-5 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-[62ch]">
                    <h3 className="font-heading text-xl font-semibold text-pearl">
                      {track.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-pearl-dim">
                      {track.blurb}
                    </p>
                  </div>
                  <Link
                    href={track.href}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] text-sm font-medium text-orange transition-colors hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  >
                    Browse {track.name}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                      <VehicleCard
                        vehicle={vehicle}
                        trustScore={DEMO_TRUST_SCORE}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-pearl-muted">
          Demo inventory. Vehicles, prices and ratings shown here are authored
          for this preview, not live listings.
        </p>
      </div>
    </section>
  );
}
