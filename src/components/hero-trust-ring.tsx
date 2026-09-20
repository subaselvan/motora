"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DEMO_TRUST_SCORE, TRUST_TIERS } from "@/lib/vehicles";

const SIZE = 320;
const C = SIZE / 2;
const R = 128;
const TICK_R = 148;
const CIRC = 2 * Math.PI * R;

/** -90deg so 0 sits at twelve o'clock and the arc reads like a gauge. */
function pointAt(score: number, radius: number) {
  const angle = (score / 100) * 2 * Math.PI - Math.PI / 2;
  return { x: C + radius * Math.cos(angle), y: C + radius * Math.sin(angle) };
}

const NEXT_TIER = TRUST_TIERS.find((t) => t.score > DEMO_TRUST_SCORE);

/**
 * The hero's subject. Nothing in the competitor set leads with a data
 * object, which is exactly why this is the page's anchor rather than the
 * stock photograph every rental site already has.
 *
 * It also reads as the light source the rest of the page is lit by, so
 * the lime in the background has somewhere to have come from.
 */
/**
 * Top-down go-kart, nose pointing along +x so a rotation of 0deg faces the
 * direction of travel at twelve o'clock. Drawn at roughly 26x20 units and
 * placed by the caller, which owns position and heading.
 *
 * The kart rather than a plain dot because MOTORA's mark is a go-kart and
 * the promise is "rent anything that moves" — the one element on the page
 * that literally moves should be the vehicle, not an abstract indicator.
 */
function KartGlyph() {
  return (
    <g>
      {/* Tyres first so the chassis overlaps them. */}
      <g fill="var(--color-obsidian)" stroke="var(--color-lime)" strokeWidth="1">
        <rect x="-11" y="-11.5" width="7.5" height="5" rx="2" />
        <rect x="-11" y="6.5" width="7.5" height="5" rx="2" />
        <rect x="4" y="-10" width="6.5" height="4.5" rx="2" />
        <rect x="4" y="5.5" width="6.5" height="4.5" rx="2" />
      </g>
      {/* Chassis: tapered nose to the right, wide rear deck. */}
      <path
        d="M-12.5 -5.5 L1 -6.5 L13 -2.6 L13 2.6 L1 6.5 L-12.5 5.5 Z"
        fill="var(--color-lime)"
      />
      {/* Cockpit, punched out of the chassis so the kart reads at 26px. */}
      <circle cx="-3.5" cy="0" r="3.4" fill="var(--color-obsidian)" />
    </g>
  );
}

export function HeroTrustRing() {
  const [score, setScore] = useState(DEMO_TRUST_SCORE);
  // Unrounded twin of `score`. The readout wants integers; the kart wants
  // sub-degree precision or it visibly judders around the arc.
  const [progress, setProgress] = useState(DEMO_TRUST_SCORE);
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

        // Longer than the old 1200ms: the kart now has to read as driving a
        // lap, and at 1.2s it teleported rather than travelled.
        const duration = 2100;
        const start = performance.now();
        setScore(0);
        setProgress(0);

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // Exponential ease-out: fast commitment, settled landing. Reads as
          // a kart accelerating away and braking into its final position.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setProgress(DEMO_TRUST_SCORE * eased);
          setScore(Math.round(DEMO_TRUST_SCORE * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Both driven by the unrounded value so the kart and the arc head stay
  // welded together frame to frame.
  const head = pointAt(progress, R);
  // Tangent of a circle traversed clockwise from twelve o'clock: the
  // heading in degrees is just the progress around the lap.
  const heading = (progress / 100) * 360;
  const remaining = NEXT_TIER ? NEXT_TIER.score - DEMO_TRUST_SCORE : 0;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[26rem]">
      {/* The glow this object throws. Sits behind the ring so the lime in
          the page background reads as light that came from here. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.13),rgba(198,255,61,0.035)_55%,transparent_78%)]"
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative w-full"
        role="img"
        aria-label={`Sample trust record: ${DEMO_TRUST_SCORE} out of 100. Unlocked through goods vehicles.`}
      >
        <defs>
          <linearGradient id="ring-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-lime-active)" />
            <stop offset="100%" stopColor="var(--color-lime)" />
          </linearGradient>
          <filter id="ring-bloom" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ring-well">
            <stop
              offset="0%"
              stopColor="var(--color-obsidian)"
              stopOpacity="0.92"
            />
            <stop
              offset="62%"
              stopColor="var(--color-obsidian)"
              stopOpacity="0.86"
            />
            <stop
              offset="100%"
              stopColor="var(--color-obsidian)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* The interior is shadowed by the ring that encloses it. This is
            load-bearing, not decorative: measured against the lit field,
            pearl-muted inside the ring scored 2.61:1 and pearl-dim 4.40:1,
            both under the 4.5 AA floor for small text. Dropping the well in
            returns them to roughly 5.2:1 and 7.5:1 while keeping the three
            type weights distinct — raising every label to full pearl would
            have passed too, but by flattening the hierarchy. */}
        <circle cx={C} cy={C} r={R - 4} fill="url(#ring-well)" />

        {/* Translucent rather than a charcoal fill: against the lit side of
            the frame an opaque dark stroke reads as a bar laid over the
            glow, where a tinted groove reads as unlit track. */}
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="rgba(244, 241, 232, 0.11)"
          strokeWidth="10"
        />

        {/* Tier ticks. Each is a real threshold from TRUST_TIERS, which is
            what separates this from a decorative progress ring. */}
        {TRUST_TIERS.map((tier) => {
          const inner = pointAt(tier.score, TICK_R - 9);
          const outer = pointAt(tier.score, TICK_R);
          const reached = DEMO_TRUST_SCORE >= tier.score;
          return (
            <line
              key={tier.category}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={
                reached ? "var(--color-lime)" : "var(--color-charcoal-3)"
              }
              strokeWidth="2"
              strokeLinecap="round"
              opacity={reached ? 0.85 : 0.5}
            />
          );
        })}

        {/* The locked threshold, marked in orange so the thing you have not
            earned yet is legible as a target rather than a failure. */}
        {NEXT_TIER && (
          <circle
            cx={pointAt(NEXT_TIER.score, R).x}
            cy={pointAt(NEXT_TIER.score, R).y}
            r="5"
            fill="var(--color-obsidian)"
            stroke="var(--color-orange)"
            strokeWidth="2.5"
          />
        )}

        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="url(#ring-arc)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress / 100)}
          transform={`rotate(-90 ${C} ${C})`}
        />

        {/* The kart leads the arc it is drawing. Bloom sits underneath as a
            separate disc rather than filtering the kart itself — blurring
            the glyph would dissolve the wheels and cockpit that make it
            read as a vehicle at this size. */}
        <circle
          cx={head.x}
          cy={head.y}
          r="7"
          fill="var(--color-lime)"
          opacity="0.32"
          filter="url(#ring-bloom)"
        />
        {/* 1.5x: at native scale the wheels and cockpit collapsed into an
            indistinct blob. This is the smallest size at which it still
            reads as a kart rather than as a marker. */}
        <g
          transform={`translate(${head.x} ${head.y}) rotate(${heading}) scale(1.5)`}
        >
          <KartGlyph />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.18em] text-pearl-muted">
          Sample trust record
        </p>
        <p
          data-figure
          className="mt-1 font-heading font-bold leading-none tracking-[-0.03em] text-pearl"
          style={{ fontSize: "var(--text-figure)" }}
        >
          {score}
          <span className="ml-1 font-body text-base font-normal text-pearl-muted">
            /100
          </span>
        </p>
        <p className="mt-2 max-w-[11rem] text-xs leading-relaxed text-pearl-dim">
          Unlocked through goods vehicles
        </p>
      </div>

      {/* CRED's walled-garden framing: lead with what the next tier opens,
          not with what is currently withheld. */}
      {NEXT_TIER && (
        <div className="mt-5 flex items-center justify-center gap-2.5 rounded-[var(--radius-md)] border border-orange/30 bg-orange/[0.07] px-4 py-2.5">
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="shrink-0 text-orange"
          />
          <p className="text-sm text-pearl-dim">
            <span data-figure className="font-medium text-orange">
              {remaining} points
            </span>{" "}
            to {NEXT_TIER.label.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}
