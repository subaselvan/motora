/**
 * Hero mesh gradient. Four soft lime/orange washes drifting over obsidian.
 *
 * CSS only, on purpose: radial-gradient stops are already smooth, so the
 * "blurred blob" look needs no filter and no shader, and the whole layer
 * animates on transform alone — compositor work, no per-frame paint.
 *
 * Durations are deliberately coprime (23/29/37/43s) with alternating
 * direction, so the four blobs never return to the same relative
 * arrangement inside a session. That is what keeps it from reading as a
 * loop; a single shared duration is what makes mesh gradients look cheap.
 *
 * Alpha is budgeted, not eyeballed: see the contrast note in globals.css.
 */
export function HeroMesh() {
  return (
    <div
      aria-hidden="true"
      className="hero-mesh pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <span className="hero-blob hero-blob-a" />
      <span className="hero-blob hero-blob-b" />
      <span className="hero-blob hero-blob-c" />
      <span className="hero-blob hero-blob-d" />
      {/* Static dither. Dark gradients band badly on 8-bit panels; a fixed
          noise wash costs one paint and hides it. */}
      <span className="hero-mesh-grain" />
    </div>
  );
}
