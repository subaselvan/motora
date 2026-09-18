"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientField } from "@/components/ui/ambient-field";

gsap.registerPlugin(ScrollTrigger);

/**
 * The page's single light source, fixed to the viewport so every section
 * scrolls through one continuous space rather than past a stack of
 * separately-lit boxes.
 *
 * Two layers, deliberately: the CSS field always renders, and the shader
 * paints over it on capable devices. Phones, low-memory devices and
 * reduced-motion users keep the CSS field, which is a finished background
 * in its own right rather than a fallback that looks like something
 * failed to load.
 */
export function AmbientBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );
    if (reduced.matches) return;

    const layers = gsap.utils.toArray<HTMLElement>(
      "[data-parallax-layer]",
      backdrop
    );
    const cleanups: Array<() => void> = [];

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: ({ progress }) => {
        layers.forEach((layer, index) => {
          const depth = Number(layer.dataset.parallaxDepth ?? 1);
          gsap.set(layer, {
            yPercent: -progress * depth,
            rotate: progress * (index % 2 === 0 ? 1.2 : -0.8),
          });
        });
      },
    });
    cleanups.push(() => scrollTrigger.kill());

    if (finePointer.matches) {
      const aura = backdrop.querySelector<HTMLElement>("[data-pointer-aura]");
      if (aura) {
        const xTo = gsap.quickTo(aura, "x", {
          duration: 1.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(aura, "y", {
          duration: 1.4,
          ease: "power3.out",
        });
        const onPointerMove = (event: PointerEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * 28);
          yTo((event.clientY / window.innerHeight - 0.5) * 20);
        };
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        cleanups.push(() =>
          window.removeEventListener("pointermove", onPointerMove)
        );
      }
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div ref={backdropRef} aria-hidden="true" className="ambient-field">
      <span
        data-parallax-depth="2.5"
        data-parallax-layer
        className="aura-glow"
        data-pointer-aura
      />
      <span data-parallax-depth="1.4" data-parallax-layer className="mesh-gradient" />
      <span data-parallax-depth="4" data-parallax-layer className="wireframe wireframe-one" />
      <span data-parallax-depth="2.8" data-parallax-layer className="wireframe wireframe-two" />
      <span className="emission-core" />
      <span className="emission-bounce" />
      <AmbientField />
      <span className="emission-grain" />
    </div>
  );
}
