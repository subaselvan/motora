import Link from "next/link";
import { Button } from "@/components/ui/button";

const EARNINGS = [
  ["Scooter", "₹6,400"],
  ["Hatchback", "₹21,800"],
  ["Tractor", "₹38,500"],
  ["Backhoe", "₹1,64,000"],
];

export function HostCta() {
  return (
    <section aria-labelledby="host-cta-heading" className="border-t border-charcoal-1">
      <div className="mx-auto max-w-7xl px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <h2
              id="host-cta-heading"
              className="font-heading text-3xl font-bold tracking-[-0.02em] text-pearl md:text-4xl"
            >
              Your vehicle is idle most of the week
            </h2>
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-pearl-dim">
              List it and it earns while you are not using it. You set the
              price, the availability, and who gets approved. Every renter
              arrives with a trust record you can read before you accept.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
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
              <p className="border-b border-charcoal-1 bg-obsidian-light px-5 py-3 text-xs text-pearl-muted">
                Illustrative monthly earnings at 40% utilisation
              </p>
              <dl className="divide-y divide-charcoal-1">
                {EARNINGS.map(([vehicle, amount]) => (
                  <div
                    key={vehicle}
                    className="flex items-baseline justify-between px-5 py-3.5"
                  >
                    <dt className="text-sm text-pearl-dim">{vehicle}</dt>
                    <dd
                      data-figure
                      className="font-heading text-lg font-bold tabular-nums text-lime"
                    >
                      {amount}
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
