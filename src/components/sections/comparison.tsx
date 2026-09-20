import { Check, X } from "lucide-react";
import { SectionIntro } from "@/components/ui/section-intro";

/**
 * The differentiation argument, stated as a comparison.
 *
 * Every row is a real complaint pattern from RESEARCH_BRIEF.md rather
 * than a strawman — these are the failures that actually recur across the
 * ten platforms studied, which is why the left column can be specific
 * instead of vague. No competitor is named: the point is the industry
 * default, and naming one invites an argument about that one company
 * instead of about the practice.
 */
const ROWS = [
  {
    issue: "The vehicle you get",
    usual: "A class, reassigned at the counter to whatever is on the lot",
    ours: "The exact vehicle on the card, or your say-so before it changes",
  },
  {
    issue: "What it costs",
    usual: "A headline rate, with fees revealed at checkout",
    ours: "Every conditional fee itemised before you commit",
  },
  {
    issue: "Proving condition",
    usual: "Optional walk-around, disputed later from memory",
    ours: "Timestamped photos at both ends, mandatory, never optional",
  },
  {
    issue: "When it breaks",
    usual: "A chatbot loop while you are stranded",
    ours: "A person, reachable mid-rental. A flagged fault waives its fees",
  },
  {
    issue: "Your history",
    usual: "Starts at zero on every platform, every time",
    ours: "One record that carries from a scooter to a backhoe",
  },
];

export function Comparison() {
  return (
    <section
      aria-labelledby="comparison-heading"
      className="border-t border-charcoal-1"
    >
      <div
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index="02"
          kicker="The difference"
          headingId="comparison-heading"
          heading="Every row here is a complaint we found"
          lede="Not a strawman. These are the failure patterns that recur across the ten platforms in our research, which is why the left column can be this specific."
        />

        <div className="mt-16 md:mt-24" data-reveal-group>
          {/* Column headers, desktop only: on mobile each card repeats its
              own labels, because a header row scrolled far off the top of a
              stacked list stops doing any work. */}
          <div className="hidden border-b border-charcoal-2 pb-3 md:grid md:grid-cols-12 md:gap-8">
            <p className="md:col-span-3 font-body text-xs font-medium uppercase tracking-[0.16em] text-pearl-muted">
              What
            </p>
            <p className="md:col-span-4 font-body text-xs font-medium uppercase tracking-[0.16em] text-pearl-muted">
              Usually
            </p>
            <p className="md:col-span-5 font-body text-xs font-medium uppercase tracking-[0.16em] text-lime">
              Here
            </p>
          </div>

          <ul className="divide-y divide-charcoal-1">
            {ROWS.map((row) => (
              <li
                key={row.issue}
                data-reveal-item
                className="grid gap-4 py-6 md:grid-cols-12 md:gap-8"
              >
                <h3 className="font-heading text-base font-semibold text-pearl md:col-span-3">
                  {row.issue}
                </h3>

                <p className="flex gap-3 text-sm leading-relaxed text-pearl-muted md:col-span-4">
                  <X
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-pearl-muted"
                  />
                  <span>
                    <span className="sr-only">Usually: </span>
                    {row.usual}
                  </span>
                </p>

                <p className="flex gap-3 text-sm leading-relaxed text-pearl-dim md:col-span-5">
                  <Check
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lime"
                  />
                  <span>
                    <span className="sr-only">Here: </span>
                    {row.ours}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs text-pearl-muted">
          Sourced from the complaint patterns in our ten-platform review. No
          competitor is named: the point is the industry default.
        </p>
      </div>
    </section>
  );
}
