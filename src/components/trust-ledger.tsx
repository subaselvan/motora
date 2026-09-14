"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import {
  DEMO_TRUST_SCORE,
  TRUST_TIERS,
  type Category,
} from "@/lib/vehicles";

/**
 * The page's thesis as a working object: a score, and the ladder it unlocks.
 * Rows render in their final state, so the surface is complete before the
 * one authored animation runs over it.
 */
export function TrustLedger({ activeCategory }: { activeCategory: Category | null }) {
  const [score, setScore] = useState(DEMO_TRUST_SCORE);
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();
        setScore(0);

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // Exponential ease-out: fast commitment, settled landing.
          const eased = 1 - Math.pow(2, -10 * t);
          setScore(Math.round(DEMO_TRUST_SCORE * (t === 1 ? 1 : eased)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      /* Elevation 3 — the hero's focal panel. It sits over the 3D object, so
         it needs a near-opaque ground and real cast depth to stay legible. */
      className="overflow-hidden rounded-[var(--radius-md)] border border-charcoal-2 bg-obsidian-light shadow-[var(--elev-3)]"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-charcoal-1 px-5 py-4">
        <div>
          <h2 className="font-heading text-sm font-medium text-pearl">
            Sample trust record
          </h2>
          <p className="mt-0.5 text-xs text-pearl-muted">
            One score. Every category.
          </p>
        </div>
        <p
          data-figure
          aria-label={`Sample trust score ${DEMO_TRUST_SCORE} of 100`}
          className="font-heading text-4xl font-bold leading-none text-lime"
        >
          {score}
          <span className="ml-0.5 font-body text-sm font-normal text-pearl-muted">
            /100
          </span>
        </p>
      </div>

      <ul className="divide-y divide-charcoal-1">
        {TRUST_TIERS.map((tier) => {
          const unlocked = score >= tier.score;
          const active = activeCategory === tier.category;
          return (
            <li
              key={tier.category}
              data-active={active || undefined}
              className="flex items-center gap-3 px-5 py-2.5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[active]:bg-lime/[0.07]"
            >
              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)]",
                  unlocked
                    ? "bg-lime/15 text-lime"
                    : "bg-obsidian-lighter text-pearl-muted",
                ].join(" ")}
              >
                {unlocked ? (
                  <Check size={12} aria-hidden="true" />
                ) : (
                  <Lock size={11} aria-hidden="true" />
                )}
              </span>

              <span
                className={[
                  "flex-1 text-sm transition-colors duration-[var(--duration-base)]",
                  unlocked ? "text-pearl" : "text-pearl-muted",
                ].join(" ")}
              >
                {tier.label}
              </span>

              <span
                data-figure
                className={[
                  "tabular-nums transition-colors duration-[var(--duration-base)]",
                  unlocked
                    ? "text-xs text-pearl-muted"
                    : "text-sm font-medium text-orange",
                ].join(" ")}
              >
                {unlocked ? "Unlocked" : `${tier.score}`}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-charcoal-1 px-5 py-3 text-xs leading-relaxed text-pearl-muted">
        Return on time, document condition, communicate. The record follows you
        from a scooter to an excavator.
      </p>
    </div>
  );
}
