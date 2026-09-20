import Link from "next/link";
import { Plus } from "lucide-react";
import { SectionIntro } from "@/components/ui/section-intro";

/**
 * Objections answered inline rather than on a page the reader has to
 * leave for — the Turo and Sixt pattern. Every answer here is something
 * the product actually does; none of them state an undecided policy,
 * which is why deposit amounts are described by mechanism rather than by
 * number.
 *
 * Native details/summary: it opens with JavaScript disabled, it is
 * keyboard operable for free, and screen readers announce expanded state
 * without any aria bookkeeping for us to get wrong.
 */
const FAQS = [
  {
    q: "Do I get the exact vehicle on the card?",
    a: "Yes. You book a specific vehicle, not a class that gets reassigned at the counter. On Heavy & Farm no machine is substituted on the day without your say-so.",
  },
  {
    q: "What licence do I need?",
    a: "It is tiered by category: none for a low-speed EV, a two-wheeler licence for bikes and scooters, LMV for cars, and a commercial licence to self-drive anything heavy. You verify once and it is reused for every later booking. Book a heavy machine with an operator and you need no licence of your own.",
  },
  {
    q: "How do deposits and fees work?",
    a: "Every conditional fee — late return, delivery, fuel, deposit — is itemised on the booking summary before you commit. The rule is that nothing new appears at checkout.",
  },
  {
    q: "What stops a damage dispute?",
    a: "A timestamped photo record at pickup and return, mandatory at both ends. It is evidence rather than recollection, which is what makes a deposit argument resolvable.",
  },
  {
    q: "What if it breaks down mid-rental?",
    a: "You reach a person, not a chatbot queue. A mechanical fault you flag waives the fees tied to it automatically, rather than being billed to you and argued about later.",
  },
  {
    q: "How does the trust score actually work?",
    a: "One record across all seven categories. Returning on time, documenting condition and communicating raise it; late returns and undocumented damage lower it. Each category has a threshold, so the score is what unlocks the next tier of vehicle.",
  },
];

export function Faq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-charcoal-1"
    >
      <div
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index="06"
          kicker="Before you ask"
          headingId="faq-heading"
          heading="The questions that decide it"
          lede="Answered here rather than on a page you have to go and find. Every answer describes something the product does."
        />

        <div className="mt-16 max-w-[72ch] md:mt-24" data-reveal-group>
          {FAQS.map(({ q, a }) => (
            <details key={q} data-reveal-item className="faq-item group">
              <summary className="faq-summary">
                <span className="font-heading text-base font-semibold text-pearl">
                  {q}
                </span>
                <Plus
                  size={18}
                  aria-hidden="true"
                  className="faq-icon shrink-0 text-pearl-muted"
                />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-pearl-dim">
                {a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-sm text-pearl-dim">
          Still deciding?{" "}
          <Link
            href="/faq"
            className="rounded-[var(--radius-sm)] text-orange underline transition-colors duration-[var(--duration-short)] hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            The longer list
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
