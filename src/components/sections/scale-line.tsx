import { CATEGORIES, INVENTORY_CITIES, VEHICLES } from "@/lib/vehicles";

/**
 * Scale stated as a sentence, not a stat strip.
 *
 * This replaced a four-figure dashboard panel on 2026-09-18. Both research
 * documents land on the same rule: numbers belong woven into prose, where
 * they read as confidence, rather than isolated in counters, where they
 * read as a dashboard — and Airbnb's system bans dashboard framing from
 * marketing surfaces outright. The figures are identical; only the framing
 * changed.
 *
 * Every figure is still computed from the demo inventory rather than
 * asserted, because a rental site quoting a fleet it does not have is
 * exactly the unearned claim the competitor research flags.
 */
const averageRating = (
  VEHICLES.reduce((sum, vehicle) => sum + vehicle.rating, 0) / VEHICLES.length
).toFixed(1);

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <span data-figure className="font-medium text-pearl">
      {children}
    </span>
  );
}

export function ScaleLine() {
  return (
    <section
      aria-label="MOTORA at a glance"
      className="border-y border-charcoal-1/70"
    >
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
        <p
          data-reveal
          className="text-balance text-center font-heading leading-[1.45] tracking-[-0.01em] text-pearl-dim"
          style={{ fontSize: "var(--text-h2)" }}
        >
          <Figure>{VEHICLES.length} vehicles</Figure> across{" "}
          <Figure>{CATEGORIES.length} categories</Figure> in{" "}
          <Figure>{INVENTORY_CITIES.length} cities</Figure>, averaging{" "}
          <Figure>{averageRating}</Figure> — every one of them behind a single
          licence check and a single <span className="text-lime">trust record</span>.
        </p>

        <p
          data-reveal
          data-reveal-delay="1"
          className="mt-6 text-center text-xs text-pearl-muted"
        >
          Demo inventory. Figures are computed from the vehicles on this page,
          not claimed.
        </p>
      </div>
    </section>
  );
}
