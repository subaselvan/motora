import { CATEGORIES } from "@/lib/vehicles";

/**
 * The page's one full-bleed moment.
 *
 * Every other section is a centred max-w-7xl column, which is legible but
 * monotonous — the reference set (Cowboy, Portal One, Lotus) all break
 * their rhythm with something that runs edge to edge. This is that break,
 * and it costs no assets: the type is the graphic.
 *
 * The track is duplicated and the animation travels exactly -50%, so the
 * second copy lands where the first began and the seam is invisible. A
 * mask fades both edges, otherwise words pop in and out at the viewport
 * boundary and the loop becomes obvious.
 */
const WORDS = ["Rent anything that moves", ...CATEGORIES.map((c) => c.label)];

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="marquee-track" aria-hidden={ariaHidden || undefined}>
      {WORDS.map((word, i) => (
        <span key={`${word}-${i}`} className="marquee-item">
          {word}
          <span aria-hidden="true" className="marquee-dot" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="Categories MOTORA rents"
      className="marquee border-y border-charcoal-1 py-10"
    >
      <div className="marquee-viewport">
        <Track />
        {/* The duplicate exists only to make the loop seamless; it must not
            be read out twice. */}
        <Track ariaHidden />
      </div>
    </section>
  );
}
