"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AmbientField } from "@/components/ui/ambient-field";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The page's background, as a stack of layers at different depths, fixed to
 * the viewport so every section scrolls through one continuous space.
 *
 * Back to front:
 *   mesh     low-contrast lime/orange fields          (deepest, slowest)
 *   field    procedural neon texture + light source   (shader, mid depth)
 *   wire     muted schematic grid                     (nearest, fastest)
 *   aura     glow seated behind the hero ring
 *   grain    static dither
 *
 * Parallax is one scrubbed ScrollTrigger across the whole document driving
 * a different translate on each layer. Because the container is fixed, the
 * layers are oversized (see .bg-layer in globals.css) so the travel never
 * exposes an edge. The same progress value feeds the shader, so the GPU
 * layer and the DOM layers move as one scene rather than two systems.
 *
 * Reduced motion: no parallax at all, layers hold their designed rest
 * composition, and the shader freezes its own animation.
 */
export function AmbientBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(root);
      const mesh = q(".bg-mesh");
      const wire = q(".bg-wire");
      const aura = q(".bg-aura");

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // body, not documentElement: html's bounding rect is the viewport
          // (820px here against a 6830px body), which made start and end
          // resolve to the same scroll position and the trigger never moved.
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      })
        // Depth is expressed as travel: the further back a layer sits, the
        // less it moves for the same scroll. Percentages are of the layer's
        // own oversized box.
        .to(mesh, { yPercent: -4, force3D: true }, 0)
        .to(wire, { yPercent: -11, rotation: 1.5, force3D: true }, 0)
        // The aura tracks the hero up and off the page: light should leave
        // with the thing that was emitting it.
        .to(aura, { yPercent: -70, opacity: 0.15, force3D: true }, 0);
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className="ambient-field">
      {/* The shader is an opaque pass, so it goes first; anything meant to
          be seen on desktop composites over it. On phones it never mounts
          and the mesh sits directly on obsidian. */}
      <AmbientField progressRef={progress} />

      <div className="bg-layer bg-mesh">
        <span className="bg-mesh-a" />
        <span className="bg-mesh-b" />
        <span className="bg-mesh-c" />
      </div>

      <div className="bg-layer bg-wire" />

      <div className="bg-layer bg-aura">
        <span className="emission-core" />
        <span className="emission-bounce" />
      </div>

      <span className="emission-grain" />
    </div>
  );
}
