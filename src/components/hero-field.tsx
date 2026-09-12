"use client";

import { useEffect, useRef } from "react";

/**
 * Perspective ground plane rendered on the GPU — the page's one authored
 * moment of depth. Written as a raw single-pass shader rather than pulled
 * from a 3D library: this ships in ~2KB and holds 60fps on the laptop the
 * demo runs on. Falls back to the CSS ground underneath when WebGL is
 * unavailable, and freezes under prefers-reduced-motion.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float horizon = 0.58;
  vec3 col = vec3(0.0);

  if (uv.y < horizon) {
    float d = horizon - uv.y;
    float z = 0.075 / max(d, 0.0009);
    float x = (uv.x - 0.5) * z * 1.25;
    float travel = uTime * 0.22;

    // Line width is held near-constant in screen space so rows read as lines
    // at every depth; letting it grow with d turned the near field into wash.
    float w = 0.016 + d * 0.035;
    float gx = abs(fract(x) - 0.5);
    float gz = abs(fract(z - travel) - 0.5);
    float grid = smoothstep(w, 0.0, gx) * 0.8 + smoothstep(w, 0.0, gz);

    // Fade only where rows compress past resolution right at the horizon.
    // The near field is left to survive to the canvas bottom — it's the
    // CSS mask's job to fade the very bottom of the section, not the shader's.
    float depth = smoothstep(0.0, 0.045, d);

    // Rows falling away toward the edges keeps the centre column legible.
    float vignette = 1.0 - smoothstep(0.25, 0.62, abs(uv.x - 0.5));

    col += vec3(0.46, 0.58, 0.22) * grid * depth * vignette * 0.85;
  }

  // Horizon bloom, the only place lime touches the backdrop.
  float bloom = exp(-abs(uv.y - horizon) * 34.0);
  col += vec3(0.776, 1.0, 0.239) * bloom * 0.06;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: true }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vert || !frag || !program) return;

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      // Capped DPR: the plane is soft, and fill rate is the whole cost here.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let running = false;
    const start = performance.now();

    const draw = (now: number) => {
      resize();
      gl.uniform1f(uTime, reduced.matches ? 12 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running && !reduced.matches) raf = requestAnimationFrame(draw);
    };

    const run = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    // Never burn frames on a hero nobody is looking at.
    const io = new IntersectionObserver(
      ([entry]) => run(entry.isIntersecting && !document.hidden),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => run(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", onResize);

    requestAnimationFrame(draw);

    return () => {
      run(false);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
