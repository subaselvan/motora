import Link from "next/link";
import { Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  LICENCE_LABEL,
  type HeavyFarmVehicle,
  type RideDriveVehicle,
  type Vehicle,
} from "@/lib/vehicles";

/** Turo pattern: show the multi-day total beside the daily rate so nobody
 *  does arithmetic, and nothing new appears at checkout. */
const QUOTE_DAYS = 3;

/**
 * Two templates, not one with a flag: Ride & Drive sells the object,
 * Heavy & Farm sells the capability. Spec order differs because the
 * renters read in a different order.
 */
export function VehicleCard({
  vehicle,
  trustScore,
}: {
  vehicle: Vehicle;
  trustScore: number;
}) {
  const locked = trustScore < vehicle.minTrustScore;

  return vehicle.track === "ride-drive" ? (
    <RideDriveCard vehicle={vehicle} locked={locked} />
  ) : (
    <HeavyFarmCard vehicle={vehicle} locked={locked} />
  );
}

function CardShell({
  locked,
  children,
}: {
  locked: boolean;
  children: React.ReactNode;
}) {
  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-md)]",
        // Token-mapped 2026-09-21: was #1a1a1f -> #0e0e11, two greys that
        // existed nowhere in the palette. obsidian-lighter -> obsidian is
        // within a value or two of the originals and is nameable.
        "border border-charcoal-1 bg-[linear-gradient(180deg,var(--color-obsidian-lighter)_0%,var(--color-obsidian)_100%)]",
        // Glow bleeding off the top-left corner. A pseudo-element so it paints
        // behind every positioned child rather than over the info panel.
        "before:pointer-events-none before:absolute before:-left-14 before:-top-14 before:h-44 before:w-44 before:rounded-full before:bg-[radial-gradient(closest-side,rgba(198,255,61,0.13),transparent)] before:transition-opacity before:duration-[var(--duration-moderate)] before:content-['']",
        // A hairline that only lights on hover. Drawn as an inset ring on a
        // pseudo-element rather than the border, so the card's geometry never
        // shifts by a pixel between states.
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-md)] after:opacity-0 after:shadow-[inset_0_0_0_1px_rgba(198,255,61,0.45)] after:transition-opacity after:duration-[var(--duration-moderate)] after:ease-[var(--ease-base)] after:content-['']",
        "transition-[transform,border-color,box-shadow] duration-[var(--duration-moderate)] ease-[var(--ease-base)]",
        locked
          ? "opacity-60"
          : [
              // Rises further than before and carries a lime-tinted cast, so
              // the hover reads as the card catching the page's light rather
              // than as a generic drop shadow.
              "hover:-translate-y-1 hover:border-charcoal-3",
              "hover:shadow-[0_1px_2px_color-mix(in_srgb,var(--color-shadow)_55%,transparent),0_18px_40px_-18px_color-mix(in_srgb,var(--color-shadow)_80%,transparent),0_0_36px_-12px_rgba(198,255,61,0.25)]",
              "hover:after:opacity-100 hover:before:opacity-[1.6]",
            ].join(" "),
      ].join(" ")}
    >
      {children}
    </article>
  );
}

/** `disabled` does nothing on an anchor, so a locked CTA must not be one. */
function BookCta({
  slug,
  locked,
  className,
}: {
  slug: string;
  locked: boolean;
  className?: string;
}) {
  if (locked) {
    // Orange, not grey: this is the same colour the hero ring marks the next
    // tier with. A gate you are working toward should read as a target, not
    // as a dead control — CRED's walled-garden framing, where the thing you
    // have not earned is the most aspirational object on the surface.
    return (
      <span
        className={[
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-orange/40 bg-orange/[0.08] px-3 text-xs font-medium text-orange",
          className ?? "",
        ].join(" ")}
      >
        <Lock size={11} aria-hidden="true" />
        Locked
      </span>
    );
  }
  return (
    <Button variant="primary" size="sm" className={className} asChild>
      <Link href={`/vehicle/${slug}`}>Book now</Link>
    </Button>
  );
}

function LockedNote({ required }: { required: number }) {
  return (
    <p className="flex items-center gap-1.5 border-t border-charcoal-1 px-4 py-2.5 text-xs text-pearl-muted">
      <Lock size={12} aria-hidden="true" />
      Unlocks at {required} trust
    </p>
  );
}

/* ── Ride & Drive: the object leads ──────────────────────────── */

function RideDriveCard({
  vehicle,
  locked,
}: {
  vehicle: RideDriveVehicle;
  locked: boolean;
}) {
  const { specs } = vehicle;

  return (
    <CardShell locked={locked}>
      {/* Photo slot. Shaped and scrimmed for the real vehicle photography:
          drop next/image in with object-cover and the badges, scrim and
          frame all stay exactly where they are. */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-pearl/10 bg-[radial-gradient(120%_90%_at_20%_0%,var(--color-obsidian-lighter)_0%,var(--color-obsidian-light)_58%,var(--color-obsidian)_100%)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,var(--color-charcoal-3)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-charcoal-3)_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(198,255,61,0.08)_52%,transparent_64%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-obsidian-sunken)_85%,transparent),transparent)]"
        />

        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant="outline-trust">Lifestyle</Badge>
          {vehicle.verified && (
            <Badge variant="trust">
              <ShieldCheck size={12} aria-hidden="true" />
              Verified
            </Badge>
          )}
        </div>
        <span className="absolute right-3 top-3 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pearl-muted">
          {LICENCE_LABEL[vehicle.requiredLicence]}
        </span>
      </div>

      {/* Translucent, not backdrop-blurred: these cards live inside horizontal
          scrollers, where blur costs a repaint per frame and has nothing behind
          it to blur anyway. */}
      <div className="relative flex flex-1 flex-col gap-3 bg-[color-mix(in_srgb,var(--color-obsidian-light)_82%,transparent)] p-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-pearl">
          <span className="font-medium text-pearl-dim">{vehicle.brand} </span>
          {vehicle.model}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-pearl-dim">
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="fill-lime text-lime" aria-hidden="true" />
            {vehicle.rating.toFixed(1)}
            <span className="text-pearl-muted">({vehicle.trips})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {vehicle.city}
          </span>
          <span>
            {specs.seats} seats · {specs.transmission === "manual" ? "Manual" : "Auto"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            {/* The price is the card's loudest note. Rich direction: let it
                actually be loud rather than matching the title's weight. */}
            <p
              data-figure
              className="font-heading text-2xl font-bold leading-none tracking-[-0.02em] text-lime"
            >
              {formatINR(vehicle.perDay)}
              <span className="ml-1 font-body text-xs font-medium tracking-normal text-pearl-muted">
                /day
              </span>
            </p>
            <p data-figure className="mt-0.5 text-xs text-pearl-muted">
              {formatINR(vehicle.perDay * QUOTE_DAYS)} for {QUOTE_DAYS} days
            </p>
          </div>
          <BookCta slug={vehicle.slug} locked={locked} />
        </div>
      </div>

      {locked && <LockedNote required={vehicle.minTrustScore} />}
    </CardShell>
  );
}

/* ── Heavy & Farm: capability leads, price is secondary ──────── */

function HeavyFarmCard({
  vehicle,
  locked,
}: {
  vehicle: HeavyFarmVehicle;
  locked: boolean;
}) {
  const { specs } = vehicle;

  // Only spec rows this machine actually has — a placeholder dash in a spec
  // table is worse than a narrower table.
  const stats = [
    specs.powerHp && { label: "Power", value: `${specs.powerHp} hp` },
    specs.reachM && { label: "Reach", value: `${specs.reachM} m` },
    specs.bucketCapacityM3 && {
      label: "Bucket",
      value: `${specs.bucketCapacityM3} m³`,
    },
    specs.payloadTonnes && {
      label: "Payload",
      value: `${specs.payloadTonnes} t`,
    },
    specs.operatingWeightKg && {
      label: "Weight",
      value: `${(specs.operatingWeightKg / 1000).toFixed(1)} t`,
    },
  ]
    .filter((stat): stat is { label: string; value: string } => Boolean(stat))
    .slice(0, 3);

  return (
    <CardShell locked={locked}>
      {/* Specs occupy the position the photo holds on a consumer card. */}
      <div
        className="relative grid border-b border-pearl/10 bg-obsidian/70"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-r border-charcoal-1 px-3 py-4 last:border-r-0"
          >
            <p className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-pearl-muted">
              {stat.label}
            </p>
            <p className="mt-1 font-heading text-lg font-bold tabular-nums text-pearl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 flex-col gap-3 bg-[color-mix(in_srgb,var(--color-obsidian-light)_82%,transparent)] p-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-pearl">
          <span className="font-medium text-pearl-dim">{vehicle.brand} </span>
          {vehicle.model}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline-urgent">Heavy equipment</Badge>
          <Badge variant="urgent">Self-drive or operator</Badge>
          {/* Licence class stated on the card itself, not just at the
              booking gate (United Rentals CDL pattern). */}
          <Badge variant="neutral">
            {LICENCE_LABEL[vehicle.requiredLicence]} licence to self-drive
          </Badge>
          {vehicle.rtoRegistered && (
            <Badge variant="trust">
              <ShieldCheck size={12} aria-hidden="true" />
              RTO registered
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-x-3 text-xs text-pearl-dim">
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="fill-lime text-lime" aria-hidden="true" />
            {vehicle.rating.toFixed(1)}
            <span className="text-pearl-muted">({vehicle.trips})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {vehicle.city}
          </span>
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-sm)] border border-charcoal-1 bg-charcoal-1 text-xs">
          <div className="bg-obsidian px-3 py-2">
            <dt className="text-pearl-muted">Self-drive</dt>
            <dd className="mt-0.5 font-heading text-sm font-bold tabular-nums text-lime">
              {formatINR(vehicle.perDay)}
            </dd>
          </div>
          <div className="bg-obsidian px-3 py-2">
            <dt className="text-pearl-muted">With operator</dt>
            <dd className="mt-0.5 font-heading text-sm font-bold tabular-nums text-pearl">
              {formatINR(vehicle.perDayWithOperator)}
            </dd>
          </div>
        </dl>

        <BookCta slug={vehicle.slug} locked={locked} className="w-full" />
      </div>

      {locked && <LockedNote required={vehicle.minTrustScore} />}
    </CardShell>
  );
}
