"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/vehicles";

/** Named rather than a function prop: this renders inside Server
 *  Components, and a function cannot cross the client boundary. */
const FORMATTERS = {
  inr: formatINR,
  plain: (n: number) => n.toLocaleString("en-IN"),
} as const;

/**
 * Counts a figure up when it first enters view.
 *
 * Reserved for figures the page wants you to weigh — earnings, scores —
 * not for every number on screen. A price that animates every time a rail
 * scrolls past would read as a slot machine, which is the opposite of the
 * trust this site is arguing for.
 *
 * Matches the trust ring's easing (exponential ease-out) so the two read
 * as the same gesture: fast commitment, settled landing.
 */
export function CountUp({
  value,
  format = "inr",
  durationMs = 1200,
  className,
}: {
  value: number;
  format?: keyof typeof FORMATTERS;
  durationMs?: number;
  className?: string;
}) {
  const formatter = FORMATTERS[format];
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
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

        const start = performance.now();
        setShown(0);

        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setShown(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} data-figure className={className}>
      {formatter(shown)}
    </span>
  );
}
