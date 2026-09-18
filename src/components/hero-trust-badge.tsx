import { ShieldCheck } from "lucide-react";
import { DEMO_TRUST_SCORE } from "@/lib/vehicles";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The hero's floating proof point. Deliberately small: the full ledger lives
 * in its own section further down, and CLAUDE.md allows the score to be loud
 * exactly once on the page.
 */
export function HeroTrustBadge({ className }: { className?: string }) {
  const dashoffset = CIRCUMFERENCE * (1 - DEMO_TRUST_SCORE / 100);

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-[var(--radius-md)] border border-white/12 bg-[rgba(18,18,21,0.72)] px-4 py-3 shadow-[var(--elev)] backdrop-blur-md",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative h-11 w-11 shrink-0">
        <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90" aria-hidden="true">
          <circle
            cx="22"
            cy="22"
            r={RADIUS}
            fill="none"
            stroke="var(--color-charcoal-2)"
            strokeWidth="3"
          />
          <circle
            cx="22"
            cy="22"
            r={RADIUS}
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <span
          data-figure
          className="absolute inset-0 flex items-center justify-center font-heading text-xs font-bold text-lime"
        >
          {DEMO_TRUST_SCORE}
        </span>
      </div>

      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-heading text-sm font-medium text-pearl">
          <ShieldCheck size={13} aria-hidden="true" className="text-lime" />
          Sample trust score
        </p>
        <p className="mt-0.5 text-xs text-pearl-muted">
          Unlocks goods vehicles and up
        </p>
      </div>
    </div>
  );
}
