import { CATEGORIES, INVENTORY_CITIES, VEHICLES } from "@/lib/vehicles";

/**
 * Four figures, all derived from the demo inventory rather than asserted.
 * A rental site quoting a fleet size it does not have is exactly the kind of
 * unearned claim the competitor research flags, so every number here is
 * computed and every label says what it counts.
 */
const averageRating =
  VEHICLES.reduce((sum, vehicle) => sum + vehicle.rating, 0) / VEHICLES.length;

const STATS = [
  { value: String(VEHICLES.length), label: "Vehicles in this preview" },
  { value: averageRating.toFixed(1), label: "Average rating, demo fleet" },
  { value: String(CATEGORIES.length), label: "Categories, one licence check" },
  { value: String(INVENTORY_CITIES.length), label: "Cities carrying inventory" },
];

/* Gradient-fade rule rather than a solid divider: the seam should dissolve at
   the panel edges instead of boxing each figure in. Two columns on mobile
   means the rule belongs on the left-hand cell of each row, not on every cell
   but the last. */
const RULE =
  "after:absolute after:inset-y-5 after:right-0 after:w-px after:bg-[linear-gradient(to_bottom,transparent,var(--color-charcoal-2),transparent)]";

function ruleFor(index: number) {
  if (index === STATS.length - 1) return "";
  // Even cells close a mobile row; odd cells only carry a rule once the grid
  // flattens to four across.
  return index % 2 === 0 ? RULE : `${RULE} after:hidden md:after:block`;
}

export function StatsBar() {
  return (
    <section
      aria-label="MOTORA at a glance"
      className="border-y border-charcoal-1 bg-[linear-gradient(180deg,#1a1a1f_0%,#0e0e11_100%)]"
    >
      <dl className="mx-auto grid max-w-7xl grid-cols-2 px-4 md:grid-cols-4 md:px-6">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={`relative px-2 py-7 text-center md:py-8 ${ruleFor(index)}`}
          >
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(198,255,61,0.12),transparent)]"
              />
              <dd
                data-figure
                className="relative font-heading text-[2.1rem] font-bold leading-none tracking-[-0.02em] text-pearl md:text-[2.5rem]"
              >
                {stat.value}
              </dd>
            </div>
            <dt className="mt-2.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pearl-muted">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
