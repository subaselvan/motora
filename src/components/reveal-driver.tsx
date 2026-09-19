"use client";

import { useEffect } from "react";

/**
 * Drives every scroll-triggered entrance on the page from one observer.
 *
 * Two behaviours:
 *   [data-reveal]        one element, rises and fades on entry
 *   [data-reveal-group]  stagger its [data-reveal-item] children in sequence
 *
 * The group case exists because a rail of eight cards fading in together
 * reads as a block appearing, where the same cards 60ms apart read as the
 * rail being dealt out. The delay is written as an inline custom property
 * rather than a class so it works for any card count.
 *
 * IntersectionObserver rather than scroll-driven CSS, because a reveal
 * that only worked where animation-timeline is supported would leave
 * content permanently at opacity 0 everywhere else — a failure mode worth
 * more than the elegance of doing it in pure CSS.
 */
export function RevealDriver() {
  useEffect(() => {
    const singles = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const groups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-group]")
    );
    if (!singles.length && !groups.length) return;

    const items = (group: HTMLElement) =>
      Array.from(group.querySelectorAll<HTMLElement>("[data-reveal-item]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      singles.forEach((n) => n.setAttribute("data-revealed", ""));
      groups.forEach((g) =>
        items(g).forEach((n) => n.setAttribute("data-revealed", ""))
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          if (el.hasAttribute("data-reveal-group")) {
            items(el).forEach((child, i) => {
              // Capped: past about ten the tail of a long rail would still
              // be animating well after the reader has arrived.
              child.style.setProperty(
                "--item-delay",
                `${Math.min(i, 10) * 60}ms`
              );
              child.setAttribute("data-revealed", "");
            });
          } else {
            el.setAttribute("data-revealed", "");
          }

          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    singles.forEach((n) => observer.observe(n));
    groups.forEach((g) => observer.observe(g));
    return () => observer.disconnect();
  }, []);

  return null;
}
