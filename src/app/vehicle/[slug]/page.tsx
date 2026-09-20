import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Camera,
  Lock,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEMO_TRUST_SCORE,
  LICENCE_LABEL,
  VEHICLES,
  formatINR,
  type HeavyFarmVehicle,
  type RideDriveVehicle,
  type Vehicle,
} from "@/lib/vehicles";

/** Turo pattern, same as the cards: the multi-day total sits beside the
 *  daily rate so nobody does arithmetic and nothing new appears later. */
const QUOTE_DAYS = 3;

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) return { title: "Vehicle not found — MOTORA" };
  return {
    title: `${vehicle.brand} ${vehicle.model} — rent in ${vehicle.city} | MOTORA`,
    description: `Rent a ${vehicle.brand} ${vehicle.model} in ${vehicle.city} from ${formatINR(vehicle.perDay)} per day. Every fee shown upfront, condition photographed at both ends.`,
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) notFound();

  const locked = DEMO_TRUST_SCORE < vehicle.minTrustScore;
  const isHeavy = vehicle.track === "heavy-farm";

  return (
    <>
      <Navbar />
      <main
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors duration-[var(--duration-short)] hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All vehicles
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* ── Left: the object ─────────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Photo slot, shaped for the real photography and scrimmed so
                the badges keep their contrast once an image lands. */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-pearl/10 bg-[radial-gradient(120%_90%_at_20%_0%,var(--color-obsidian-lighter)_0%,var(--color-obsidian-light)_58%,var(--color-obsidian)_100%)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,var(--color-charcoal-3)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-charcoal-3)_1px,transparent_1px)] [background-size:36px_36px]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,color-mix(in_srgb,var(--color-lime)_8%,transparent)_52%,transparent_64%)]"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                {/* `verified` exists only on the Ride & Drive shape; the
                    Heavy & Farm equivalent is rtoRegistered below. */}
                {!isHeavy && (vehicle as RideDriveVehicle).verified && (
                  <Badge variant="trust">
                    <ShieldCheck size={12} aria-hidden="true" />
                    Verified
                  </Badge>
                )}
                {isHeavy && (vehicle as HeavyFarmVehicle).rtoRegistered && (
                  <Badge variant="trust">
                    <ShieldCheck size={12} aria-hidden="true" />
                    RTO registered
                  </Badge>
                )}
              </div>
            </div>

            <h1
              className="mt-8 font-heading font-bold leading-[1.06] tracking-[-0.03em] text-pearl"
              style={{ fontSize: "var(--text-h1)" }}
            >
              <span className="font-medium text-pearl-dim">
                {vehicle.brand}{" "}
              </span>
              {vehicle.model}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-pearl-dim">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={14}
                  className="fill-lime text-lime"
                  aria-hidden="true"
                />
                {vehicle.rating.toFixed(1)}
                <span className="text-pearl-muted">
                  ({vehicle.trips} trips)
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {vehicle.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck size={14} aria-hidden="true" />
                {LICENCE_LABEL[vehicle.requiredLicence]} licence
              </span>
            </div>

            <SpecTable vehicle={vehicle} />

            {/* Licence disclosure as page copy at the point of relevance,
                not buried at the booking gate — the United Rentals CDL
                pattern the research argues for. */}
            <section className="mt-12 border-t border-charcoal-1 pt-8">
              <h2 className="font-heading text-lg font-semibold text-pearl">
                What you need to book this
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-pearl-dim">
                <li className="flex gap-3">
                  <UserCheck
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lime"
                  />
                  {isHeavy
                    ? `A ${LICENCE_LABEL[vehicle.requiredLicence]} licence to drive it yourself. Book it with an operator instead and you need no licence of your own.`
                    : `A valid ${LICENCE_LABEL[vehicle.requiredLicence]} licence, verified once and reused for every later booking.`}
                </li>
                <li className="flex gap-3">
                  <Camera
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lime"
                  />
                  A timestamped photo record at pickup and return. Mandatory at
                  both ends, and it is what settles any dispute about condition.
                </li>
                <li className="flex gap-3">
                  <ReceiptText
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lime"
                  />
                  Every conditional fee is itemised before you commit. Nothing
                  new appears at checkout.
                </li>
              </ul>
            </section>
          </div>

          {/* ── Right: the decision ──────────────────────────────── */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light p-6 shadow-[var(--elev)]">
              {isHeavy ? (
                <HeavyPricing vehicle={vehicle as HeavyFarmVehicle} />
              ) : (
                <RidePricing vehicle={vehicle as RideDriveVehicle} />
              )}

              <div className="mt-6">
                {locked ? (
                  <>
                    <span className="locked-pill flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border text-sm font-medium text-orange">
                      <Lock size={14} aria-hidden="true" />
                      Unlocks at {vehicle.minTrustScore} trust
                    </span>
                    <p className="mt-3 text-xs leading-relaxed text-pearl-muted">
                      Your sample record reads {DEMO_TRUST_SCORE}. Return on
                      time, document condition at both ends, and this category
                      opens up — the record carries across every category.
                    </p>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="h-12 w-full"
                      asChild
                    >
                      <Link href={`/booking/${vehicle.slug}`}>Book now</Link>
                    </Button>
                    <p className="mt-3 text-xs leading-relaxed text-pearl-muted">
                      Demo build. No booking is created and no payment is
                      processed.
                    </p>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function RidePricing({ vehicle }: { vehicle: RideDriveVehicle }) {
  return (
    <>
      <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-pearl-muted">
        Self-drive
      </p>
      <p
        data-figure
        className="data-primary mt-2 font-heading font-bold leading-none tracking-[-0.02em] text-lime"
        style={{ fontSize: "var(--text-figure-sm)" }}
      >
        {formatINR(vehicle.perDay)}
        <span className="ml-1.5 font-body text-sm font-normal tracking-normal text-pearl-muted">
          /day
        </span>
      </p>
      <p data-figure className="mt-2 text-sm text-pearl-dim">
        {formatINR(vehicle.perDay * QUOTE_DAYS)} for {QUOTE_DAYS} days
      </p>
    </>
  );
}

function HeavyPricing({ vehicle }: { vehicle: HeavyFarmVehicle }) {
  return (
    <>
      <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-pearl-muted">
        Both rates, upfront
      </p>
      {/* Both modes priced side by side before the booking starts: the
          decision is a live toggle at checkout, so hiding either rate
          until then is exactly the substitution problem the research
          flags. */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-sm)] border border-charcoal-1 bg-charcoal-1">
        <div className="bg-obsidian px-4 py-3">
          <dt className="text-xs text-pearl-muted">Self-drive</dt>
          <dd
            data-figure
            className="data-primary mt-1 font-heading text-xl font-bold tabular-nums text-lime"
          >
            {formatINR(vehicle.perDay)}
          </dd>
        </div>
        <div className="bg-obsidian px-4 py-3">
          <dt className="text-xs text-pearl-muted">With operator</dt>
          <dd
            data-figure
            className="mt-1 font-heading text-xl font-bold tabular-nums text-pearl"
          >
            {formatINR(vehicle.perDayWithOperator)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-pearl-muted">
        You choose the mode at checkout. No machine is substituted on the day
        without your say-so.
      </p>
    </>
  );
}

function SpecTable({ vehicle }: { vehicle: Vehicle }) {
  const rows: [string, string][] =
    vehicle.track === "ride-drive"
      ? ([
          ["Seats", String(vehicle.specs.seats)],
          [
            "Transmission",
            vehicle.specs.transmission === "manual" ? "Manual" : "Automatic",
          ],
          vehicle.specs.engineCc
            ? ["Engine", `${vehicle.specs.engineCc} cc`]
            : null,
          vehicle.specs.rangeKm
            ? ["Range", `${vehicle.specs.rangeKm} km`]
            : null,
        ].filter(Boolean) as [string, string][])
      : ([
          vehicle.specs.powerHp
            ? ["Power", `${vehicle.specs.powerHp} hp`]
            : null,
          vehicle.specs.reachM ? ["Reach", `${vehicle.specs.reachM} m`] : null,
          vehicle.specs.bucketCapacityM3
            ? ["Bucket", `${vehicle.specs.bucketCapacityM3} m³`]
            : null,
          vehicle.specs.payloadTonnes
            ? ["Payload", `${vehicle.specs.payloadTonnes} t`]
            : null,
          vehicle.specs.operatingWeightKg
            ? [
                "Operating weight",
                `${(vehicle.specs.operatingWeightKg / 1000).toFixed(1)} t`,
              ]
            : null,
        ].filter(Boolean) as [string, string][]);

  return (
    <section className="mt-10 border-t border-charcoal-1 pt-8">
      <h2 className="font-heading text-lg font-semibold text-pearl">
        Specification
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-charcoal-1 py-3 last:border-b-0"
          >
            <dt className="font-body text-[0.68rem] uppercase tracking-[0.14em] text-pearl-muted">
              {label}
            </dt>
            <dd
              data-figure
              className="mt-1 font-heading text-lg font-bold text-pearl"
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
