import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { SectionIntro } from "@/components/ui/section-intro";

/**
 * The frame every secondary page shares: nav, one editorial masthead, a
 * measured prose column, footer.
 *
 * These pages exist because the homepage links to them. A 404 on a live
 * demo is worse than a short page, and a short page that is honest about
 * being short is better than filler pretending to be finished.
 */
export function PageShell({
  index,
  kicker,
  heading,
  lede,
  children,
}: {
  index: string;
  kicker: string;
  heading: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        className="mx-auto max-w-7xl px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SectionIntro
          index={index}
          kicker={kicker}
          heading={heading}
          lede={lede}
        />
        {/* 68ch: the measure where body copy stays comfortable to read. */}
        <div className="mt-16 max-w-[68ch] space-y-6 text-base leading-relaxed text-pearl-dim md:mt-24">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Subheading inside a prose page, on the shared heading scale. */
export function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="pt-4 font-heading text-lg font-semibold text-pearl">
      {children}
    </h2>
  );
}

/** Marks copy that is deliberately provisional, so nobody mistakes a
 *  placeholder policy for a decided one. */
export function PreviewNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[var(--radius-md)] border border-charcoal-2 bg-obsidian-light px-4 py-3 text-sm text-pearl-muted">
      {children}
    </p>
  );
}
