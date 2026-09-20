import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { VEHICLES, formatINR } from "@/lib/vehicles";

/** The six steps are the spine described on the homepage. This page shows
 *  the sequence and where the renter currently stands in it; the steps
 *  themselves are built with the booking backend. */
const STEPS = [
  "Verify once",
  "Choose your mode",
  "See the whole price",
  "Photograph the handover",
  "Reach a person mid-rental",
  "Bank the trust",
] as const;

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
  return {
    title: vehicle
      ? `Book the ${vehicle.brand} ${vehicle.model} | MOTORA`
      : "Booking | MOTORA",
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) notFound();

  return (
    <>
      <Navbar />
      <main
        className="mx-auto max-w-3xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <Link
          href={`/vehicle/${vehicle.slug}`}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors duration-[var(--duration-short)] hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to the {vehicle.model}
        </Link>

        {/* The demo banner is mandatory per CLAUDE.md: any checkout surface
            must state plainly that nothing is processed. */}
        <p className="mt-8 rounded-[var(--radius-md)] border border-orange/40 bg-orange/[0.08] px-4 py-3 text-sm text-orange">
          Demo — no booking is created and no payment is processed.
        </p>

        <h1
          className="mt-8 font-heading font-bold leading-[1.06] tracking-[-0.03em] text-pearl"
          style={{ fontSize: "var(--text-h2)" }}
        >
          <span className="font-medium text-pearl-dim">{vehicle.brand} </span>
          {vehicle.model}
        </h1>
        <p data-figure className="mt-3 text-lg text-pearl-dim">
          <span className="data-primary font-heading font-bold text-lime">
            {formatINR(vehicle.perDay)}
          </span>{" "}
          per day · {vehicle.city}
        </p>

        <ol className="mt-12 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-charcoal-1 bg-charcoal-1">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-4 bg-obsidian px-5 py-4"
            >
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold tabular-nums",
                  i === 0
                    ? "bg-lime text-lime-ink"
                    : "border border-charcoal-2 text-pearl-muted",
                ].join(" ")}
              >
                {i === 0 ? <Check size={14} aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={
                  i === 0 ? "text-sm text-pearl" : "text-sm text-pearl-muted"
                }
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button variant="primary" size="lg" className="h-12" disabled>
            Continue to verification
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-pearl-muted">
            The booking flow is built with the backend work. This page exists
            so the path from a vehicle to a booking is real rather than a dead
            link.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
