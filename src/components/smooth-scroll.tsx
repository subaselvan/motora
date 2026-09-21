"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll, the single thing every reference site had in common.
 *
 * All five studied — boc.studio, noho.ink, aspensearch, warmnfuzzy,
 * unitedcarriers — run Lenis. It is most of why premium sites feel
 * "heavy": native wheel scrolling is instantaneous and a little cheap,
 * where an interpolated scroll gives the page mass.
 *
 * Two things this must get right or it actively harms the site:
 *
 *  1. ScrollTrigger has to be driven by Lenis rather than by the native
 *     scroll event, or every scrubbed animation on the page lags a frame
 *     behind the content it is pinned to. Hence the scroll -> update
 *     wiring and running Lenis from GSAP's ticker instead of its own RAF,
 *     so there is one clock rather than two fighting.
 *
 *  2. It is disabled entirely under prefers-reduced-motion. Hijacking
 *     scroll is exactly the kind of motion that triggers vestibular
 *     symptoms, and it is not decoration a user can look away from.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // ~1s to settle. Below about 0.8 it stops reading as smoothing and
      // starts reading as lag on the input.
      duration: 1.05,
      // Expo-out: fast commitment, long settle — the same shape as the
      // trust-ring count-up, so the whole page decelerates alike.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch is deliberately untouched. Mobile browsers already have
      // momentum scrolling, and overriding it fights the OS and breaks
      // pull-to-refresh.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP's lag smoothing would let the ticker skip time after a stall,
    // which desyncs Lenis from the real scroll position.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(1000, 16);
      lenis.destroy();
    };
  }, []);

  return null;
}
