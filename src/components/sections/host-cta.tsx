import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HostCta() {
  return (
    <section aria-labelledby="host-cta-heading" className="border-t border-obsidian-lighter">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="rounded-xl border border-obsidian-lighter bg-obsidian-light p-8 shadow-[var(--shadow-glow)] md:p-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="host-cta-heading" className="max-w-md font-heading text-2xl font-bold text-pearl md:text-3xl">
                Own a vehicle? Earn with MOTORA.
              </h2>
              <p className="mt-2 max-w-md text-pearl-dim">
                List your bike, car, or equipment and start earning when
                you&apos;re not using it — you set the price and the
                approval terms.
              </p>
            </div>
            <Button variant="lime" size="lg" asChild>
              <Link href="/host-landing">List your vehicle</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
