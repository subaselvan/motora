import Link from "next/link";
import type { Metadata } from "next";
import { CalendarCheck, ShieldCheck, Wallet } from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { SectionIntro } from "@/components/ui/section-intro";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "List your vehicle | MOTORA",
  description:
    "Your vehicle is idle most of the week. List it and it earns while you are not using it — you set the price, the availability, and who gets approved.",
};

/** Same figures as the homepage panel, modelled from the demo rates on
 *  this site at 40% utilisation. Not a guarantee or an offer. */
const EARNINGS: [string, number][] = [
  ["Scooter", 6400],
  ["Hatchback", 21800],
  ["Tractor", 38500],
  ["Backhoe", 164000],
];

const CONTROLS = [
  {
    icon: Wallet,
    title: "You set the price",
    body: "Your daily rate, your minimum rental length. MOTORA never discounts your vehicle to win a booking.",
  },
  {
    icon: CalendarCheck,
    title: "You set the availability",
    body: "Block the days you need it. A vehicle that is not offered is never booked out from under you.",
  },
  {
    icon: ShieldCheck,
    title: "You see the renter's record",
    body: "Every renter arrives with a trust score you can read before you accept, built from on-time returns and documented condition.",
  },
];

export default function HostLandingPage() {
  return (
    <>
      <Navbar />
      <main
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index="01"
          kicker="For owners"
          heading="Your vehicle is idle most of the week"
          lede="List it and it earns while you are not using it. You keep the price, the calendar, and the final say on who drives it."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12 md:mt-24">
          <div className="lg:col-span-7">
            <ul className="space-y-8">
              {CONTROLS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-lime"
                  />
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-pearl">
                      {title}
                    </h2>
                    <p className="mt-2 max-w-[56ch] leading-relaxed text-pearl-dim">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/login">List your vehicle</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">Talk to someone first</Link>
              </Button>
            </div>
          </div>

          <aside id="earnings" className="lg:col-span-5">
            <div className="rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light shadow-[var(--elev)]">
              <div className="border-b border-charcoal-1 px-5 py-4">
                <h2 className="font-heading text-sm font-medium text-pearl">
                  See what it earns
                </h2>
                <p className="mt-0.5 text-xs text-pearl-muted">
                  Monthly, at 40% utilisation
                </p>
              </div>
              <dl className="divide-y divide-charcoal-1">
                {EARNINGS.map(([vehicle, amount]) => (
                  <div
                    key={vehicle}
                    className="flex items-baseline justify-between px-5 py-3.5"
                  >
                    <dt className="text-sm text-pearl-dim">{vehicle}</dt>
                    <dd>
                      <CountUp
                        value={amount}
                        className="data-primary font-heading text-lg font-bold tabular-nums text-lime"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-pearl-muted">
              Modelled from the demo rates on this site. Not a guarantee or an
              offer.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
