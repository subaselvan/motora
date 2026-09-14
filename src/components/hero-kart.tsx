"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's dimensional object: an actual go-kart built from real geometry,
 * lit by real lights, rotating in real 3D space. Not a shader backdrop and not
 * a 2D graphic — the brand mark is a go-kart badge, so the hero renders the
 * kart itself.
 *
 * Performance, because this page is demoed live:
 *  - three.js is dynamically imported, so it never enters the initial bundle
 *  - DPR capped at 1.75, antialias only above 1x
 *  - the frame loop stops when the hero scrolls away or the tab hides
 *  - prefers-reduced-motion renders one static frame and never loops
 *  - if WebGL is unavailable the component renders nothing and the CSS
 *    ground behind it stands in
 */
export function HeroKart({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: window.devicePixelRatio < 1.5,
          powerPreference: "high-performance",
        });
      } catch {
        return; // No WebGL — the CSS ground behind us is the fallback.
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      renderer.setClearAlpha(0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
      camera.position.set(2.8, 1.35, 3.5);
      camera.lookAt(0, 0.5, 0);

      /* ── Materials ─────────────────────────────────────────── */
      // Low metalness on purpose: there is no environment map in this scene,
      // and metallic surfaces without one simply take the colour of whatever
      // light hits them — which turned the whole chassis lime.
      const body = new THREE.MeshStandardMaterial({
        color: 0x33333d,
        metalness: 0.18,
        roughness: 0.42,
      });
      const shell = new THREE.MeshStandardMaterial({
        color: 0x26262e,
        metalness: 0.12,
        roughness: 0.55,
      });
      // Lime is an accent here, not a wash. Low emissive so the key light —
      // not the material — does the shaping.
      const lime = new THREE.MeshStandardMaterial({
        color: 0xc6ff3d,
        metalness: 0.3,
        roughness: 0.35,
        emissive: 0xc6ff3d,
        emissiveIntensity: 0.22,
      });
      const tyre = new THREE.MeshStandardMaterial({
        color: 0x0f0f12,
        metalness: 0.0,
        roughness: 0.95,
      });
      const chrome = new THREE.MeshStandardMaterial({
        color: 0xb4bac4,
        metalness: 0.45,
        roughness: 0.28,
      });

      const disposables: { dispose(): void }[] = [
        body,
        shell,
        lime,
        tyre,
        chrome,
      ];
      const geo = <T extends { dispose(): void }>(g: T) => {
        disposables.push(g);
        return g;
      };

      /* ── The kart. Faces +X; width runs along Z. ───────────── */
      const kart = new THREE.Group();

      const add = (
        g: import("three").BufferGeometry,
        m: import("three").Material,
        pos: [number, number, number],
        rot?: [number, number, number]
      ) => {
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(...pos);
        if (rot) mesh.rotation.set(...rot);
        kart.add(mesh);
        return mesh;
      };

      // Floor pan and main rails
      add(geo(new THREE.BoxGeometry(2.55, 0.07, 1.16)), body, [0, 0.33, 0]);
      add(geo(new THREE.BoxGeometry(2.62, 0.1, 0.1)), shell, [0, 0.29, 0.56]);
      add(geo(new THREE.BoxGeometry(2.62, 0.1, 0.1)), shell, [0, 0.29, -0.56]);

      // Nose cone + front wing
      const nose = add(geo(new THREE.BoxGeometry(0.62, 0.2, 0.86)), shell, [
        1.42, 0.42, 0,
      ]);
      nose.scale.set(1, 1, 0.72);
      add(geo(new THREE.BoxGeometry(0.13, 0.05, 1.3)), shell, [1.72, 0.34, 0]);
      // Lime reads only as thin wing endplates, not a full bar.
      add(geo(new THREE.BoxGeometry(0.15, 0.09, 0.06)), lime, [1.72, 0.37, 0.66]);
      add(geo(new THREE.BoxGeometry(0.15, 0.09, 0.06)), lime, [1.72, 0.37, -0.66]);

      // Side pods
      add(geo(new THREE.BoxGeometry(1.0, 0.26, 0.24)), shell, [0.1, 0.42, 0.66]);
      add(geo(new THREE.BoxGeometry(1.0, 0.26, 0.24)), shell, [0.1, 0.42, -0.66]);
      // Lime accent stripe down the left pod
      add(geo(new THREE.BoxGeometry(1.02, 0.05, 0.05)), lime, [0.1, 0.54, 0.78]);

      // Seat: base, backrest, and side bolsters
      add(geo(new THREE.BoxGeometry(0.66, 0.09, 0.6)), body, [-0.36, 0.42, 0]);
      add(geo(new THREE.BoxGeometry(0.1, 0.56, 0.6)), body, [-0.72, 0.66, 0], [
        0,
        0,
        0.22,
      ]);
      add(geo(new THREE.BoxGeometry(0.5, 0.26, 0.06)), body, [-0.4, 0.54, 0.3]);
      add(geo(new THREE.BoxGeometry(0.5, 0.26, 0.06)), body, [-0.4, 0.54, -0.3]);

      // Engine block + exhaust stack
      add(geo(new THREE.BoxGeometry(0.46, 0.42, 0.36)), shell, [
        -0.62, 0.56, 0.6,
      ]);
      add(
        geo(new THREE.CylinderGeometry(0.07, 0.09, 0.58, 14)),
        chrome,
        [-0.9, 0.78, 0.6],
        [0, 0, Math.PI / 2.6]
      );

      // Steering column + wheel
      add(
        geo(new THREE.CylinderGeometry(0.032, 0.032, 0.72, 10)),
        chrome,
        [0.42, 0.62, 0],
        [0, 0, -Math.PI / 4.6]
      );
      add(
        geo(new THREE.TorusGeometry(0.19, 0.032, 10, 26)),
        lime,
        [0.68, 0.87, 0],
        [0, Math.PI / 2, Math.PI / 3.4]
      );

      // Roll hoop behind the seat
      add(
        geo(new THREE.TorusGeometry(0.33, 0.034, 10, 28, Math.PI)),
        chrome,
        [-0.78, 0.92, 0],
        [Math.PI / 2, 0, 0]
      );

      // Wheels — axle runs along Z, so rotate the cylinder onto that axis.
      const makeWheel = (x: number, z: number, r: number, w: number) => {
        const g = new THREE.Group();
        const t = new THREE.Mesh(
          geo(new THREE.CylinderGeometry(r, r, w, 22)),
          tyre
        );
        t.rotation.x = Math.PI / 2;
        g.add(t);
        const hub = new THREE.Mesh(
          geo(new THREE.CylinderGeometry(r * 0.45, r * 0.45, w + 0.012, 16)),
          chrome
        );
        hub.rotation.x = Math.PI / 2;
        g.add(hub);
        g.position.set(x, r, z);
        kart.add(g);
        return g;
      };

      const wheels = [
        makeWheel(1.02, 0.72, 0.29, 0.22), // front left
        makeWheel(1.02, -0.72, 0.29, 0.22), // front right
        makeWheel(-0.86, 0.8, 0.36, 0.34), // rear left (wider)
        makeWheel(-0.86, -0.8, 0.36, 0.34), // rear right
      ];

      kart.rotation.y = -0.5;
      kart.position.y = -0.28;
      scene.add(kart);

      /* ── Lights ────────────────────────────────────────────── */
      // Hard white key does the modelling — it carves the form.
      const key = new THREE.DirectionalLight(0xffffff, 3.4);
      key.position.set(4.5, 6.5, 4);
      scene.add(key);

      // Soft fill on the camera side so the near flank isn't crushed to black.
      const fill = new THREE.DirectionalLight(0xdfe4ee, 0.85);
      fill.position.set(-1.5, 1.2, 4.5);
      scene.add(fill);

      // Lime rim from behind — a thin silhouette edge, not a colour wash.
      // Measured: at 3.4 it drowned the model, and even at 0.8 it turned the
      // upward-facing floor pan green at three-quarter angles, because that
      // pan is the largest surface pointing back at this light.
      const rim = new THREE.DirectionalLight(0xc6ff3d, 0.4);
      rim.position.set(-5.5, 2.4, -4.5);
      scene.add(rim);

      scene.add(new THREE.HemisphereLight(0x2a2d36, 0x08080b, 0.5));

      /* ── Motion ────────────────────────────────────────────── */
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

      const onPointerMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const start = performance.now();
      let raf = 0;
      let running = false;

      const draw = (now: number) => {
        const t = (now - start) / 1000;

        if (!reduced.matches) {
          kart.rotation.y = -0.5 + t * 0.17;
          kart.position.y = -0.28 + Math.sin(t * 0.85) * 0.035;
          for (const w of wheels) w.rotation.z = -t * 1.6;

          // Pointer parallax, eased — the lightweight interactive accent.
          pointer.x += (pointer.tx - pointer.x) * 0.045;
          pointer.y += (pointer.ty - pointer.y) * 0.045;
          camera.position.x = 2.8 + pointer.x * 0.42;
          camera.position.y = 1.35 - pointer.y * 0.26;
          camera.lookAt(0, 0.5, 0);
        }

        renderer.render(scene, camera);
        if (running && !reduced.matches) raf = requestAnimationFrame(draw);
      };

      const run = (on: boolean) => {
        if (on === running) return;
        running = on;
        if (on && !reduced.matches) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      };

      const io = new IntersectionObserver(
        ([entry]) => run(entry.isIntersecting && !document.hidden),
        { threshold: 0 }
      );
      io.observe(mount);

      const onVisibility = () => run(!document.hidden);
      document.addEventListener("visibilitychange", onVisibility);

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        requestAnimationFrame(draw);
      };
      window.addEventListener("resize", onResize);
      reduced.addEventListener("change", onResize);

      requestAnimationFrame(draw); // first paint, reduced-motion included

      teardown = () => {
        run(false);
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        reduced.removeEventListener("change", onResize);
        for (const d of disposables) d.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className={className} />;
}
