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
 *   field    procedural neon texture + light source   (shader, opaque pass)
 *   mesh     low-contrast lime/orange fields          (deepest, slowest)
 *   contour  concentric rings centred on the source   (mid)
 *   wire     muted schematic grid                     (nearest, fastest)
 *   aura     glow seated behind the hero ring, pointer-reactive
 *   grain    static dither
 *
 * Parallax is one scrubbed ScrollTrigger across the whole document driving
 * a different translate on each layer. Because the container is fixed, the
 * layers are oversized (see .bg-layer in globals.css) so the travel never
 * exposes an edge. The same progress value feeds the shader, so the GPU
 * layer and the DOM layers move as one scene rather than two systems.
 *
 * Reduced motion: no parallax, no pointer tracking, layers hold their
 * designed rest composition, and the shader does not mount at all.
 */
export function AmbientBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(root);
      const mesh = q(".bg-mesh");
      const contour = q(".bg-contour");
      const aura = q(".bg-aura");

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // body, not documentElement: html's bounding rect is the viewport
          // (820px against a 6830px body), so start and end resolve to the
          // same scroll position and the trigger never moves. Measured.
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
        .to(contour, { yPercent: -8, rotation: -1, force3D: true }, 0)
        // The aura tracks the hero up and off the page: light should leave
        // with the thing that was emitting it.
        .to(aura, { yPercent: -70, opacity: 0.15, force3D: true }, 0);

      // Pointer parallax on the light only, and only for a real mouse —
      // on touch there is no hover state to respond to, and the listener
      // would just cost battery. The offset lives on an inner wrapper so
      // it cannot fight the timeline's transform on .bg-aura itself.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
      }
      const lamp = q(".bg-aura-pointer")[0];
      if (!lamp) return;

      const xTo = gsap.quickTo(lamp, "--pointer-x", {
        duration: 1.4,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(lamp, "--pointer-y", {
        duration: 1.4,
        ease: "power3.out",
      });

      const onPointerMove = (event: PointerEvent) => {
        xTo((event.clientX / window.innerWidth - 0.5) * 30);
        yTo((event.clientY / window.innerHeight - 0.5) * 22);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      return () => window.removeEventListener("pointermove", onPointerMove);
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className="ambient-field">
      {/* The shader is an opaque pass, so it goes first; anything meant to
          be seen on desktop composites over it. On phones it never mounts
          and the layers below sit directly on obsidian. */}
      <AmbientField progressRef={progress} />

      <div className="bg-layer bg-mesh">
        <span className="bg-mesh-a" />
        <span className="bg-mesh-b" />
        <span className="bg-mesh-c" />
      </div>

      <div className="bg-layer bg-contour" />

      <div className="bg-layer bg-aura">
        <div className="bg-aura-pointer">
          <span className="emission-core" />
          <span className="emission-bounce" />
        </div>
      </div>

      <span className="emission-grain" />
    </div>
  );
}
