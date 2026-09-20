import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VehicleCard } from "@/components/vehicle-card";
import { SectionIntro } from "@/components/ui/section-intro";
import {
  DEMO_TRUST_SCORE,
  RAILS,
  VEHICLES,
  type Track,
  type Vehicle,
} from "@/lib/vehicles";

const TRACKS: {
  id: Track;
  name: string;
  blurb: string;
  /** Plain-copy licence disclosure at the point of relevance, not only at
   *  the booking gate (United Rentals CDL pattern). */
  licence: string;
  href: string;
}[] = [
  {
    id: "ride-drive",
    name: "Ride & Drive",
    blurb:
      "Bikes, scooters, cars and EVs. MOTORA is the operator of record, so the vehicle is ours to answer for. You book the exact vehicle on the card, not a class someone reassigns at the counter.",
    licence:
      "You need a two-wheeler licence for bikes and scooters, and an LMV licence for cars and EVs.",
    href: "/search?track=ride-drive",
  },
  {
    id: "heavy-farm",
    name: "Heavy & Farm",
    blurb:
      "Trucks, backhoes and tractors. Drive it yourself or book it with an operator. You choose at checkout, both rates are priced upfront, and no machine is substituted on the day without your say-so.",
    licence:
      "Self-drive needs a commercial licence, entered once when you verify. Book with an operator and you need no licence of your own.",
    href: "/search?track=heavy-farm",
  },
];

export function Tracks() {
  // overflow-x-clip: the full-bleed rails size off 100vw, which includes the
  // scrollbar on Windows. Clip stops that becoming a sideways page scroll and,
  // unlike hidden, does not create a scroll container.
  return (
    <section
      aria-labelledby="tracks-heading"
      className="overflow-x-clip border-t border-charcoal-1"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <SectionIntro
          index="01"
          kicker="The split"
          headingId="tracks-heading"
          heading="Two tracks, one account"
          lede="A commuter and a contractor need different things from a rental. They should not need different companies."
        />

        <div className="mt-16 space-y-24 md:mt-24">
          {TRACKS.map((track) => (
            <div key={track.id}>
              <div className="flex flex-col gap-4 border-b border-charcoal-1 pb-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[64ch]">
                  <h3 className="font-heading text-xl font-semibold text-pearl">
                    {track.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pearl-dim">
                    {track.blurb}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-pearl-muted">
                    {track.licence}
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

              <div className="mt-8 space-y-12">
                {RAILS.filter((rail) => rail.track === track.id).map((rail) => (
                  <Rail
                    key={rail.id}
                    id={rail.id}
                    title={rail.title}
                    href={rail.href}
                    vehicles={VEHICLES.filter(rail.filter)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-pearl-muted">
          Demo inventory. Vehicles, prices and ratings shown here are authored
          for this preview, not live listings.
        </p>
      </div>
    </section>
  );
}

/**
 * One horizontal rail. Native scroll-snap, no carousel library: it swipes on
 * touch, scrolls with trackpads and shift-wheel, and keyboard users tab
 * card to card, which scrolls each into view.
 */
function Rail({
  id,
  title,
  href,
  vehicles,
}: {
  id: string;
  title: string;
  href: string;
  vehicles: Vehicle[];
}) {
  const headingId = `rail-${id}`;

  return (
    // Query container: gives the rail a cqi unit equal to the content column.
    <div className="@container">
      <div className="flex items-baseline justify-between gap-4">
        <h4
          id={headingId}
          className="font-heading text-base font-medium text-pearl"
        >
          {title}
        </h4>
        <Link
          href={href}
          className="shrink-0 rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          View all
        </Link>
      </div>

      {/* Full-bleed: the rail breaks out to the viewport edge so a partly
          visible last card reads as "more this way", not as a crop. Padding
          is exactly the negative margin reversed, so the first card lands on
          the content column at every width. Uses cqi, not %: a percentage
          resolves against the parent for padding but against the scroller
          itself for scroll-padding, which snapped the rail 8px off. */}
      <ul
        aria-labelledby={headingId}
        data-reveal-group
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [margin-inline:calc(50cqi_-_50vw)] [padding-inline:calc(50vw_-_50cqi)] [scroll-padding-inline:calc(50vw_-_50cqi)]"
      >
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            data-reveal-item
            className="w-[17.5rem] shrink-0 snap-start sm:w-[19rem]"
          >
            <VehicleCard vehicle={vehicle} trustScore={DEMO_TRUST_SCORE} />
          </li>
        ))}
      </ul>
    </div>
  );
}
