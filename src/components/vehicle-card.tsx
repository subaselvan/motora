import Link from "next/link";
import { Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  type HeavyFarmVehicle,
  type LicenceClass,
  type RideDriveVehicle,
  type Vehicle,
} from "@/lib/vehicles";

const LICENCE_LABEL: Record<LicenceClass, string> = {
  none: "No licence",
  "two-wheeler": "Two-wheeler",
  lmv: "LMV",
  commercial: "Commercial",
};

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
        "border border-charcoal-1 bg-obsidian-light",
        "transition-[transform,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-standard)]",
        locked
          ? "opacity-60"
          : "hover:-translate-y-0.5 hover:border-charcoal-3",
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
    return (
      <span
        className={[
          "inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-charcoal-2 px-3 text-xs font-medium text-pearl-muted",
          className ?? "",
        ].join(" ")}
      >
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
      {/* Designed plate, not a photograph — we ship no stock imagery. */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-charcoal-1 bg-[radial-gradient(120%_90%_at_20%_0%,#20202a_0%,#0f0f13_60%,#0b0b0d_100%)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,#54545a_1px,transparent_1px),linear-gradient(to_bottom,#54545a_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-3 left-3 select-none font-heading text-[5.5rem] font-extrabold leading-none tracking-tighter text-pearl/[0.06]"
        >
          {specs.engineCc ? `${specs.engineCc}` : `${specs.rangeKm}`}
        </span>
        <div className="absolute left-3 top-3 flex gap-1.5">
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

      <div className="flex flex-1 flex-col gap-3 p-4">
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
          <p className="font-heading text-xl font-bold text-lime">
            {formatINR(vehicle.perDay)}
            <span className="ml-1 font-body text-xs font-medium text-pearl-muted">
              /day
            </span>
          </p>
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
    { label: "Power", value: `${specs.powerHp} hp` },
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
        className="grid border-b border-charcoal-1 bg-obsidian"
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

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-pearl">
          <span className="font-medium text-pearl-dim">{vehicle.brand} </span>
          {vehicle.model}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="urgent">Self-drive or operator</Badge>
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
