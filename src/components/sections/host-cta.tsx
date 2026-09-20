import { SectionIntro } from "@/components/ui/section-intro";
import Link from "next/link";
import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";

/** Numeric so the figures can count up; formatted through the same INR
 *  helper the prices use, which keeps the lakh grouping consistent. */
const EARNINGS: [string, number][] = [
  ["Scooter", 6400],
  ["Hatchback", 21800],
  ["Tractor", 38500],
  ["Backhoe", 164000],
];

export function HostCta() {
  return (
    <section aria-labelledby="host-cta-heading" className="border-t border-charcoal-1">
      <div className="mx-auto max-w-7xl px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <SectionIntro
              index="04"
              kicker="For owners"
              headingId="host-cta-heading"
              heading="Your vehicle is idle most of the week"
              lede="List it and it earns while you are not using it. You set the price, the availability, and who gets approved. Every renter arrives with a trust record you can read before you accept."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/host-landing">List your vehicle</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/host-landing#earnings">See what it earns</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-charcoal-1">
              <p className="border-b border-charcoal-1 bg-obsidian-light px-6 py-3 text-xs text-pearl-muted">
                Illustrative monthly earnings at 40% utilisation
              </p>
              <dl className="divide-y divide-charcoal-1">
                {EARNINGS.map(([vehicle, amount]) => (
                  <div
                    key={vehicle}
                    className="flex items-baseline justify-between px-6 py-3.5"
                  >
                    <dt className="text-sm text-pearl-dim">{vehicle}</dt>
                    <dd>
                      <CountUp
                        value={amount}
                        className="font-heading text-lg font-bold tabular-nums text-lime"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-3 text-xs text-pearl-muted">
              Modelled from the demo rates on this page. Not a guarantee or an
              offer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
