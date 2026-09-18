"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Liquid-chrome hero shader: fractal noise fed through a domain warp, tinted
 * lime over obsidian. Full-viewport fill rate is the whole cost here, so:
 *
 *  - it never mounts on a phone, a low-memory device, or under
 *    prefers-reduced-motion. Those get the CSS mesh underneath instead,
 *    which is a real design, not a degraded one.
 *  - DPR is capped at 1.5. A fullscreen fragment shader at DPR 3 is the
 *    single most common way this pattern tanks LCP on mid-range Android.
 *  - the loop stops when the hero scrolls away or the tab is hidden.
 */

const VERTEX = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform float uFrequencyX;
uniform float uFrequencyY;
uniform float uExposure;
uniform vec2 uMouse;
varying vec2 vUv;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,
                       -0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = (vUv - 0.5) * uResolution.xy / uResolution.y;
  vec2 mouseOffset = (uMouse - 0.5) * 0.3;

  // Domain warp: each noise octave is displaced by the one before it, which
  // is what produces flowing ribbons instead of static cloud.
  float t = uTime * 0.15;
  float n1 = snoise(uv * vec2(uFrequencyX, uFrequencyY) + mouseOffset + t);
  float n2 = snoise(uv * vec2(uFrequencyX, uFrequencyY) * 1.7 - t * 0.8 + n1);
  float n3 = snoise(uv * vec2(uFrequencyX, uFrequencyY) * 0.6 + n2 * uAmplitude);

  float intensity = smoothstep(-0.3, 0.9, n3);

  // Obsidian floor rather than black: the ribbons have to sit on the page's
  // own ground colour or the hero reads as a cut-out panel.
  vec3 ground = vec3(0.043, 0.043, 0.051);
  vec3 color = mix(ground, uBaseColor, intensity);
  color = mix(color, vec3(1.0), pow(intensity, 6.0) * 0.4);

  // Exposure is the contrast lever. Text legibility over this is a hard
  // requirement, so the whole field is scaled down rather than trusting the
  // scrim alone to rescue it.
  gl_FragColor = vec4(color * uExposure, 1.0);
}`;

export type LiquidChromeProps = {
  /** 0-1 RGB. Defaults to MOTORA lime #C6FF3D. */
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  /** Global brightness multiplier; the contrast lever. */
  exposure?: number;
  interactive?: boolean;
  className?: string;
};

export function LiquidChrome({
  baseColor = [0.776, 1.0, 0.239],
  speed = 0.18,
  amplitude = 0.5,
  frequencyX = 2.5,
  frequencyY = 2.0,
  exposure = 0.38,
  interactive = true,
  className = "",
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Read through refs so a caller passing an inline array literal does not
  // retrigger the effect on every render and rebuild the GL context.
  const opts = useRef({
    baseColor,
    speed,
    amplitude,
    frequencyX,
    frequencyY,
    exposure,
    interactive,
  });
  // Synced in an effect, not during render: the GL loop reads these every
  // frame, but writing a ref mid-render is a correctness trap.
  useEffect(() => {
    opts.current = {
      baseColor,
      speed,
      amplitude,
      frequencyX,
      frequencyY,
      exposure,
      interactive,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deviceMemory = (
      navigator as Navigator & { deviceMemory?: number }
    ).deviceMemory;

    // Capability gate. Anything that fails here keeps the CSS mesh, which is
    // already a finished background rather than a placeholder.
    const capable =
      !reduced.matches &&
      window.innerWidth >= 768 &&
      (deviceMemory === undefined || deviceMemory > 4);
    if (!capable) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ antialias: false, preserveDrawingBuffer: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    } catch {
      return; // No WebGL: the mesh underneath stands in.
    }

    const gl = renderer.gl;
    gl.clearColor(0.043, 0.043, 0.051, 1);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const o = opts.current;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uBaseColor: { value: o.baseColor },
        uAmplitude: { value: o.amplitude },
        uFrequencyX: { value: o.frequencyX },
        uFrequencyY: { value: o.frequencyY },
        uExposure: { value: o.exposure },
        uMouse: { value: [0.5, 0.5] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h, w / h];
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive) return;
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = false;

    const draw = (now: number) => {
      program.uniforms.uTime.value = now * 0.001 * opts.current.speed;
      renderer.render({ scene: mesh });
      if (running) raf = requestAnimationFrame(draw);
    };

    const run = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    // Never burn GPU on a hero nobody is looking at.
    const io = new IntersectionObserver(
      ([entry]) => run(entry.isIntersecting && !document.hidden),
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => run(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    renderer.render({ scene: mesh }); // first paint

    return () => {
      run(false);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    />
  );
}
