"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BadgeCheck,
  Camera,
  Headphones,
  ReceiptText,
  SlidersHorizontal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SectionIntro } from "@/components/ui/section-intro";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The order is load-bearing: each step exists because the one before it
 *  established something. Rows name the failure they prevent, drawn from the
 *  cross-platform complaint patterns in docs/DECISIONS.md#research-basis. */
const STEPS: {
  title: string;
  detail: string;
  prevents: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Verify once",
    detail:
      "Licence and KYC approved a single time, tiered by category: none for a scooter, commercial for a backhoe.",
    prevents: "Re-uploading documents for every booking",
    icon: BadgeCheck,
  },
  {
    title: "Choose your mode",
    detail:
      "On Heavy & Farm, pick self-drive or operator-included at checkout. Both rates sit side by side before you commit.",
    prevents: "Finding out at handover that no operator is coming",
    icon: SlidersHorizontal,
  },
  {
    title: "See the whole price",
    detail:
      "Every conditional fee (late return, delivery, fuel, deposit) is itemised on the booking summary.",
    prevents: "Charges that only appear at checkout",
    icon: ReceiptText,
  },
  {
    title: "Photograph the handover",
    detail:
      "A timestamped condition record at pickup and return. Mandatory, both ends, for every rental.",
    prevents: "Deposit disputes you have no evidence to win",
    icon: Camera,
  },
  {
    title: "Reach a person mid-rental",
    detail:
      "Live human escalation while the rental is running. A flagged mechanical fault waives its own fees automatically.",
    prevents: "A chatbot loop while you are stranded",
    icon: Headphones,
  },
  {
    title: "Bank the trust",
    detail:
      "On-time, undamaged, well-communicated returns raise your score and unlock the next tier of vehicle.",
    prevents: "Starting from zero on every platform you use",
    icon: TrendingUp,
  },
];

/**
 * The six steps as an actual spine: one rail running the height of the
 * list, with a node per step, and a lime fill that tracks scroll through
 * the section.
 *
 * This was six text rows before. It is the most important explanation on
 * the page and it was the least visual, which is the gap that made the
 * page read as a document. The rail is not decoration — it is the claim
 * the section makes, that these steps are one connected sequence rather
 * than six independent features.
 *
 * The fill scrubs rather than animating once, so the reader's own scroll
 * is what advances it and the rail always reflects where they are.
 */
export function BookingSpine() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rail = root.current?.querySelector(".spine-fill");
      if (!rail) return;

      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            // Starts when the list reaches mid-viewport and completes as it
            // leaves, so the fill maps to reading position, not to the
            // section merely being on screen.
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      aria-labelledby="spine-heading"
      className="border-t border-charcoal-1 bg-obsidian-light"
    >
      <div
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index="04"
          kicker="The spine"
          headingId="spine-heading"
          heading="The spine of every rental"
          lede="Same six steps whether it is a ₹399 scooter or a ₹18,900 excavator. Each one is here because the industry keeps getting it wrong."
        />

        <div ref={root} className="relative mt-16 md:mt-24">
          {/* The rail. Sits behind the nodes and is hidden from assistive
              tech: the ordered list already conveys sequence. */}
          <div aria-hidden="true" className="spine-rail">
            <div className="spine-fill" />
          </div>

          <ol className="relative space-y-12 md:space-y-16">
            {STEPS.map(({ title, detail, prevents, icon: Icon }, index) => (
              <li
                key={title}
                data-reveal
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,17rem)] md:gap-x-10"
              >
                {/* Node: opaque background so the rail passes behind it
                    rather than through it. */}
                <div className="relative flex justify-center">
                  <span className="spine-node">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span
                      data-figure
                      aria-hidden="true"
                      className="font-heading text-sm font-bold tabular-nums text-lime"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-pearl">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-pearl-dim">
                    {detail}
                  </p>
                </div>

                <p className="col-start-2 mt-3 text-xs leading-relaxed text-pearl-muted md:col-start-3 md:mt-0 md:border-l md:border-charcoal-1 md:pl-6">
                  <span className="font-medium text-orange">Prevents </span>
                  {prevents.toLowerCase()}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
