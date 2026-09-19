import { SectionIntro } from "@/components/ui/section-intro";
import { TrustLedger } from "@/components/trust-ledger";

/** How the score moves. Directions, not final point values: the amounts are
 *  an open item in CLAUDE.md and must not be hardcoded as decided. */
const MOVEMENTS = [
  {
    direction: "up" as const,
    text: "Returned on time, with the condition documented at both ends.",
  },
  {
    direction: "up" as const,
    text: "Reachable during the rental, and honest about a fault when one happens.",
  },
  {
    direction: "down" as const,
    text: "Late returns, undocumented damage, or a handover you walked away from.",
  },
];

export function TrustLedgerSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden border-t border-charcoal-1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_70%_at_72%_10%,rgba(198,255,61,0.07)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <SectionIntro
          index="02"
          kicker="Trust protocol"
          headingId="trust-heading"
          heading="Categories unlock as your record grows."
          lede="Every platform makes you start from zero. Here the record is the account: a scooter rental in Coimbatore is what qualifies you for a backhoe in Chennai two seasons later."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12 md:mt-20">
          <div className="lg:col-span-6">
            <dl className="space-y-4 border-t border-charcoal-1 pt-6">
              {MOVEMENTS.map((movement) => (
                <div key={movement.text} className="flex gap-3">
                  <dt
                    aria-label={
                      movement.direction === "up" ? "Raises score" : "Lowers score"
                    }
                    className={[
                      "mt-0.5 font-heading text-sm font-bold leading-none",
                      movement.direction === "up" ? "text-lime" : "text-orange",
                    ].join(" ")}
                  >
                    {movement.direction === "up" ? "+" : "−"}
                  </dt>
                  <dd className="text-sm leading-relaxed text-pearl-dim">
                    {movement.text}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-pearl-muted">
              Sample record. Thresholds shown are illustrative for this preview.
            </p>
          </div>

          <div className="lg:col-span-6">
            <TrustLedger />
          </div>
        </div>
      </div>
    </section>
  );
}
