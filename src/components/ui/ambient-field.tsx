"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Procedural neon texture with one light source.
 *
 * Two things in one pass. The texture is domain-warped fractal noise — the
 * same mechanism as the earlier liquid-chrome ribbons, but tinted lime and
 * held well under the light so it reads as haze catching the glow, not as
 * paint. The source is the emission behind the hero ring, with steep
 * falloff so the frame stays obsidian away from it.
 *
 * The ribbons are lit BY the source: they brighten near it and fade with
 * it. That coupling is what stops this being two effects layered on top of
 * each other, and it is also what keeps the accent honest as a light
 * rather than a decorative wash, which the research names as the most
 * common "generated" tell on dark sites.
 *
 * Scroll progress arrives from the backdrop's ScrollTrigger through a ref,
 * so the GPU layer and the DOM parallax layers move as one scene.
 *
 * Full-viewport fill rate is the entire cost, so it never mounts on a
 * phone, a low-memory device, or under prefers-reduced-motion; DPR is
 * capped at 1.5; and the loop stops when the tab is hidden.
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
uniform float uTexture;
uniform float uProgress;
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

  // ── Light source ──────────────────────────────────────────────────
  // Scroll walks the source upward and dims it, so descending the page
  // reads as moving away from the light rather than as sections changing
  // their own background.
  vec2 srcUv = uSource + vec2(0.0, uProgress * 0.42);
  vec2 src = (srcUv - 0.5) * aspect;
  float d = length(p - src);

  // Steep on purpose: a gentler curve measured rgb(24,24,16) at the
  // frame's darkest corner, so nothing was ever actually obsidian.
  float fall = 1.0 / (1.0 + 34.0 * d * d);

  float t = uTime * 0.05;
  float haze = fbm(p * 1.7 + vec2(t, -t * 0.66));
  float scatter = fall * (0.72 + 0.46 * haze);

  float lobe = pow(max(0.0, 1.0 - d * 1.7), 3.0);
  scatter += lobe * 0.16 * (0.6 + 0.4 * haze);

  vec2 bouncePos = (vec2(0.06, 0.08) - 0.5) * aspect;
  float bd = length(p - bouncePos);
  float bounce = 1.0 / (1.0 + 34.0 * bd * bd);

  // ── Layered wave field ────────────────────────────────────────────
  // Three sheets at different depths rather than one flat ribbon field.
  // Each is the same domain-warped noise sampled at its own scale, speed
  // and parallax rate, which is what produces actual depth: the near
  // sheet slides past the far one instead of the whole texture moving as
  // a single plane.
  vec2 rp = p * 1.15 + vec2(0.0, uProgress * 0.9);
  float rt = uTime * 0.09;

  float h = 0.0;        // accumulated height field
  float nearBand = 0.0; // the nearest sheet alone, for specular
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    // Nearer sheets are larger on screen and travel further with scroll.
    float scale = 1.5 - fi * 0.36;
    float depth = 1.0 - fi * 0.3;
    vec2 q = rp * scale + vec2(fi * 1.7, uProgress * fi * 0.5);

    float a = snoise(q * 1.4 + rt * (1.0 + fi * 0.35));
    float b = snoise(q * 2.3 - rt * 0.8 + a * 0.9);
    float c = snoise(q * 0.8 + b * 0.85);

    float sheet = pow(smoothstep(0.18, 0.95, c), 1.5) * depth;
    h += sheet;
    if (i == 0) nearBand = sheet;
  }
  h /= 1.9;

  // Normal from the height field by central difference. This is what
  // makes the waves read as rounded volumes catching light rather than
  // as flat painted shapes — the single change that reads as "3D".
  float e = 0.012;
  float hx = snoise((rp + vec2(e, 0.0)) * 2.1 + rt) -
             snoise((rp - vec2(e, 0.0)) * 2.1 + rt);
  float hy = snoise((rp + vec2(0.0, e)) * 2.1 + rt) -
             snoise((rp - vec2(0.0, e)) * 2.1 + rt);
  vec3 nrm = normalize(vec3(-hx * 1.6, -hy * 1.6, 0.85));

  // Light arrives from the source, so the shading agrees with where the
  // page's glow actually is instead of an invented light direction.
  vec3 ldir = normalize(vec3(src - p, 0.55));
  float diffuse = max(0.0, dot(nrm, ldir));

  // Blinn-Phong specular on the nearest sheet only. Confining it to one
  // layer keeps the highlight reading as a crest rather than frosting
  // the entire field.
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfV = normalize(ldir + viewDir);
  float spec = pow(max(0.0, dot(nrm, halfV)), 26.0) * nearBand;

  // Rim: grazing angles brighten, which is what gives a wave a visible
  // edge and stops the sheets merging into one mass.
  float rim = pow(1.0 - max(0.0, dot(nrm, viewDir)), 2.6);

  float lit = 0.3 + 0.7 * clamp(fall * 3.2, 0.0, 1.0);
  float ribbonLit = h * lit * (0.55 + 0.75 * diffuse);

  // ── Composite ─────────────────────────────────────────────────────
  vec3 ground = vec3(0.043, 0.043, 0.051);
  vec3 color = ground;

  // Shadow side of the waves: a whisper of cool dark green so the
  // texture reads in the unlit regions as tone, not just as lime.
  color += vec3(0.018, 0.044, 0.02) * h * 0.6;
  color += uLight * ribbonLit * uTexture;

  // Rim and specular are gated by proximity to the source: a highlight
  // in a region with no light reaching it would be a lie about the
  // geometry, and it is the thing that makes cheap shader work look
  // pasted on.
  color += uLight * rim * lit * uTexture * 0.5;
  color += mix(uLight, vec3(1.0), 0.45) * spec * lit * 0.85;

  color += uLight * scatter * uExposure;
  color += uBounce * bounce * uExposure * 0.13;

  color += vec3(1.0) * pow(max(0.0, fall - 0.72), 2.0) * 0.32;

  gl_FragColor = vec4(color, 1.0);
}`;

export type AmbientFieldProps = {
  /** 0-1 scroll progress across the document, shared with the DOM layers. */
  progressRef?: RefObject<number>;
  /** Light position in 0-1 GL space (origin bottom-left). Behind the ring. */
  source?: [number, number];
  light?: [number, number, number];
  bounce?: [number, number, number];
  /** Brightness of the light source; the contrast lever for copy. */
  exposure?: number;
  /** Brightness of the ribbon texture; the "how alive is the frame" lever. */
  texture?: number;
  className?: string;
};

export function AmbientField({
  progressRef,
  source = [0.76, 0.74],
  light = [0.776, 1.0, 0.239],
  bounce = [1.0, 0.478, 0.102],
  exposure = 0.46,
  texture = 0.17,
  className = "",
}: AmbientFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const opts = useRef({ source, light, bounce, exposure, texture });
  useEffect(() => {
    opts.current = { source, light, bounce, exposure, texture };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;

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
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0.043, 0.043, 0.051, 1);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const o = opts.current;
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
        uTexture: { value: o.texture },
        uProgress: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h, w / h];
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = false;

    const draw = (now: number) => {
      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uProgress.value = progressRef?.current ?? 0;
      program.uniforms.uExposure.value = opts.current.exposure;
      program.uniforms.uTexture.value = opts.current.texture;
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
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [progressRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
