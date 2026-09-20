/**
 * The editorial header every major section shares.
 *
 * Four sections previously opened with the same shape — an h2 and a
 * paragraph — which is why the page read as a document rather than a
 * product. This gives each one an index, a kicker and a rule that runs to
 * the margin, so the eye gets a masthead to land on before the prose.
 *
 * The index is the loud element and it is deliberately unfilled: an
 * outlined numeral reads as a chapter mark, where a solid one competes
 * with the price and trust figures that are supposed to be the only loud
 * numbers on the page.
 */
export function SectionIntro({
  index,
  kicker,
  heading,
  headingId,
  lede,
  children,
}: {
  /** Two-digit chapter number, e.g. "01". */
  index: string;
  kicker: string;
  heading: React.ReactNode;
  headingId?: string;
  lede?: React.ReactNode;
  /** Optional trailing slot, e.g. a link, aligned to the rule on desktop. */
  children?: React.ReactNode;
}) {
  return (
    <header className="section-intro">
      <div data-reveal className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="section-index font-heading font-bold leading-none tracking-[-0.04em]"
        >
          {index}
        </span>
        <span className="font-body text-xs font-medium uppercase tracking-[0.2em] text-orange">
          {kicker}
        </span>
        {/* Rule runs out to the container edge: it measures the section's
            width, which is what makes the header feel typeset rather than
            centred in a box. */}
        <span aria-hidden="true" className="section-rule" />
      </div>

      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[24ch]">
          <h2
            id={headingId}
            data-reveal
            data-reveal-delay="1"
            className="font-heading font-bold leading-[1.06] tracking-[-0.03em] text-pearl"
            style={{ fontSize: "var(--text-h1)" }}
          >
            {heading}
          </h2>
        </div>

        {lede && (
          <p
            data-reveal
            data-reveal-delay="2"
            className="max-w-[46ch] text-lg leading-relaxed text-pearl-dim md:text-right"
          >
            {lede}
          </p>
        )}
      </div>

      {children}
    </header>
  );
}
