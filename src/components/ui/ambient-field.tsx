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

// One wave sheet's raw, domain-warped height at depth index fi. A function
// rather than inline in the loop because the normal needs to sample the
// nearest sheet again at offset points — it has to be the identical
// surface, or the lighting describes a shape that is not on screen.
float sheetNoise(vec2 rp, float fi, float rt) {
  // Nearer sheets are larger on screen and travel further with scroll.
  float scale = 1.5 - fi * 0.36;
  vec2 q = rp * scale + vec2(fi * 1.7, uProgress * fi * 0.5);
  float a = snoise(q * 1.4 + rt * (1.0 + fi * 0.35));
  float b = snoise(q * 2.3 - rt * 0.8 + a * 0.9);
  return snoise(q * 0.8 + b * 0.85);
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
  float nearRaw = 0.0;  // its unshaped noise, reused for the normal
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float depth = 1.0 - fi * 0.3;
    float c = sheetNoise(rp, fi, rt);

    float sheet = pow(smoothstep(0.18, 0.95, c), 1.5) * depth;
    h += sheet;
    if (i == 0) {
      nearBand = sheet;
      nearRaw = c;
    }
  }
  h /= 1.9;

  // Normal from the *same* function that draws the nearest sheet, by
  // forward difference. An earlier version took the normal from an
  // unrelated noise call, so the lighting described a surface nobody
  // could see and highlights landed between the ribbons instead of on
  // them. Glass reads as glass mostly because its highlights ride the
  // crests exactly; this is what makes ours do the same. Two extra
  // evaluations, reusing the loop's first sample as the centre point.
  //
  // The step is deliberately wide. At 0.01 the difference picked up every
  // fine eddy of the domain warp and the surface read as thin marbled
  // veins; a wider step averages those out, so the shading follows the
  // broad folds — thick glass rather than a contour map — while the
  // ribbon shapes themselves are untouched.
  float e = 0.045;
  float gx = (sheetNoise(rp + vec2(e, 0.0), 0.0, rt) - nearRaw) / e;
  float gy = (sheetNoise(rp + vec2(0.0, e), 0.0, rt) - nearRaw) / e;
  vec3 nrm = normalize(vec3(-gx * 0.24, -gy * 0.24, 1.0));

  // Light arrives from the source, so the shading agrees with where the
  // page's glow actually is instead of an invented light direction.
  vec3 ldir = normalize(vec3(src - p, 0.55));
  float diffuse = max(0.0, dot(nrm, ldir));

  // Two specular lobes on the nearest sheet only. The broad one is sheen
  // across the slope; the tight one is the glint — the thin bright line
  // that is most of what makes a liquid-glass surface look wet rather
  // than matte. Confined to one layer so it reads as a crest rather than
  // frosting the whole field.
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfV = normalize(ldir + viewDir);
  float nh = max(0.0, dot(nrm, halfV));
  float sheen = pow(nh, 24.0) * nearBand;
  float glint = pow(nh, 64.0) * smoothstep(0.35, 0.8, nearBand);

  // Fresnel-style rim: grazing angles brighten, which gives each ribbon a
  // visible edge and stops the sheets merging into one mass.
  float rim = pow(1.0 - max(0.0, dot(nrm, viewDir)), 2.4);

  // Two gates. 'lit' keeps a floor so the field reads everywhere as tone;
  // 'reach' has none, and every new bright term rides on it — a glint on
  // the far side of the frame from the light would be a lie about the
  // geometry, and the copy column lives on that far side.
  float reach = clamp(fall * 3.2, 0.0, 1.0);
  float lit = 0.3 + 0.7 * reach;
  // 'crest' is tighter still: zero until the light is genuinely strong.
  // Every highlight term rides it, so glints form a pool around the ring
  // and fall to nothing well before the copy column — radial, not a
  // screen-space mask, so it holds at every breakpoint and every scroll
  // position the source travels to.
  float crest = smoothstep(0.45, 0.9, reach);

  // Glass is a dark body with bright edges, not a bright fill. Less of
  // the lift comes from diffuse fill now and more from rim and glint,
  // which widens the value range inside each ribbon — deep in the
  // trough, bright on the crest — without adding overall light.
  float ribbonLit = h * lit * (0.4 + 0.7 * diffuse);

  // ── Composite ─────────────────────────────────────────────────────
  vec3 ground = vec3(0.043, 0.043, 0.051);
  vec3 color = ground;

  // Two tints, both from the lime family already in the palette. Bodies
  // sit toward the deep lime (--color-lime-active); crests move toward
  // white. That hue travel across one surface is the reference's other
  // trick, done here without importing its yellow.
  vec3 deep = vec3(0.30, 0.55, 0.07);
  vec3 bodyTint = mix(deep, uLight, diffuse);

  // Shadow side of the waves: a whisper of cool dark green so the
  // texture reads in the unlit regions as tone, not just as lime.
  color += vec3(0.018, 0.044, 0.02) * h * 0.6;
  color += bodyTint * ribbonLit * uTexture;

  // Rim, sheen and glint all ride 'crest'. On the floored 'lit' gate they
  // lit ribbon edges on the dark side too: real normals mean some slope
  // there always faces the light. A/B under an identical 12-frame scan of
  // the hero subcopy: previous shader 7.56:1, highlights on 'lit' 3.24:1.
  // Rim keeps a hairline floor so edges still read as tone in the dark.
  color += uLight * rim * (0.06 + 0.94 * crest) * uTexture * 0.45;
  color += mix(uLight, vec3(1.0), 0.45) * sheen * crest * 0.8;
  color += mix(uLight, vec3(1.0), 0.7) * glint * crest * 0.9;

  color += uLight * scatter * uExposure;
  color += uBounce * bounce * uExposure * 0.13;

  color += vec3(1.0) * pow(max(0.0, fall - 0.72), 2.0) * 0.32;

  gl_FragColor = vec4(color, 1.0);
}`;

export type AmbientFieldProps = {
  /** 0-1 scroll progress across the document, shared with the DOM layers. */
  progressRef?: RefObject<number>;
  /** Fallback light position in 0-1 GL space (origin bottom-left), used
   *  only when the page has no [data-light-anchor] to measure. */
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

    // The light lives behind the trust ring, so it is measured from the
    // ring rather than pinned to a screen position. It used to be fixed at
    // [0.76, 0.74] — right for the desktop two-column hero, wrong below
    // 1024px where the hero stacks: the ring drops under the copy and the
    // pinned light sat directly behind the paragraph instead. Measured on
    // the live build at 900px wide, the subcopy fell to 1.08:1.
    //
    // Document coordinates, not viewport: this is the source's rest
    // position at the top of the page, and the shader's own scroll term
    // walks it from there.
    const placeLight = () => {
      const anchor = document.querySelector<HTMLElement>("[data-light-anchor]");
      if (!anchor) {
        program.uniforms.uSource.value = opts.current.source;
        return;
      }
      // --light-anchor names the point on the anchor where the light sits,
      // as fractions of its box. A CSS custom property rather than an
      // attribute so media queries can move it: the light belongs on the
      // side of the ring facing away from the copy, and which side that is
      // depends on the layout. Unset means dead centre.
      const [fx, fy] = (
        getComputedStyle(anchor).getPropertyValue("--light-anchor").trim() ||
        "0.5 0.5"
      )
        .split(/\s+/)
        .map(Number);
      const r = anchor.getBoundingClientRect();
      const x = (r.left + r.width * (fx || 0.5)) / window.innerWidth;
      const y =
        1 - (r.top + window.scrollY + r.height * (fy || 0.5)) / window.innerHeight;
      // A ring far below the fold still places a light, just off-frame;
      // clamped so an extreme layout cannot push it to infinity.
      program.uniforms.uSource.value = [x, Math.max(-1.5, Math.min(1.2, y))];
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h, w / h];
      placeLight();
    };
    resize();
    window.addEventListener("resize", resize);
    // The ring enters with a translate-up reveal; measure again once it has
    // landed so the light is placed against its resting position.
    const settle = window.setTimeout(placeLight, 1400);

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
      window.clearTimeout(settle);
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
