"use client";

import { useEffect } from "react";

/**
 * Drives every [data-reveal] on the page from one observer.
 *
 * IntersectionObserver rather than scroll-driven CSS, because a reveal
 * that only works in browsers supporting animation-timeline would leave
 * content permanently at opacity 0 everywhere else — a failure mode worth
 * more than the elegance of doing it in pure CSS.
 */
export function RevealDriver() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.setAttribute("data-revealed", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return null;
}
