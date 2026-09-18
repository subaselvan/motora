"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Volumetric emission field. One light source, placed behind the hero's
 * trust ring, scattering through haze and falling off into obsidian.
 *
 * The rule this implements, from docs/research: the accent is a light
 * source, not a highlight colour. So the shader models a source and its
 * falloff rather than painting green shapes — that distinction is the
 * whole difference between this reading as premium or as the stock
 * acid-green-on-black treatment the research flags as a generated tell.
 *
 * Full-viewport fill rate is the entire cost, so:
 *  - it never mounts on a phone, a low-memory device, or under
 *    prefers-reduced-motion. Those keep the CSS field underneath, which
 *    is a finished design rather than a degraded one.
 *  - DPR is capped at 1.5. A fullscreen fragment shader at DPR 3 is the
 *    single most common way this pattern tanks LCP on mid-range Android.
 *  - the loop stops when the tab is hidden.
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
uniform vec2 uSource;
uniform vec3 uLight;
uniform vec3 uBounce;
uniform float uExposure;
uniform float uScroll;
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

// Three octaves is enough to read as haze; a fourth costs fill rate the
// mid-range Android budget does not have.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * aspect;

  // Scroll walks the source upward and dims it, so descending the page
  // reads as moving away from the light rather than as sections changing
  // their own background.
  vec2 srcUv = uSource + vec2(0.0, uScroll * 0.42);
  vec2 src = (srcUv - 0.5) * aspect;

  float d = length(p - src);

  // Steep falloff on purpose. An earlier, gentler curve lifted the whole
  // frame to roughly rgb(24,24,16) at its darkest corner — measured — so
  // nothing on the page was ever actually obsidian and the result read as
  // green wash rather than as light. The reference systems run ~85% true
  // near-black with accent confined to a small share of the frame, and
  // that ratio is the thing being protected here.
  float fall = 1.0 / (1.0 + 34.0 * d * d);

  float t = uTime * 0.05;
  float haze = fbm(p * 1.7 + vec2(t, -t * 0.66));

  // Scatter is modulated light, so the noise can only ever brighten where
  // light already reaches. That is what keeps it reading as air rather
  // than as a texture laid on top.
  float scatter = fall * (0.72 + 0.46 * haze);

  // Tight directional lobe. Real sources are not perfectly isotropic, but
  // this has to die well inside the frame or it becomes ambient lift.
  float lobe = pow(max(0.0, 1.0 - d * 1.7), 3.0);
  scatter += lobe * 0.16 * (0.6 + 0.4 * haze);

  // Second-order bounce filling the opposite corner. Dim on purpose: it
  // exists so the frame is not lit from exactly one place.
  vec2 bouncePos = (vec2(0.06, 0.08) - 0.5) * aspect;
  float bd = length(p - bouncePos);
  float bounce = 1.0 / (1.0 + 34.0 * bd * bd);

  vec3 ground = vec3(0.043, 0.043, 0.051);
  vec3 color = ground;
  color += uLight * scatter * uExposure;
  color += uBounce * bounce * uExposure * 0.13;

  // Specular bloom only in the very core, where a real source would clip.
  color += vec3(1.0) * pow(max(0.0, fall - 0.72), 2.0) * 0.32;

  gl_FragColor = vec4(color, 1.0);
}`;

export type AmbientFieldProps = {
  /** Light position in 0-1 viewport space. Defaults behind the hero ring. */
  source?: [number, number];
  /** 0-1 RGB. Defaults to MOTORA lime #C6FF3D. */
  light?: [number, number, number];
  /** 0-1 RGB. Defaults to MOTORA orange #FF7A1A. */
  bounce?: [number, number, number];
  /** Global brightness multiplier; the contrast lever. */
  exposure?: number;
  className?: string;
};

export function AmbientField({
  // GL's UV origin is bottom-left, so y here counts up from the bottom of
  // the viewport: 0.74 places the source behind the hero ring at upper
  // right. Reading this as a CSS top-left coordinate is how it originally
  // ended up lighting the wrong corner.
  source = [0.76, 0.74],
  light = [0.776, 1.0, 0.239],
  bounce = [1.0, 0.478, 0.102],
  exposure = 0.46,
  className = "",
}: AmbientFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const opts = useRef({ source, light, bounce, exposure });
  // Synced in an effect, not during render: the GL loop reads these every
  // frame, but writing a ref mid-render is a correctness trap.
  useEffect(() => {
    opts.current = { source, light, bounce, exposure };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;

    // Capability gate. Anything failing here keeps the CSS field, which is
    // already a finished background rather than a placeholder.
    const capable =
      !reduced.matches &&
      window.innerWidth >= 768 &&
      (deviceMemory === undefined || deviceMemory > 4);
    if (!capable) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        antialias: false,
        preserveDrawingBuffer: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return; // No WebGL: the CSS field underneath stands in.
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
        uSource: { value: o.source },
        uLight: { value: o.light },
        uBounce: { value: o.bounce },
        uExposure: { value: o.exposure },
        uScroll: { value: 0 },
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

    let scroll = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let running = false;

    const draw = (now: number) => {
      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uScroll.value = scroll;
      program.uniforms.uExposure.value = opts.current.exposure;
      renderer.render({ scene: mesh });
      if (running) raf = requestAnimationFrame(draw);
    };

    const run = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    const onVisibility = () => run(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    run(!document.hidden);

    return () => {
      run(false);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
