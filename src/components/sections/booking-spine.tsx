/** The order is load-bearing: each step exists because the one before it
 *  established something. Rows name the failure they prevent, drawn from the
 *  cross-platform complaint patterns in RESEARCH_BRIEF.md. */
const STEPS = [
  {
    title: "Verify once",
    detail:
      "Licence and KYC approved a single time, tiered by category: none for a scooter, commercial for a backhoe.",
    prevents: "Re-uploading documents for every booking",
  },
  {
    title: "Choose your mode",
    detail:
      "On Heavy & Farm, pick self-drive or operator-included at checkout. Both rates sit side by side before you commit.",
    prevents: "Finding out at handover that no operator is coming",
  },
  {
    title: "See the whole price",
    detail:
      "Every conditional fee (late return, delivery, fuel, deposit) is itemised on the booking summary.",
    prevents: "Charges that only appear at checkout",
  },
  {
    title: "Photograph the handover",
    detail:
      "A timestamped condition record at pickup and return. Mandatory, both ends, for every rental.",
    prevents: "Deposit disputes you have no evidence to win",
  },
  {
    title: "Reach a person mid-rental",
    detail:
      "Live human escalation while the rental is running. A flagged mechanical fault waives its own fees automatically.",
    prevents: "A chatbot loop while you are stranded",
  },
  {
    title: "Bank the trust",
    detail:
      "On-time, undamaged, well-communicated returns raise your score and unlock the next tier of vehicle.",
    prevents: "Starting from zero on every platform you use",
  },
];

export function BookingSpine() {
  return (
    <section
      aria-labelledby="spine-heading"
      className="border-t border-charcoal-1 bg-obsidian-light"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="max-w-[55ch]">
          <h2
            id="spine-heading"
            className="font-heading text-3xl font-bold tracking-[-0.02em] text-pearl md:text-4xl"
          >
            The spine of every rental
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pearl-dim">
            Same six steps whether it is a ₹399 scooter or a ₹18,900 excavator.
            Each one is here because the industry keeps getting it wrong.
          </p>
        </div>

        <ol className="mt-12 border-t border-charcoal-1">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[2rem_1fr] gap-x-4 gap-y-2 border-b border-charcoal-1 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,18rem)] md:gap-x-8"
            >
              <span
                data-figure
                aria-hidden="true"
                className="font-heading text-sm font-medium tabular-nums text-pearl-muted"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h3 className="font-heading text-lg font-semibold text-pearl">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-pearl-dim">
                  {step.detail}
                </p>
              </div>

              <p className="col-start-2 text-xs leading-relaxed text-pearl-muted md:col-start-3 md:border-l md:border-charcoal-1 md:pl-6">
                <span className="font-medium text-orange">Prevents </span>
                {step.prevents.toLowerCase()}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
