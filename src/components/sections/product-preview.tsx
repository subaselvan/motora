import { Camera, Check, ShieldCheck } from "lucide-react";
import { SectionIntro } from "@/components/ui/section-intro";
import {
  VEHICLES,
  formatINR,
  type HeavyFarmVehicle,
} from "@/lib/vehicles";

/**
 * The product showing itself.
 *
 * This is the CRED and Linear move: a site with no photography leans on
 * its own interface instead of stock imagery. It is also the honest one
 * here — the three screens are the three claims the page makes most
 * loudly (every fee itemised, condition photographed at both ends, both
 * rates before you commit), so showing them is evidence rather than
 * decoration.
 *
 * Rendered as real markup, not images: it stays sharp at any density,
 * costs no asset pipeline, and the figures come from the same
 * vehicles.ts the cards use, so a rate can never drift out of sync with
 * the rest of the page.
 */
const RIDE = VEHICLES.find((v) => v.slug === "royal-enfield-classic-350")!;
/** Predicate rather than a cast: the operator rate only exists on the
 *  Heavy & Farm shape, and narrowing on `track` is what proves it. */
const HEAVY = VEHICLES.find(
  (v): v is HeavyFarmVehicle =>
    v.slug === "jcb-3dx-super" && v.track === "heavy-farm"
)!;
const DAYS = 3;

function Phone({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure data-reveal-item className="flex flex-col">
      <div className="phone-frame">
        <div className="phone-screen">{children}</div>
      </div>
      <figcaption className="mt-5">
        <p className="font-heading text-sm font-semibold text-pearl">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-pearl-muted">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}

function ScreenHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-charcoal-1 px-4 py-3 font-body text-[0.65rem] font-medium uppercase tracking-[0.16em] text-pearl-muted">
      {children}
    </p>
  );
}

export function ProductPreview() {
  return (
    <section
      aria-labelledby="preview-heading"
      className="border-t border-charcoal-1"
    >
      <div
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index="05"
          kicker="The product"
          headingId="preview-heading"
          heading="Three screens that are the whole argument"
          lede="Every promise on this page resolves to something the interface actually does. These are those three places."
        />

        <div
          data-reveal-group
          className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8"
        >
          {/* ── 1. Itemised price ─────────────────────────────── */}
          <Phone
            label="Every fee, before you commit"
            caption="Conditional charges are named even when they do not apply. Nothing new appears at checkout."
          >
            <ScreenHeader>Booking summary</ScreenHeader>
            <div className="px-4 py-3">
              <p className="font-heading text-sm font-semibold text-pearl">
                {RIDE.brand} {RIDE.model}
              </p>
              <p className="mt-0.5 text-xs text-pearl-muted">
                {RIDE.city} · {DAYS} days
              </p>
            </div>

            <dl className="space-y-2.5 px-4 pb-3 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-pearl-dim">
                  {DAYS} days × {formatINR(RIDE.perDay)}
                </dt>
                <dd data-figure className="tabular-nums text-pearl">
                  {formatINR(RIDE.perDay * DAYS)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-pearl-dim">Delivery</dt>
                <dd data-figure className="tabular-nums text-pearl">
                  {formatINR(250)}
                </dd>
              </div>
            </dl>

            <div className="flex justify-between gap-3 border-y border-charcoal-1 px-4 py-3">
              <p className="text-xs font-medium text-pearl">Due today</p>
              <p
                data-figure
                className="data-primary font-heading text-sm font-bold tabular-nums text-lime"
              >
                {formatINR(RIDE.perDay * DAYS + 250)}
              </p>
            </div>

            {/* Named without amounts: the values are an open item, and
                inventing one here would be inventing policy. */}
            <div className="px-4 py-3">
              <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.14em] text-pearl-muted">
                Only if it happens
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-pearl-muted">
                <li className="flex justify-between gap-3">
                  <span>Late return</span>
                  <span className="text-pearl-dim">per 10 min</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Fuel shortfall</span>
                  <span className="text-pearl-dim">at return</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Refundable deposit</span>
                  <span className="text-pearl-dim">by category</span>
                </li>
              </ul>
            </div>
          </Phone>

          {/* ── 2. Photo check-in ─────────────────────────────── */}
          <Phone
            label="Condition, photographed"
            caption="Timestamped at pickup and return, mandatory at both ends. Evidence rather than recollection."
          >
            <ScreenHeader>Check-in · 3 of 4</ScreenHeader>
            <div className="grid grid-cols-2 gap-2 p-4">
              {["Front", "Rear", "Left", "Right"].map((side, i) => {
                const done = i < 3;
                return (
                  <div
                    key={side}
                    className={[
                      "relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border",
                      done
                        ? "border-lime/40 bg-[radial-gradient(120%_90%_at_30%_0%,var(--color-obsidian-lighter),var(--color-obsidian))]"
                        : "border-dashed border-charcoal-2 bg-obsidian-sunken",
                    ].join(" ")}
                  >
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2 py-1.5">
                      <span className="text-[0.6rem] text-pearl-dim">
                        {side}
                      </span>
                      {done ? (
                        <Check
                          size={11}
                          aria-hidden="true"
                          className="text-lime"
                        />
                      ) : (
                        <Camera
                          size={11}
                          aria-hidden="true"
                          className="text-pearl-muted"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mx-4 mb-4 rounded-[var(--radius-sm)] border border-charcoal-1 bg-obsidian-sunken px-3 py-2 text-[0.65rem] leading-relaxed text-pearl-muted">
              Captured 09:14, 21 Sep · attached to booking
            </p>
          </Phone>

          {/* ── 3. Dual rate ──────────────────────────────────── */}
          <Phone
            label="Both rates, before you choose"
            caption="Self-drive or with an operator, priced side by side. No machine is substituted on the day."
          >
            <ScreenHeader>Choose your mode</ScreenHeader>
            <div className="px-4 py-3">
              <p className="font-heading text-sm font-semibold text-pearl">
                {HEAVY.brand} {HEAVY.model}
              </p>
            </div>

            <div className="space-y-2 px-4 pb-4">
              <div className="rounded-[var(--radius-sm)] border border-lime/50 bg-lime/[0.07] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-pearl">
                    Self-drive
                  </span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime">
                    <Check
                      size={10}
                      aria-hidden="true"
                      className="text-lime-ink"
                    />
                  </span>
                </div>
                <p
                  data-figure
                  className="data-primary mt-1 font-heading text-base font-bold tabular-nums text-lime"
                >
                  {formatINR(HEAVY.perDay)}
                  <span className="ml-1 font-body text-[0.6rem] font-normal text-pearl-muted">
                    /day
                  </span>
                </p>
                <p className="mt-1 text-[0.6rem] text-pearl-muted">
                  Commercial licence required
                </p>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-charcoal-2 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-pearl-dim">
                    With operator
                  </span>
                  <span className="h-4 w-4 rounded-full border border-charcoal-3" />
                </div>
                <p
                  data-figure
                  className="mt-1 font-heading text-base font-bold tabular-nums text-pearl"
                >
                  {formatINR(HEAVY.perDayWithOperator)}
                  <span className="ml-1 font-body text-[0.6rem] font-normal text-pearl-muted">
                    /day
                  </span>
                </p>
                <p className="mt-1 text-[0.6rem] text-pearl-muted">
                  No licence of your own needed
                </p>
              </div>
            </div>

            <p className="mx-4 mb-4 flex items-center gap-1.5 text-[0.65rem] text-pearl-muted">
              <ShieldCheck
                size={11}
                aria-hidden="true"
                className="shrink-0 text-lime"
              />
              RTO registered · rates locked at booking
            </p>
          </Phone>
        </div>

        <p className="mt-10 text-xs text-pearl-muted">
          Interface preview built from the demo inventory on this page. Rates
          shown are the same ones the cards use.
        </p>
      </div>
    </section>
  );
}
